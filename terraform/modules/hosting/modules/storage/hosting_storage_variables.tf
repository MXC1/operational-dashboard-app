variable "site_bucket_name" {
  description = "Name of the S3 bucket for static site hosting."
  type        = string
}

variable "codepipeline_role_arn" {
  description = "ARN of the CodePipeline IAM role allowed to access the bucket."
  type        = string
}

variable "codebuild_role_arn" {
  description = "ARN of the CodeBuild IAM role allowed to access the bucket."
  type        = string
}
