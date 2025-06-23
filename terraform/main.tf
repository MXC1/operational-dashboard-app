###########################
# Bootstrap configuration #
###########################
provider "aws" {
  region  = "eu-west-2"
  # profile = "operational-dashboard"
}

terraform {
  backend "s3" {
    bucket  = "operational-dashboard-tf-state"
    key     = "global/s3/terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true

    use_lockfile = true
  }
}

##################
# TFState module #
##################

module "terraform_state" {
  source = "./modules/terraform_state"
}

##################
# Hosting module #
##################

module "hosting" {
  source = "./modules/hosting"

  site_bucket_name = "operational-dashboard-${terraform.workspace}-site-bucket"
  pipeline_name = "${terraform.workspace}-pipeline"
  codebuild_project_name = "${terraform.workspace}-codebuild"
  github_owner = "MXC1"
  github_repo = "operational-dashboard-app"
  github_branch = "${terraform.workspace}"
  github_token = var.github_token
}