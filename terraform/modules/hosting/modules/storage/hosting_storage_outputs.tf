output "site_bucket_name" {
  description = "The name of the S3 bucket for static site hosting."
  value       = aws_s3_bucket.site_bucket.bucket
}

output "site_bucket_arn" {
  description = "The ARN of the S3 bucket for static site hosting."
  value       = aws_s3_bucket.site_bucket.arn
}

output "site_bucket_regional_domain_name" {
  description = "The regional domain name of the S3 bucket for static site hosting."
  value       = aws_s3_bucket.site_bucket.bucket_regional_domain_name
}
