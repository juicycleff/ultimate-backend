terraform {
  required_version = ">= 0.12.0"
}

data "aws_availability_zones" "available" {
}

resource "random_string" "suffix" {
  length  = 4
  special = false
}

locals {
  cluster_name = "eks-${var.cluster-name}-${var.region}-${random_string.suffix.result}"
  worker_groups = [
    {
      # Other parameters omitted for brevity
      bootstrap_extra_args = "--enable-docker-bridge true"
    }
  ]
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  cluster_name = local.cluster_name
  subnets = module.vpc.public_subnets
  vpc_id = module.vpc.vpc_id

  worker_groups_launch_template = [
    {
      name = "worker-group-1"
      instance_type = "t2.small"
      asg_desired_capacity = 2
      public_ip = true
    },
    {
      name = "worker-group-2"
      instance_type = "t2.medium"
      asg_desired_capacity = 1
      public_ip = true
    },
  ]
}

