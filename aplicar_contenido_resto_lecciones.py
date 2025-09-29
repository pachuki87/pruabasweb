#!/usr/bin/env python3
"""
Script para aplicar contenido optimizado al resto de lecciones del máster
"""

import os
import re
from pathlib import Path

class RestoLeccionesUpdater:
    def __init__(self):
        self.lessons_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL")
        self.templates_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\html_templates")

        # Mapeo de carpetas de lecciones
        self.lessons_mapping = {
            "TERAPIA COGNITIVA DROGODEPENDENENCIAS": {
                "template": "TERAPIA_COGNITIVA_DROGODEPENDENENCIAS_content.html",
                "title": "Terapia Cognitiva en Drogodependencias",
                "icon": "🧠"
            },
            "FAMILIA Y TRABAJO EQUIPO": {
                "template": "FAMILIA_Y_TRABAJO_EQUIPO_content.html",
                "title": "Familia y Trabajo en Equipo",
                "icon": "👨‍👩‍👧‍👦"
            },
            "RECOVERY COACHING": {
                "template": "RECOVERY_COACHING_content.html",
                "title": "Recovery Coaching",
                "icon": "🎯"
            },
            "PSICOLOGIA APLICADA ADICCIONES": {
                "template": "PSICOLOGIA_APLICADA_ADICCIONES_content.html",
                "title": "Psicología Aplicada a Adicciones",
                "icon": "🧠"
            },
            "GESTION PERSPECTIVA GENERO": {
                "template": "GESTION_PERSPECTIVA_GENERO_content.html",
                "title": "Gestión desde Perspectiva de Género",
                "icon": "♀️"
            },
            "INTELIGENCIA EMOCIONAL": {
                "template": "INTELIGENCIA_EMOCIONAL_content.html",
                "title": "Inteligencia Emocional",
                "icon": "💝"
            }
        }

    def create_optimized_content_section(self, lesson_folder, lesson_info):
        """Crear contenido optimizado para una lección específica"""

        # Leer plantilla base
        template_path = self.templates_dir / lesson_info["template"]
        if not template_path.exists():
            return ""

        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()

        # Crear contenido estructurado
        contenido_adicional = f"""
        <!-- Contenido Complementario de PDFs - {lesson_info["title"]} -->
        <div class="additional-content-section">
            <h2 class="section-title">{lesson_info["icon"]} Material Complementario de Expertos</h2>
            {template_content}
        </div>

        <!-- Estilos CSS específicos -->
        <style>
        .additional-content-section {{
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            border: 2px solid #dee2e6;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}

        .section-title {{
            color: #2c3e50;
            font-size: 2em;
            margin-bottom: 25px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }}

        .pdf-content-section {{
            margin-bottom: 35px;
            padding: 25px;
            background: white;
            border-radius: 12px;
            border-left: 5px solid #007bff;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s ease;
        }}

        .pdf-content-section:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
        }}

        .pdf-content-section h3 {{
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4em;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px;
        }}

        .key-concepts {{
            margin-bottom: 20px;
        }}

        .key-concepts h4 {{
            color: #495057;
            margin-bottom: 12px;
            font-size: 1.1em;
        }}

        .key-concepts ul {{
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}

        .key-concepts li {{
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }}

        .extracted-content {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }}

        .extracted-content h4 {{
            color: #495057;
            margin-bottom: 15px;
            font-size: 1.1em;
        }}

        .extracted-content p {{
            margin-bottom: 12px;
            line-height: 1.7;
            text-align: justify;
            color: #212529;
        }}

        .extracted-content strong {{
            color: #007bff;
            font-weight: 600;
        }}

        @media (max-width: 768px) {{
            .additional-content-section {{
                margin: 20px 0;
                padding: 20px;
            }}

            .section-title {{
                font-size: 1.5em;
            }}

            .pdf-content-section {{
                padding: 15px;
            }}

            .key-concepts ul {{
                flex-direction: column;
                gap: 5px;
            }}

            .key-concepts li {{
                display: block;
                text-align: center;
            }}
        }}
        </style>
        """

        return contenido_adicional

    def apply_content_to_lesson(self, lesson_folder, lesson_info):
        """Aplicar contenido a una lección específica"""
        lesson_path = self.lessons_dir / lesson_folder / "contenido.html"

        if not lesson_path.exists():
            print(f"No se encontro la leccion: {lesson_folder}")
            return False

        # Crear copia de seguridad
        backup_path = lesson_path.with_suffix('.html.backup')
        if not backup_path.exists():
            import shutil
            shutil.copy2(lesson_path, backup_path)
            print(f"Copia de seguridad creada: {backup_path}")

        # Leer contenido original
        with open(lesson_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Crear contenido adicional
        contenido_adicional = self.create_optimized_content_section(lesson_folder, lesson_info)
        if not contenido_adicional:
            print(f"No se pudo crear contenido para {lesson_folder}")
            return False

        # Buscar el lugar para insertar el contenido (antes de la navegación)
        navigation_pattern = r'(<div class="navigation">)'

        if re.search(navigation_pattern, original_content):
            new_content = re.sub(
                navigation_pattern,
                contenido_adicional + '\n\n\\1',
                original_content,
                flags=re.DOTALL
            )

            # Guardar el nuevo contenido
            with open(lesson_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"Contenido agregado a: {lesson_folder}")
            return True
        else:
            print(f"No se encontro punto de insercion en {lesson_folder}")
            return False

    def apply_to_all_lessons(self):
        """Aplicar contenido a todas las lecciones restantes"""
        print("Aplicando contenido optimizado al resto de lecciones...")

        success_count = 0
        total_count = len(self.lessons_mapping)

        for lesson_folder, lesson_info in self.lessons_mapping.items():
            print(f"\\nProcesando: {lesson_info['title']}")

            if self.apply_content_to_lesson(lesson_folder, lesson_info):
                success_count += 1
                print(f"{lesson_info['title']} - Completado")
            else:
                print(f"{lesson_info['title']} - Error")

        print(f"\\n=== RESUMEN ===")
        print(f"Lecciones actualizadas: {success_count}/{total_count}")
        print(f"Proceso completado!")

        return success_count == total_count

    def verify_all_lessons(self):
        """Verificar que el contenido se agregó correctamente a todas las lecciones"""
        print("\\nVerificando contenido en todas las lecciones...")

        verification_count = 0
        for lesson_folder, lesson_info in self.lessons_mapping.items():
            lesson_path = self.lessons_dir / lesson_folder / "contenido.html"

            if lesson_path.exists():
                with open(lesson_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                if "Material Complementario de Expertos" in content:
                    verification_count += 1
                    print(f"{lesson_info['title']} - Verificado")
                else:
                    print(f"{lesson_info['title']} - No verificado")
            else:
                print(f"{lesson_info['title']} - Archivo no encontrado")

        print(f"\\nLecciones verificadas: {verification_count}/{len(self.lessons_mapping)}")
        return verification_count == len(self.lessons_mapping)

def main():
    """Función principal"""
    updater = RestoLeccionesUpdater()

    print("Iniciando aplicacion de contenido a todas las lecciones...")

    # Aplicar contenido a todas las lecciones
    if updater.apply_to_all_lessons():
        print("\\nTodas las lecciones se actualizaron correctamente!")

        # Verificar el contenido
        if updater.verify_all_lessons():
            print("Todas las lecciones verificadas exitosamente!")
        else:
            print("Algunas lecciones no pasaron la verificacion")
    else:
        print("\\nOcurrieron errores al actualizar algunas lecciones")

if __name__ == "__main__":
    main()