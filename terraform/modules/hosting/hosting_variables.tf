variable "site_bucket_name" {
  description = "Name of the S3 bucket for static site hosting."
  type        = string
}

variable "pipeline_name" {
  description = "Name of the CodePipeline."
  type        = string
}

variable "codebuild_project_name" {
  description = "Name of the CodeBuild project."
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to deploy from."
  type        = string
}

variable "github_token" {
  description = "GitHub OAuth token for CodePipeline. Should be set via a tfvars file and kept secret."
  type        = string
  sensitive   = true
}
