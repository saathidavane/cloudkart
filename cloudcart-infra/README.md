# CloudCart Terraform — Fixed & Complete

## What was missing / fixed

Every module (`vpc`, `eks`, `ecr`, `rds`, `iam`, `acm`, `cloudfront`) previously only had `main.tf`.
Each module now has all three files:

```
modules/<name>/
├── main.tf
├── variables.tf   ← was missing
└── outputs.tf     ← was missing
```

Other bugs fixed along the way:
- `versions.tf` had a broken `profile = ` line with no value → removed (uses your default AWS CLI profile). Added `random` and `tls` providers, which `rds` and `eks` need.
- `eks` module didn't actually create the OIDC identity provider, so `iam`'s IRSA trust policies had nothing to reference → added `data "tls_certificate"` + `aws_iam_openid_connect_provider` to `modules/eks/main.tf`, exposed as `oidc_provider_arn` / `oidc_provider_url` outputs.
- `iam` module's Load Balancer Controller role had no attached IAM policy → added the official AWS policy JSON at `modules/iam/policies/lbc-iam-policy.json` (already downloaded for you) and attached it with `aws_iam_role_policy`.
- `iam` module's EBS CSI role had no permissions → attached `AmazonEBSCSIDriverPolicy`.
- Root `main.tf` didn't exist as a working file wiring modules together → added, in correct dependency order (ecr → vpc → eks → iam → rds → acm → cloudfront → Route 53 record).
- `rds` module's `deletion_protection` / `multi_az` were hardcoded → now variables so you can flip them for teardown without editing code.

## Folder structure

```
cloudcart-infra/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
├── backend.tf
├── terraform.tfvars.example
├── .gitignore
└── modules/
    ├── vpc/          (main.tf, variables.tf, outputs.tf)
    ├── eks/          (main.tf, variables.tf, outputs.tf)
    ├── ecr/          (main.tf, variables.tf, outputs.tf)
    ├── rds/          (main.tf, variables.tf, outputs.tf)
    ├── iam/          (main.tf, variables.tf, outputs.tf, policies/lbc-iam-policy.json)
    ├── acm/          (main.tf, variables.tf, outputs.tf)
    └── cloudfront/   (main.tf, variables.tf, outputs.tf)
```

## Step-by-step commands (full sequence, nothing skipped)

### 0. One-time setup

```bash
cd cloudcart-infra
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars   # fill in cf_origin_secret, confirm domain_name/app_subdomain

# Create the remote state bucket (once, manually)
aws s3 mb s3://cloudcart-tfstate-<ACCOUNT_ID> --region us-east-1
aws s3api put-bucket-versioning \
  --bucket cloudcart-tfstate-<ACCOUNT_ID> \
  --versioning-configuration Status=Enabled

# Put your real bucket name into backend.tf (replace <ACCOUNT_ID>)
nano backend.tf

terraform init
terraform validate
```

### 1. Phase 7 — ECR only

```bash
terraform plan  -target=module.ecr
terraform apply -target=module.ecr
```

### 2. Phase 8 — VPC / networking

```bash
terraform plan  -target=module.vpc
terraform apply -target=module.vpc
```

### 3. Phase 9 — EKS cluster + node group + OIDC + IRSA roles

```bash
terraform plan  -target=module.eks -target=module.iam
terraform apply -target=module.eks -target=module.iam

# Connect kubectl
aws eks update-kubeconfig --region us-east-1 --name cloudcart-cluster
kubectl get nodes            # expect 2 Ready nodes
kubectl get pods -A          # expect coredns, kube-proxy, vpc-cni Running
```

### 4. Phase 10 — push images + deploy to EKS (kubectl/docker, not Terraform)

```bash
# Get the ECR URLs
terraform output ecr_repository_urls

# Log in, tag, push (repeat per service)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker tag user-service:latest <ECR_URL_FOR_USER_SERVICE>:v1
docker push <ECR_URL_FOR_USER_SERVICE>:v1
# ...repeat for frontend, product-service, cart-service, order-service

kubectl apply -f k8s/namespaces/
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/hpa/
```

### 5. Phase 11 — RDS MySQL

```bash
terraform plan  -target=module.rds
terraform apply -target=module.rds

RDS_HOST=$(terraform output -raw rds_endpoint)
kubectl patch configmap cloudcart-config -n cloudcart --type merge \
  --patch "{\"data\":{\"DB_HOST\":\"${RDS_HOST}\"}}"

for SVC in user-service product-service cart-service order-service; do
  kubectl rollout restart deployment/$SVC -n cloudcart
done
```

### 6. Phase 12 — AWS Load Balancer Controller + Ingress

```bash
LBC_ROLE_ARN=$(terraform output -raw lbc_role_arn)

helm repo add eks https://aws.github.io/eks-charts
helm repo update

kubectl create serviceaccount aws-load-balancer-controller -n kube-system \
  --dry-run=client -o yaml | kubectl apply -f -
kubectl annotate serviceaccount aws-load-balancer-controller -n kube-system \
  eks.amazonaws.com/role-arn=$LBC_ROLE_ARN --overwrite

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=cloudcart-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

kubectl apply -f k8s/ingress/
kubectl get ingress -n cloudcart    # wait until ADDRESS is populated (the ALB DNS name)
```

### 7. Phase 13 — ACM certificate + HTTPS

```bash
terraform plan  -target=module.acm
terraform apply -target=module.acm

CERT_ARN=$(terraform output -raw certificate_arn)
# Put $CERT_ARN into the Ingress annotation alb.ingress.kubernetes.io/certificate-arn
kubectl apply -f k8s/ingress/
```

### 8. Phase 14 — CloudFront + final Route 53 cutover

Only now — after the Ingress/ALB from step 6 exists — apply the rest:

```bash
terraform plan
terraform apply
```

This creates the CloudFront distribution and the final `aws_route53_record.app` alias
pointing `cloudcart.sathidavane.xyz` at CloudFront.

```bash
curl -I https://cloudcart.sathidavane.xyz/assets/main.abc123.js   # X-Cache: Hit from cloudfront (2nd request)
curl -I https://cloudcart.sathidavane.xyz/api/products            # X-Cache: Miss from cloudfront (always)
```

### 9. Teardown (reverse order, when done)

```bash
kubectl delete ingress cloudcart-ingress -n cloudcart
kubectl delete namespace cloudcart

# Disable CloudFront before destroy will accept it
# in modules/cloudfront/main.tf set: enabled = false
terraform apply -target=module.cloudfront

# Disable RDS deletion protection
# set db_deletion_protection = false in terraform.tfvars
terraform apply -target=module.rds

terraform destroy

aws s3 rb s3://cloudcart-tfstate-<ACCOUNT_ID> --force
```
