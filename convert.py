#!/usr/bin/env python3
"""
Foto Converter & Renamer
-------------------------
Dit script hernoemt en converteert foto's automatisch naar foto1.jpg, foto2.jpg, etc.

Gebruik:
    python foto_converter.py /pad/naar/fotos
    python foto_converter.py /pad/naar/fotos --recursive
    python foto_converter.py /pad/naar/fotos --max-width 1920 --quality 90
"""

import os
import sys
from pathlib import Path
from PIL import Image
import argparse

# Ondersteunde image formaten
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.heic'}

def is_image(filename):
    """Check of het bestand een afbeelding is."""
    return Path(filename).suffix.lower() in IMAGE_EXTENSIONS

def convert_and_rename_images(directory, recursive=False, max_width=None, quality=90, keep_originals=False):
    """
    Converteer en hernoem afbeeldingen in een directory.
    
    Args:
        directory: Pad naar de directory met afbeeldingen
        recursive: Ook subdirectories verwerken
        max_width: Maximale breedte (optioneel, voor verkleinen)
        quality: JPG kwaliteit (1-100)
        keep_originals: Behoud originele bestanden
    """
    directory = Path(directory)
    
    if not directory.exists():
        print(f"❌ Directory niet gevonden: {directory}")
        return
    
    # Vind alle afbeeldingen
    if recursive:
        image_files = []
        for ext in IMAGE_EXTENSIONS:
            image_files.extend(directory.rglob(f'*{ext}'))
            image_files.extend(directory.rglob(f'*{ext.upper()}'))
    else:
        image_files = []
        for ext in IMAGE_EXTENSIONS:
            image_files.extend(directory.glob(f'*{ext}'))
            image_files.extend(directory.glob(f'*{ext.upper()}'))
    
    # Filter alleen echte bestanden
    image_files = [f for f in image_files if f.is_file()]
    
    # BELANGRIJK: Filter bestaande fotoX.jpg bestanden uit
    # Anders tellen we ze dubbel!
    image_files = [f for f in image_files if not (f.suffix.lower() == '.jpg' and f.stem.startswith('foto') and f.stem[4:].isdigit())]
    
    if not image_files:
        print(f"⚠️  Geen afbeeldingen gevonden in {directory}")
        print(f"💡 Tip: Als er alleen foto1.jpg, foto2.jpg etc. zijn, zijn ze al geconverteerd!")
        return
    
    # Sorteer op naam
    image_files.sort()
    
    print(f"\n📸 Gevonden: {len(image_files)} afbeelding(en) om te converteren")
    print(f"📁 In directory: {directory}")
    print(f"⚙️  Kwaliteit: {quality}%")
    if max_width:
        print(f"📏 Max breedte: {max_width}px")
    if keep_originals:
        print(f"💾 Originelen worden bewaard")
    print()
    
    # Verwerk elke afbeelding
    converted = 0
    errors = 0
    skipped = 0
    foto_nummer = 1  # Aparte teller voor de foto nummering
    
    for image_path in image_files:
        new_name = f"foto{foto_nummer}.jpg"
        new_path = image_path.parent / new_name
        
        try:
            # Als nieuwe naam al bestaat (van eerdere run), skip
            if new_path.exists() and image_path != new_path:
                print(f"⏭️  Overslaan: {image_path.name} (foto{foto_nummer}.jpg bestaat al)")
                skipped += 1
                foto_nummer += 1  # Verhoog nummer ook bij skip
                continue
            
            # Open afbeelding en laad data in geheugen
            with Image.open(image_path) as img:
                # Laad de afbeelding volledig in geheugen
                img.load()
                
                # Converteer naar RGB (nodig voor JPG)
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Maak witte achtergrond voor transparante afbeeldingen
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize indien nodig
                if max_width and img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    print(f"📐 Verkleind: {image_path.name} -> {max_width}x{new_height}px")
                
                # Sla op als JPG (naar tijdelijk bestand eerst op Windows)
                temp_path = new_path.parent / f"temp_{new_name}"
                img.save(temp_path, 'JPEG', quality=quality, optimize=True)
            
            # Nu is het Image object gesloten, we kunnen veilig het origineel verwijderen
            if not keep_originals and image_path != new_path:
                try:
                    image_path.unlink()
                except Exception as e:
                    print(f"⚠️  Kon origineel niet verwijderen: {e}")
            
            # Hernoem tijdelijk bestand naar definitieve naam
            if temp_path.exists():
                temp_path.replace(new_path)
            
            print(f"✅ Geconverteerd: {image_path.name} -> {new_name}")
            converted += 1
            foto_nummer += 1  # Verhoog nummer na succesvolle conversie
                
        except Exception as e:
            print(f"❌ Error bij {image_path.name}: {str(e)}")
            errors += 1
            # Cleanup tijdelijk bestand bij error
            temp_path = new_path.parent / f"temp_{new_name}"
            if temp_path.exists():
                try:
                    temp_path.unlink()
                except:
                    pass
            # Bij error GEEN nummer verhogen, probeer dit nummer opnieuw
    
    # Samenvatting
    print(f"\n{'='*50}")
    print(f"✨ Klaar!")
    print(f"✅ Succesvol geconverteerd: {converted}")
    if skipped:
        print(f"⏭️  Overgeslagen: {skipped} (bestaan al)")
    if errors:
        print(f"❌ Errors: {errors}")
    print(f"{'='*50}\n")

def main():
    parser = argparse.ArgumentParser(
        description='Converteer en hernoem foto\'s naar foto1.jpg, foto2.jpg, etc.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Voorbeelden:
  %(prog)s /pad/naar/fotos
  %(prog)s /pad/naar/fotos --recursive
  %(prog)s /pad/naar/fotos --max-width 1920 --quality 85
  %(prog)s /pad/naar/fotos --keep-originals
        """
    )
    
    parser.add_argument(
        'directory',
        help='Directory met afbeeldingen'
    )
    
    parser.add_argument(
        '-r', '--recursive',
        action='store_true',
        help='Verwerk ook subdirectories'
    )
    
    parser.add_argument(
        '-w', '--max-width',
        type=int,
        help='Maximale breedte in pixels (verkleint afbeeldingen indien nodig)'
    )
    
    parser.add_argument(
        '-q', '--quality',
        type=int,
        default=90,
        choices=range(1, 101),
        metavar='1-100',
        help='JPG kwaliteit (standaard: 90)'
    )
    
    parser.add_argument(
        '-k', '--keep-originals',
        action='store_true',
        help='Behoud originele bestanden'
    )
    
    args = parser.parse_args()
    
    # Print header
    print("\n" + "="*50)
    print("📸 Foto Converter & Renamer")
    print("="*50)
    
    # Converteer afbeeldingen
    convert_and_rename_images(
        args.directory,
        recursive=args.recursive,
        max_width=args.max_width,
        quality=args.quality,
        keep_originals=args.keep_originals
    )

if __name__ == '__main__':
    main()