#!/bin/bash
# Script to generate PNG icons from SVG files
# Requires: imagemagick (convert command)
# Usage: bash generate-pwa-icons.sh

ICONS_DIR="./static/icons"

echo "Generating PWA icons from SVG..."

# Check if convert command exists
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it:"
    echo "  On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  On macOS: brew install imagemagick"
    echo "  On Windows: https://imagemagick.org/script/download.php#windows"
    echo ""
    echo "Alternatively, you can manually convert the SVG files to PNG using an online tool or design software."
    exit 1
fi

# Generate 192x192 icons
if [ -f "$ICONS_DIR/icon-192x192.svg" ]; then
    convert -background none -resize 192x192 "$ICONS_DIR/icon-192x192.svg" "$ICONS_DIR/icon-192x192.png"
    echo "✓ Generated icon-192x192.png"
fi

# Generate 512x512 icons
if [ -f "$ICONS_DIR/icon-512x512.svg" ]; then
    convert -background none -resize 512x512 "$ICONS_DIR/icon-512x512.svg" "$ICONS_DIR/icon-512x512.png"
    echo "✓ Generated icon-512x512.png"
fi

# Generate maskable 192x192 icon
if [ -f "$ICONS_DIR/icon-maskable-192x192.svg" ]; then
    convert -background none -resize 192x192 "$ICONS_DIR/icon-maskable-192x192.svg" "$ICONS_DIR/icon-maskable-192x192.png"
    echo "✓ Generated icon-maskable-192x192.png"
fi

# Generate maskable 512x512 icon
if [ -f "$ICONS_DIR/icon-maskable-512x512.svg" ]; then
    convert -background none -resize 512x512 "$ICONS_DIR/icon-maskable-512x512.svg" "$ICONS_DIR/icon-maskable-512x512.png"
    echo "✓ Generated icon-maskable-512x512.png"
fi

echo ""
echo "PNG icon generation complete!"
