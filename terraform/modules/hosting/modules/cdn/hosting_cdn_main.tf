# CloudFront distribution for the S3 static site
resource "aws_cloudfront_distribution" "site_cdn" {
  origin {
    domain_name = var.site_bucket_regional_domain_name
    origin_id   = "s3-site-origin"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.site_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-site-origin"
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_origin_access_identity" "site_oai" {
  comment = "OAI for S3 static site"
}

output "cloudfront_oai_canonical_user_id" {
  description = "The canonical user ID for the CloudFront OAI."
  value       = aws_cloudfront_origin_access_identity.site_oai.s3_canonical_user_id
}
