#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/.."
SERVER_SRC_DIR="$SCRIPT_DIR/../../my-blog-server/src"

# validate server directory exists before doing anything destructive
if [ ! -d "$SERVER_SRC_DIR" ]; then
  echo "Error: Server source directory not found: $SERVER_SRC_DIR"
  exit 1
fi

echo "Building Angular app..."
cd "$CLIENT_DIR"
npm run build

echo "Moving dist to server src..."
mv "$CLIENT_DIR/dist" "$SERVER_SRC_DIR/dist_new"

echo "Removing old dist from server..."
rm -rf "$SERVER_SRC_DIR/dist"

mv "$SERVER_SRC_DIR/dist_new" "$SERVER_SRC_DIR/dist"

echo "Done! Dist moved to $SERVER_SRC_DIR/dist"