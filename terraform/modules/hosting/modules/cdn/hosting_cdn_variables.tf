variable "site_bucket_name" {
  description = "Name of the S3 bucket for static site hosting."
  type        = string
}

variable "site_bucket_arn" {
  description = "ARN of the S3 bucket for static site hosting."
  type        = string
}

variable "site_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket for static site hosting."
  type        = string
}
