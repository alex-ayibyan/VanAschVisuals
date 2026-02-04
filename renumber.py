#!/usr/bin/env python3
"""
Foto Renumbering Script
-----------------------
Hernoemt bestaande foto1.jpg, foto3.jpg, foto5.jpg... 
naar foto1.jpg, foto2.jpg, foto3.jpg...

Gebruik:
    python renumber_fotos.py /pad/naar/fotos
"""

import os
import sys
from pathlib import Path
import re

def extract_number(filename):
    """Extract nummer uit fotoX.jpg bestandsnaam."""
    match = re.match(r'foto(\d+)\.jpg', filename)
    if match:
        return int(match.group(1))
    return None

def renumber_fotos(directory):
    """Hernoem foto's naar opeenvolgende nummering."""
    directory = Path(directory)
    
    if not directory.exists():
        print(f"❌ Directory niet gevonden: {directory}")
        return
    
    # Vind alle fotoX.jpg bestanden
    foto_files = []
    for file in directory.glob('foto*.jpg'):
        number = extract_number(file.name)
        if number is not None:
            foto_files.append((number, file))
    
    if not foto_files:
        print(f"⚠️  Geen foto*.jpg bestanden gevonden in {directory}")
        return
    
    # Sorteer op nummer
    foto_files.sort(key=lambda x: x[0])
    
    print("\n" + "="*50)
    print("🔢 Foto Renumbering")
    print("="*50)
    print(f"\n📁 Directory: {directory}")
    print(f"📸 Gevonden: {len(foto_files)} foto's\n")
    
    # Toon huidige nummering
    current_numbers = [num for num, _ in foto_files]
    print(f"📋 Huidige nummering: {', '.join(map(str, current_numbers))}")
    print(f"✨ Nieuwe nummering: {', '.join(map(str, range(1, len(foto_files)+1)))}\n")
    
    # Vraag bevestiging
    confirm = input("❓ Wil je doorgaan met hernoemen? (j/n): ").lower()
    if confirm not in ['j', 'ja', 'y', 'yes']:
        print("\n❌ Geannuleerd")
        return
    
    print()
    
    # Stap 1: Hernoem naar tijdelijke namen om conflicten te voorkomen
    temp_files = []
    for i, (old_num, file) in enumerate(foto_files, start=1):
        temp_name = f"temp_foto_{i}.jpg"
        temp_path = file.parent / temp_name
        file.rename(temp_path)
        temp_files.append((temp_path, i))
        print(f"🔄 Stap 1: {file.name} → {temp_name}")
    
    print()
    
    # Stap 2: Hernoem van tijdelijke namen naar definitieve namen
    for temp_path, new_num in temp_files:
        new_name = f"foto{new_num}.jpg"
        new_path = temp_path.parent / new_name
        temp_path.rename(new_path)
        print(f"✅ Stap 2: {temp_path.name} → {new_name}")
    
    print("\n" + "="*50)
    print("✨ Klaar! Foto's zijn hernummerd naar 1, 2, 3...")
    print("="*50 + "\n")

def main():
    if len(sys.argv) < 2:
        print("Gebruik: python renumber_fotos.py /pad/naar/fotos")
        print("\nVoorbeeld:")
        print("  python renumber_fotos.py images/project1/part1")
        sys.exit(1)
    
    directory = sys.argv[1]
    renumber_fotos(directory)

if __name__ == '__main__':
    main()