#!/usr/bin/env bash
if [[ "$CI_COMMIT_BRANCH" == "master" ]];
then
  echo "Docker build start for production"
  docker-compose --project-directory=. -f docker/production/docker-compose.yml build
  docker-compose --project-directory=. -f docker/production/docker-compose.yml push
  echo "Docker build completed for production"
elif [[ "$CI_COMMIT_BRANCH" == "staging" ]];
then
  echo "Docker build start for staging"
  docker-compose --project-directory=. -f docker/staging/docker-compose.yml build
  docker-compose --project-directory=. -f docker/staging/docker-compose.yml push
  echo "Docker build completed for staging"

elif [[ "$CI_COMMIT_BRANCH" == "testing" ]];
then
  echo "Docker build start for testing"
  docker-compose --project-directory=. -f docker/testing/docker-compose.yml build
  docker-compose --project-directory=. -f docker/testing/docker-compose.yml push
  echo "Docker build completed for testing"
else
  echo "Docker build start for development"
  docker-compose --project-directory=. -f docker/development/docker-compose.yml build
  docker-compose --project-directory=. -f docker/development/docker-compose.yml push
  echo "Docker build completed for development"
fi
