#! /bin/bash

source ./global.config

# Download library
git clone https://github.com/GoogleCloudPlatform/healthcare lib-healthcare
cp config.yaml lib-healthcare/deploy/

# Run bazel command
cd lib-healthcare/deploy/
bazel run cmd/apply:apply -- --config_path=config.yaml --projects=healthcare-293716 v2

