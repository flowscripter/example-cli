#!/bin/sh

set -e  # Exit on error

# Define the download URL
URL="https://github.com/flowscripter/example-cli/releases/latest/download/example-cli_Linux_x86_64.zip"

# Create a temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download and extract
echo "Downloading example-cli..."
curl -fsSL "$URL" -o executable.zip
unzip executable.zip

# Install
chmod +x example-cli
sudo mv example-cli /usr/local/bin/

# Clean up
cd -
rm -rf "$TMP_DIR"

echo "✅ Installation complete! Run 'example-cli' to get started."
