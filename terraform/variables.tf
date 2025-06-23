variable "github_token" {
  description = "GitHub OAuth token for CodePipeline. Should be set via a tfvars file and kept secret."
  type        = string
  sensitive   = true  
}