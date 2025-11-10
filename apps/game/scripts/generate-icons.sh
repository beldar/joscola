#!/bin/bash

# Script to generate all PWA icon sizes from the main icon
# Using macOS sips command

SOURCE_ICON="/Users/martiplanellas/Code/joscola/apps/game/public/joscola-icon.png"
PUBLIC_DIR="/Users/martiplanellas/Code/joscola/apps/game/public"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    exit 1
fi

echo "🎨 Generating PWA icons from joscola-icon.png..."

# Icon sizes for PWA manifest and favicons
SIZES=(16 32 72 96 128 144 152 192 384 512)

# Generate each size
for SIZE in "${SIZES[@]}"; do
    OUTPUT_FILE="$PUBLIC_DIR/icon-${SIZE}x${SIZE}.png"
    echo "  📐 Creating ${SIZE}x${SIZE} icon..."

    # Use sips to resize the image
    sips -z $SIZE $SIZE "$SOURCE_ICON" --out "$OUTPUT_FILE" >/dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "  ✅ Created icon-${SIZE}x${SIZE}.png"
    else
        echo "  ❌ Failed to create icon-${SIZE}x${SIZE}.png"
    fi
done

# Create Apple Touch Icon (180x180)
echo "  📱 Creating Apple Touch Icon (180x180)..."
sips -z 180 180 "$SOURCE_ICON" --out "$PUBLIC_DIR/apple-touch-icon.png" >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Created apple-touch-icon.png"
fi

# Create favicon.ico (multi-resolution)
# First create 16x16 and 32x32 for favicon
echo "  🌐 Creating favicon.ico..."
sips -z 16 16 "$SOURCE_ICON" --out "$PUBLIC_DIR/favicon-16.png" >/dev/null 2>&1
sips -z 32 32 "$SOURCE_ICON" --out "$PUBLIC_DIR/favicon-32.png" >/dev/null 2>&1

# Copy as favicon.ico (browsers will use the PNG)
cp "$PUBLIC_DIR/icon-32x32.png" "$PUBLIC_DIR/favicon.ico"
echo "  ✅ Created favicon.ico"

# Clean up temporary files
rm -f "$PUBLIC_DIR/favicon-16.png" "$PUBLIC_DIR/favicon-32.png" 2>/dev/null

echo ""
echo "🎉 All icons generated successfully!"
echo ""
echo "Generated icons:"
ls -la "$PUBLIC_DIR"/icon-*.png | awk '{print "  - " $NF}'
echo "  - $PUBLIC_DIR/apple-touch-icon.png"
echo "  - $PUBLIC_DIR/favicon.ico"