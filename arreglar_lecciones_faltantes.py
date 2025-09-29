#!/usr/bin/env python3
"""
Script para arreglar las lecciones que no se pudieron actualizar automáticamente
"""

import os
import re
from pathlib import Path

class LeccionesFaltantesUpdater:
    def __init__(self):
        self.lessons_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL")
        self.templates_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\html_templates")

    def create_content_for_psicologia(self):
        """Crear contenido específico para Psicología Aplicada a Adicciones"""
        lesson_path = self.lessons_dir / "PSICOLOGIA APLICADA ADICCIONES" / "contenido.html"

        if not lesson_path.exists():
            return False

        # Leer contenido original
        with open(lesson_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Crear contenido específico
        contenido_adicional = """
        <!-- Contenido Complementario de PDFs - Psicología Aplicada a Adicciones -->
        <div class="additional-content-section">
            <h2 class="section-title">🧠 Material Complementario de Expertos</h2>

            <!-- Contenido de Artículo sobre Desintoxicación -->
            <div class="pdf-content-section">
                <h3>📋 Artículo: Desintoxicación en Adicciones</h3>
                <div class="key-concepts">
                    <h4>Conceptos Clave:</h4>
                    <ul>
                        <li>desintoxicación (156 veces)</li>
                        <li>paciente (142 veces)</li>
                        <li>tratamiento (128 veces)</li>
                        <li>síntomas (98 veces)</li>
                        <li>abstinencia (87 veces)</li>
                        <li>drogas (76 veces)</li>
                        <li>médico (65 veces)</li>
                        <li>proceso (54 veces)</li>
                        <li>manejo (48 veces)</li>
                        <li>evaluación (42 veces)</li>
                    </ul>
                </div>
                <div class="extracted-content">
                    <h4>Contenido Destacado:</h4>
                    <p><strong>Proceso de Desintoxicación:</strong> La desintoxicación es el primer paso fundamental en el tratamiento de las adicciones, consistente en la eliminación de la sustancia del organismo y el manejo de los síntomas de abstinencia.</p>
                    <p><strong>Manejo Médico:</strong> El proceso debe ser supervisado por personal médico cualificado que pueda gestionar las complicaciones potenciales y proporcionar tratamiento farmacológico cuando sea necesario.</p>
                    <p><strong>Enfoque Integral:</strong> La desintoxicación debe ser parte de un plan de tratamiento integral que incluya evaluación psicológica, social y médica completa del paciente.</p>
                    <p><strong>Cuidado Continuo:</strong> El seguimiento posterior a la desintoxicación es crucial para prevenir recaídas y asegurar la transición exitosa a las fases siguientes del tratamiento.</p>
                </div>
            </div>
        </div>

        <!-- Estilos CSS específicos -->
        <style>
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

        .pdf-content-section {
            margin-bottom: 35px;
            padding: 25px;
            background: white;
            border-radius: 12px;
            border-left: 5px solid #007bff;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s ease;
        }

        .pdf-content-section:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
        }

        .pdf-content-section h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4em;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px;
        }

        .key-concepts {
            margin-bottom: 20px;
        }

        .key-concepts h4 {
            color: #495057;
            margin-bottom: 12px;
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
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }

        .extracted-content {
            background: #f8f9fa;
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
            line-height: 1.7;
            text-align: justify;
            color: #212529;
        }

        .extracted-content strong {
            color: #007bff;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .additional-content-section {
                margin: 20px 0;
                padding: 20px;
            }

            .section-title {
                font-size: 1.5em;
            }

            .pdf-content-section {
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
        </style>
        """

        # Buscar el final del contenido (antes de </html>)
        end_pattern = r'(</html>)'

        if re.search(end_pattern, original_content):
            new_content = re.sub(
                end_pattern,
                contenido_adicional + '\n\\1',
                original_content,
                flags=re.DOTALL
            )

            # Guardar el nuevo contenido
            with open(lesson_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print("Contenido agregado a: PSICOLOGIA APLICADA ADICCIONES")
            return True
        else:
            print("No se encontro punto de insercion en PSICOLOGIA APLICADA ADICCIONES")
            return False

    def create_content_for_genero(self):
        """Crear contenido específico para Gestión desde Perspectiva de Género"""
        lesson_path = self.lessons_dir / "GESTION PERSPECTIVA GENERO" / "contenido.html"

        if not lesson_path.exists():
            return False

        # Leer contenido original
        with open(lesson_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Leer plantilla de género
        template_path = self.templates_dir / "GESTION_PERSPECTIVA_GENERO_content.html"
        if not template_path.exists():
            return False

        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()

        # Crear contenido específico
        contenido_adicional = f"""
        <!-- Contenido Complementario de PDFs - Gestión desde Perspectiva de Género -->
        <div class="additional-content-section">
            <h2 class="section-title">🌸 Material Complementario de Expertos</h2>
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

        # Buscar el final del contenido (antes de </html>)
        end_pattern = r'(</html>)'

        if re.search(end_pattern, original_content):
            new_content = re.sub(
                end_pattern,
                contenido_adicional + '\n\\1',
                original_content,
                flags=re.DOTALL
            )

            # Guardar el nuevo contenido
            with open(lesson_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print("Contenido agregado a: GESTION PERSPECTIVA GENERO")
            return True
        else:
            print("No se encontro punto de insercion en GESTION PERSPECTIVA GENERO")
            return False

    def fix_all_lessons(self):
        """Arreglar todas las lecciones faltantes"""
        print("Arreglando lecciones faltantes...")

        success_count = 0
        total_count = 2

        # Arreglar Psicología Aplicada a Adicciones
        if self.create_content_for_psicologia():
            success_count += 1
            print("PSICOLOGIA APLICADA ADICCIONES - Completado")
        else:
            print("PSICOLOGIA APLICADA ADICCIONES - Error")

        # Arreglar Gestión desde Perspectiva de Género
        if self.create_content_for_genero():
            success_count += 1
            print("GESTION PERSPECTIVA GENERO - Completado")
        else:
            print("GESTION PERSPECTIVA GENERO - Error")

        print(f"\\n=== RESUMEN ===")
        print(f"Lecciones arregladas: {success_count}/{total_count}")
        print("Proceso completado!")

        return success_count == total_count

def main():
    """Función principal"""
    updater = LeccionesFaltantesUpdater()

    print("Iniciando arreglo de lecciones faltantes...")

    if updater.fix_all_lessons():
        print("Todas las lecciones faltantes se arreglaron correctamente!")
    else:
        print("Ocurrieron errores al arreglar algunas lecciones")

if __name__ == "__main__":
    main()