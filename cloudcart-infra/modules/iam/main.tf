# ---------------------------------------------------------------------------
# IRSA role for the AWS Load Balancer Controller
# Trust policy restricts this role to ONLY the LBC's Kubernetes service account
# ---------------------------------------------------------------------------
resource "aws_iam_role" "lbc" {
  name = "${var.project_name}-lbc-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = var.oidc_provider_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${var.oidc_provider_url}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
          "${var.oidc_provider_url}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

# Official policy JSON from the aws-load-balancer-controller repo, vendored
# in modules/iam/policies/lbc-iam-policy.json — re-download it if AWS updates it:
# curl -o modules/iam/policies/lbc-iam-policy.json \
#   https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
resource "aws_iam_role_policy" "lbc" {
  name   = "${var.project_name}-lbc-policy"
  role   = aws_iam_role.lbc.id
  policy = file("${path.module}/policies/lbc-iam-policy.json")
}

# ---------------------------------------------------------------------------
# IRSA role for the EBS CSI Driver
# ---------------------------------------------------------------------------
resource "aws_iam_role" "ebs_csi" {
  name = "${var.project_name}-ebs-csi-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = var.oidc_provider_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${var.oidc_provider_url}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"
          "${var.oidc_provider_url}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ebs_csi" {
  role       = aws_iam_role.ebs_csi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}
