#!/bin/bash

# Script to pack toolbox and install it in demo projects
# Based on constitution/setup.md

set -e  # Exit on error

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Packing toolbox package..."

# Navigate to the package directory and pack it
cd toolbox

# Run npm pack and capture the output to get the tarball name
PACK_OUTPUT=$(npm pack 2>&1)
PACK_TARBALL=$(echo "$PACK_OUTPUT" | grep -oE '[^/]+\.tgz$' | tail -1)

if [ -z "$PACK_TARBALL" ]; then
    echo "❌ Error: Failed to determine packed tarball name"
    echo "npm pack output:"
    echo "$PACK_OUTPUT"
    exit 1
fi

PACK_TARBALL_PATH="$SCRIPT_DIR/toolbox/$PACK_TARBALL"

if [ ! -f "$PACK_TARBALL_PATH" ]; then
    echo "❌ Error: Packed tarball not found at $PACK_TARBALL_PATH"
    exit 1
fi

echo "✅ Packed: $PACK_TARBALL"
echo ""

# Install in storybook-9-demo
echo "📥 Installing in storybook-9-demo..."
cd "$SCRIPT_DIR/demos/storybook-9-demo"
npm install "$PACK_TARBALL_PATH"

# Install in storybook-10-demo
echo "📥 Installing in storybook-10-demo..."
cd "$SCRIPT_DIR/demos/storybook-10-demo"
npm install "$PACK_TARBALL_PATH"

echo ""
echo "✅ Setup complete! The package has been installed in both demo projects."
