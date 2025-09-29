#!/usr/bin/env python3
"""
Script para actualizar los archivos HTML de las lecciones con el contenido extraído de los PDFs
"""

import os
import re
from pathlib import Path
import shutil

class LessonUpdater:
    def __init__(self):
        self.lessons_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL")
        self.templates_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\html_templates")

        # Mapeo de carpetas de lecciones a plantillas
        self.lesson_mapping = {
            "FUNDAMENTOS P TERAPEUTICO": "FUNDAMENTOS_P_TERAPEUTICO_content.html",
            "TERAPIA COGNITIVA DROGODEPENDENENCIAS": "TERAPIA_COGNITIVA_DROGODEPENDENENCIAS_content.html",
            "FAMILIA Y TRABAJO EQUIPO": "FAMILIA_Y_TRABAJO_EQUIPO_content.html",
            "RECOVERY COACHING": "RECOVERY_COACHING_content.html",
            "PSICOLOGIA APLICADA ADICCIONES": "PSICOLOGIA_APLICADA_ADICCIONES_content.html",
            "INTERVENCION FAMILIAR Y RECOVERY MENTORING": "INTERVENCION_FAMILIAR_Y_RECOVERY_MENTORING_content.html",
            "NUEVOS MODELOS TERAPEUTICOS": "NUEVOS_MODELOS_TERAPEUTICOS_content.html",
            "GESTION PERSPECTIVA GENERO": "GESTION_PERSPECTIVA_GENERO_content.html",
            "INTELIGENCIA EMOCIONAL": "INTELIGENCIA_EMOCIONAL_content.html",
            "TRABAJO FINAL MASTER": "TRABAJO_FINAL_MASTER_content.html"
        }

    def backup_lesson(self, lesson_path):
        """Crear copia de seguridad del archivo original"""
        backup_path = lesson_path.with_suffix('.html.backup')
        shutil.copy2(lesson_path, backup_path)
        print(f"Copia de seguridad creada: {backup_path}")

    def read_template_content(self, template_file):
        """Leer contenido de la plantilla"""
        template_path = self.templates_dir / template_file
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
        return ""

    def update_lesson_content(self, lesson_path, additional_content):
        """Actualizar contenido de una lección"""
        if not lesson_path.exists():
            print(f"No se encontró el archivo: {lesson_path}")
            return False

        # Crear copia de seguridad
        self.backup_lesson(lesson_path)

        # Leer contenido original
        with open(lesson_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Buscar el lugar donde insertar el contenido (después del contenido principal)
        # Vamos a insertar antes de la sección de navegación
        navigation_pattern = r'(<div class="navigation">)'

        if re.search(navigation_pattern, original_content):
            # Insertar el contenido antes de la navegación
            new_content = re.sub(
                navigation_pattern,
                f'<!-- Contenido adicional de PDFs -->\n{additional_content}\n\n\\1',
                original_content,
                flags=re.DOTALL
            )
        else:
            # Si no encuentra navegación, insertar al final del container
            container_pattern = r'(</div>\s*</body>\s*</html>)'
            new_content = re.sub(
                container_pattern,
                f'<!-- Contenido adicional de PDFs -->\n{additional_content}\n\n\\1',
                original_content,
                flags=re.DOTALL
            )

        # Escribir el nuevo contenido
        with open(lesson_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"Lección actualizada: {lesson_path}")
        return True

    def get_content_section(self, lesson_folder):
        """Obtener la sección de contenido para una lección específica"""
        template_file = self.lesson_mapping.get(lesson_folder)
        if not template_file:
            return ""

        template_content = self.read_template_content(template_file)
        if not template_content:
            return ""

        # Crear una sección HTML bien formateada
        content_section = f"""
        <div class="additional-content-section">
            <h2 class="section-title">📚 Contenido Complementario de PDFs</h2>
            <div class="additional-content-container">
                {template_content}
            </div>
        </div>
        """

        return content_section

    def update_all_lessons(self):
        """Actualizar todas las lecciones"""
        print("Iniciando actualización de lecciones...")

        updated_count = 0
        skipped_count = 0

        for lesson_folder, template_file in self.lesson_mapping.items():
            lesson_path = self.lessons_dir / lesson_folder / "contenido.html"

            # Verificar si existe la plantilla
            template_path = self.templates_dir / template_file
            if not template_path.exists():
                print(f"No existe plantilla para {lesson_folder}: {template_file}")
                skipped_count += 1
                continue

            # Obtener contenido adicional
            additional_content = self.get_content_section(lesson_folder)
            if not additional_content:
                print(f"No hay contenido adicional para {lesson_folder}")
                skipped_count += 1
                continue

            # Actualizar lección
            if self.update_lesson_content(lesson_path, additional_content):
                updated_count += 1
            else:
                skipped_count += 1

        print(f"\n=== RESUMEN DE ACTUALIZACIÓN ===")
        print(f"Lecciones actualizadas: {updated_count}")
        print(f"Lecciones omitidas: {skipped_count}")
        print("Actualización completada!")

    def create_css_styles(self):
        """Crear estilos CSS para el contenido adicional"""
        css_content = """
/* Estilos para contenido adicional de PDFs */
.additional-content-section {
    margin: 40px 0;
    padding: 30px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    border: 2px solid #dee2e6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
    color: #2c3e50;
    font-size: 2em;
    margin-bottom: 25px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.additional-content-container {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pdf-content-section {
    margin-bottom: 35px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.pdf-content-section h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.3em;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
}

.key-concepts {
    margin-bottom: 20px;
}

.key-concepts h4 {
    color: #495057;
    margin-bottom: 10px;
    font-size: 1.1em;
}

.key-concepts ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.key-concepts li {
    background: #007bff;
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
}

.extracted-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.extracted-content h4 {
    color: #495057;
    margin-bottom: 15px;
    font-size: 1.1em;
}

.extracted-content p {
    margin-bottom: 12px;
    line-height: 1.6;
    text-align: justify;
    color: #212529;
}

.content-separator {
    border: none;
    height: 2px;
    background: linear-gradient(to right, transparent, #dee2e6, transparent);
    margin: 25px 0;
}

/* Responsive design */
@media (max-width: 768px) {
    .additional-content-section {
        margin: 20px 0;
        padding: 20px;
    }

    .section-title {
        font-size: 1.5em;
    }

    .additional-content-container {
        padding: 15px;
    }

    .key-concepts ul {
        flex-direction: column;
        gap: 5px;
    }

    .key-concepts li {
        display: block;
        text-align: center;
    }
}
"""

        # Guardar archivo CSS
        css_path = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\additional_content_styles.css")
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css_content)

        print(f"Estilos CSS creados: {css_path}")

def main():
    """Función principal"""
    updater = LessonUpdater()

    # Crear estilos CSS
    updater.create_css_styles()

    # Actualizar todas las lecciones
    updater.update_all_lessons()

if __name__ == "__main__":
    main()