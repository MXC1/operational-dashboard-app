output "pipeline_name" {
  description = "The name of the CodePipeline."
  value       = aws_codepipeline.site_pipeline.name
}

output "codebuild_project_name" {
  description = "The name of the CodeBuild project."
  value       = aws_codebuild_project.site_build.name
}

output "codepipeline_role_arn" {
  description = "The ARN of the CodePipeline IAM role."
  value       = aws_iam_role.codepipeline_role.arn
}

output "codebuild_role_arn" {
  description = "The ARN of the CodeBuild IAM role."
  value       = aws_iam_role.codebuild_role.arn
}

output "codestar_connection_arn" {
  description = "The ARN of the CodeStar Connection to GitHub."
  value       = aws_codestarconnections_connection.github.arn
}
