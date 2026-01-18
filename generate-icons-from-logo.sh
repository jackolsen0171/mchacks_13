#!/bin/bash
# Script to generate PWA icons from logo.png
# Requires: imagemagick (convert command)
# Usage: bash generate-icons-from-logo.sh

SOURCE_LOGO="./web/static/logo.png"
ICONS_DIR="./web/static/icons"

echo "Generating PWA icons from logo.png..."

# Check if logo.png exists
if [ ! -f "$SOURCE_LOGO" ]; then
    echo "Error: $SOURCE_LOGO not found!"
    exit 1
fi

# Check if convert command exists
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it:"
    echo "  On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  On macOS: brew install imagemagick"
    echo "  On Windows: https://imagemagick.org/script/download.php#windows"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p "$ICONS_DIR"

# Generate 192x192 icon
convert "$SOURCE_LOGO" -resize 192x192 -gravity center -extent 192x192 -background white "$ICONS_DIR/icon-192x192.png"
echo "✓ Generated icon-192x192.png"

# Generate 512x512 icon
convert "$SOURCE_LOGO" -resize 512x512 -gravity center -extent 512x512 -background white "$ICONS_DIR/icon-512x512.png"
echo "✓ Generated icon-512x512.png"

# Generate maskable 192x192 icon (with padding for safe zone)
convert "$SOURCE_LOGO" -resize 128x128 -gravity center -extent 192x192 -background white "$ICONS_DIR/icon-maskable-192x192.png"
echo "✓ Generated icon-maskable-192x192.png"

# Generate maskable 512x512 icon (with padding for safe zone)
convert "$SOURCE_LOGO" -resize 341x341 -gravity center -extent 512x512 -background white "$ICONS_DIR/icon-maskable-512x512.png"
echo "✓ Generated icon-maskable-512x512.png"

echo ""
echo "Icon generation complete! Icons saved to $ICONS_DIR/"
