# Module composition for hosting
module "storage" {
  source = "./modules/storage"
  site_bucket_name      = var.site_bucket_name
  cloudfront_oai_canonical_user_id = module.cdn.cloudfront_oai_canonical_user_id
  codepipeline_role_arn = module.cicd.codepipeline_role_arn
  codebuild_role_arn    = module.cicd.codebuild_role_arn
}

module "cdn" {
  source = "./modules/cdn"
  site_bucket_name                  = module.storage.site_bucket_name
  site_bucket_arn                   = module.storage.site_bucket_arn
  site_bucket_regional_domain_name  = module.storage.site_bucket_regional_domain_name
}

module "cicd" {
  source = "./modules/cicd"
  pipeline_name          = var.pipeline_name
  codebuild_project_name = var.codebuild_project_name
  github_owner           = var.github_owner
  github_repo            = var.github_repo
  github_branch          = var.github_branch
  github_token           = var.github_token
  site_bucket_name       = module.storage.site_bucket_name
  site_bucket_arn        = module.storage.site_bucket_arn
  site_bucket_regional_domain_name = module.storage.site_bucket_regional_domain_name
}

output "cloudfront_oai_canonical_user_id" {
  description = "The canonical user ID for the CloudFront OAI."
  value       = module.cdn.cloudfront_oai_canonical_user_id
}