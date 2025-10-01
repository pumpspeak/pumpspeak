# Icônes PumpSpeak

Ce dossier doit contenir les icônes de l'extension aux tailles suivantes :
- icon16.png (16x16px)
- icon48.png (48x48px)
- icon128.png (128x128px)

## Création des icônes

Vous pouvez créer vos icônes avec :
- Figma / Adobe Illustrator
- Canva
- GIMP / Photoshop

## Recommandations

- Format PNG avec transparence
- Thème : Microphone / Chat vocal / Crypto
- Couleurs : Violet/Bleu (correspondant au gradient de l'UI)
- Style : Moderne, minimaliste

## Générer rapidement des icônes

Si vous avez une image source, vous pouvez la redimensionner avec ImageMagick :

```bash
# Installer ImageMagick
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Générer les icônes
convert source.png -resize 16x16 icon16.png
convert source.png -resize 48x48 icon48.png
convert source.png -resize 128x128 icon128.png
```

Ou utilisez un service en ligne comme :
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
