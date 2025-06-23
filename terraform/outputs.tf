output "cloudfront_url" {
  description = "The CloudFront distribution domain name"
  value       = module.hosting.cloudfront_domain_name
}