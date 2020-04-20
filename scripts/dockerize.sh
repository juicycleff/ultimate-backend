#!/usr/bin/env bash

echo "Docker build started"
docker-compose --project-directory=. -f docker-compose.yml build
docker-compose --project-directory=. -f docker-compose.yml push
echo "Docker build completed"
