# S3 bucket for static website hosting
resource "aws_s3_bucket" "site_bucket" {
  bucket = var.site_bucket_name
}

resource "aws_s3_bucket_website_configuration" "site_bucket_website" {
  bucket = aws_s3_bucket.site_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "site_bucket_policy" {
  bucket = aws_s3_bucket.site_bucket.id
  policy = data.aws_iam_policy_document.site_bucket_policy.json
}

data "aws_iam_policy_document" "site_bucket_policy" {
  statement {
    sid       = "AllowCloudFrontOAIRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_bucket.arn}/*"]
    principals {
      type        = "CanonicalUser"
      identifiers = [var.cloudfront_oai_canonical_user_id]
    }
    effect = "Allow"
  }
  statement {
    sid       = "AllowCICDRolesAccess"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket", "s3:DeleteObject"]
    resources = [
      aws_s3_bucket.site_bucket.arn,
      "${aws_s3_bucket.site_bucket.arn}/*"
    ]
    principals {
      type        = "AWS"
      identifiers = [var.codepipeline_role_arn, var.codebuild_role_arn]
    }
    effect = "Allow"
  }
}

variable "cloudfront_oai_canonical_user_id" {
  description = "The canonical user ID for the CloudFront Origin Access Identity."
  type        = string
}
