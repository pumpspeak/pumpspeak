# PumpSpeak Icons

This folder should contain the extension icons in the following sizes:
- icon16.png (16x16px)
- icon48.png (48x48px)
- icon128.png (128x128px)

## Creating Icons

You can create your icons with:
- Figma / Adobe Illustrator
- Canva
- GIMP / Photoshop

## Recommendations

- PNG format with transparency
- Theme: Microphone / Voice chat / Crypto
- Colors: Purple/Blue (matching the UI gradient)
- Style: Modern, minimalist

## Quickly Generate Icons

If you have a source image, you can resize it with ImageMagick:

```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Generate icons
convert source.png -resize 16x16 icon16.png
convert source.png -resize 48x48 icon48.png
convert source.png -resize 128x128 icon128.png
```

Or use an online service like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
