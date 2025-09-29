#!/usr/bin/env python3
"""
Script para añadir estilos CSS a los archivos HTML de las lecciones
"""

import os
import re
from pathlib import Path

class StyleAdder:
    def __init__(self):
        self.lessons_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL")
        self.css_file = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\additional_content_styles.css")

    def read_css_styles(self):
        """Leer los estilos CSS"""
        if self.css_file.exists():
            with open(self.css_file, 'r', encoding='utf-8') as f:
                return f.read()
        return ""

    def add_styles_to_lesson(self, lesson_path):
        """Añadir estilos CSS a una lección"""
        if not lesson_path.exists():
            return False

        # Leer contenido original
        with open(lesson_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Leer estilos CSS
        css_styles = self.read_css_styles()
        if not css_styles:
            return False

        # Buscar si ya tiene los estilos
        if "additional-content-section" in content:
            print(f"La lección {lesson_path.name} ya tiene estilos CSS")
            return True

        # Buscar la etiqueta de cierre </head>
        head_end_pattern = r'(</head>)'

        if re.search(head_end_pattern, content):
            # Insertar estilos antes del cierre del head
            new_content = re.sub(
                head_end_pattern,
                f'    <style>\n{css_styles}\n    </style>\n\\1',
                content,
                flags=re.DOTALL
            )

            # Escribir el nuevo contenido
            with open(lesson_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"Estilos añadidos a: {lesson_path.name}")
            return True
        else:
            print(f"No se encontró </head> en {lesson_path.name}")
            return False

    def add_styles_to_all_lessons(self):
        """Añadir estilos a todas las lecciones"""
        print("Añadiendo estilos CSS a las lecciones...")

        css_styles = self.read_css_styles()
        if not css_styles:
            print("No se encontraron estilos CSS")
            return

        # Buscar todos los archivos contenido.html
        lesson_files = list(self.lessons_dir.glob("*/contenido.html"))

        updated_count = 0
        for lesson_file in lesson_files:
            if self.add_styles_to_lesson(lesson_file):
                updated_count += 1

        print(f"\n=== RESUMEN DE ESTILOS ===")
        print(f"Lecciones con estilos añadidos: {updated_count}")
        print(f"Total de lecciones procesadas: {len(lesson_files)}")
        print("Proceso de estilos completado!")

def main():
    """Función principal"""
    adder = StyleAdder()
    adder.add_styles_to_all_lessons()

if __name__ == "__main__":
    main()