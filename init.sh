#!/bin/bash

set -o errexit

# Check if exactly one argument is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <project-path"
  exit 1
fi

FOLDER_PATH=$1

# check if the folder exists and print an error if it does
if [ -d "$FOLDER_PATH" ]; then
  echo "Error: Folder already exists, provide a new folder for initilizing a cdk project"
  exit 1
fi


SCRIPT_PATH=$(realpath "$BASH_SOURCE")

# create the folder
mkdir -p "$FOLDER_PATH"

# initialize the cdk project
cd "$FOLDER_PATH" && npx cdk init app --language=typescript

# copy the cdk.json file
cp "$(dirname $SCRIPT_PATH)/.eslintrc.js" "$FOLDER_PATH"
cp "$(dirname $SCRIPT_PATH)/.gitignore" "$FOLDER_PATH"
cp "$(dirname $SCRIPT_PATH)/.prettierrc.js" "$FOLDER_PATH"
cp "$(dirname $SCRIPT_PATH)/.lintstagedrc.json" "$FOLDER_PATH"
cp "$(dirname $SCRIPT_PATH)/tsconfig.json" "$FOLDER_PATH"
cp "$(dirname $SCRIPT_PATH)/utils.ts" "$FOLDER_PATH"/lib
cp "$(dirname $SCRIPT_PATH)/config.ts" "$FOLDER_PATH"/lib

# install the required dependencies
npm install -D \
  prettier \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-config-prettier \
  husky \
  lint-staged

# add the lint-staged and husky configuration
npx husky init
echo "npx lint-staged" > .husky/pre-commit
