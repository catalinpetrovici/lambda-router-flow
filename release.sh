#!/bin/bash

read -p "Do you want to run a clean install and build? (Y/n): " answer

if [[ $answer == [Yy]* ]]; then
    echo "Cleaning dist, node_modules and pnpm-lock.yaml"
    rm -fr dist && rm -fr node_modules && rm -f && rm -f pnpm-lock.yaml

    echo "Instaling dependencies"
    pnpm install && pnpm install --shamefully-hoist 

    echo "Building"
    pnpm build

    echo "npm install completed"
else
    echo "Skipping clean install"
fi

# Read the current version from package.json
current_version=$(jq -r '.version' package.json)
echo "Current version: $current_version"

# Prompt for the increment level
read -p "Enter the increment level (major, minor, or patch): " increment_level

# Increment the version using semver
new_version=$(npx semver -i $increment_level $current_version)

# Update the version in package.json
jq --arg new_version "$new_version" '.version = $new_version' package.json > tmp.json && mv tmp.json package.json

# Print the updated version
echo "Version in package.json updated to $new_version"
echo "You can safely run pnpm publish"