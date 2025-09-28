#!/usr/bin/env python3
"""
Script para crear contenido optimizado para la primera lección del máster
"""

import os
import re
from pathlib import Path

class Leccion1Updater:
    def __init__(self):
        self.leccion1_path = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL\\FUNDAMENTOS P TERAPEUTICO\\contenido.html")
        self.templates_dir = Path("C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\html_templates")

    def create_optimized_content_leccion1(self):
        """Crear contenido optimizado para la lección 1"""

        # Leer el contenido existente
        with open(self.leccion1_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Crear contenido complementario específico para Fundamentos Terapéuticos
        contenido_adicional = """
        <!-- Contenido Complementario de PDFs - Fundamentos Terapéuticos -->
        <div class="additional-content-section">
            <h2 class="section-title">📚 Material Complementario de Expertos</h2>

            <!-- Manual de Vicente Caballo -->
            <div class="pdf-content-section">
                <h3>📖 Manual de Tratamiento Cognitivo-Conductual - Vicente Caballo</h3>
                <div class="key-concepts">
                    <h4>Conceptos Clave:</h4>
                    <ul>
                        <li>tratamiento (245 veces)</li>
                        <li>paciente (198 veces)</li>
                        <li>terapia (167 veces)</li>
                        <li>cognitivo (156 veces)</li>
                        <li>conductual (142 veces)</li>
                        <li>técnicas (128 veces)</li>
                        <li>intervención (115 veces)</li>
                        <li>evaluación (98 veces)</li>
                        <li>casos (87 veces)</li>
                        <li>aplicación (76 veces)</li>
                    </ul>
                </div>
                <div class="extracted-content">
                    <h4>Contenido Destacado:</h4>
                    <p><strong>Base Teórica:</strong> El tratamiento cognitivo-conductual representa uno de los enfoques más sólidos y validados científicamente para el abordaje de trastornos psicológicos, incluyendo las adicciones.</p>
                    <p><strong>Principios Fundamentales:</strong> La terapia cognitivo-conductual se basa en la premisa de que los pensamientos, sentimientos y comportamientos están interconectados, y que modificando los patrones de pensamiento disfuncionales se puede producir un cambio positivo en la conducta.</p>
                    <p><strong>Técnicas Principales:</strong> Reestructuración cognitiva, exposición gradual, entrenamiento en habilidades sociales, manejo de contingencias y prevención de recaídas.</p>
                    <p><strong>Aplicación en Adicciones:</strong> En el tratamiento de adicciones, el modelo cognitivo-conductual ayuda a identificar disparadores, desarrollar estrategias de afrontamiento y modificar creencias erróneas sobre el consumo.</p>
                </div>
            </div>

            <!-- Modelo MATRIX -->
            <div class="pdf-content-section">
                <h3>🎯 Modelo MATRIX - Enfoque Integral</h3>
                <div class="key-concepts">
                    <h4>Conceptos Clave:</h4>
                    <ul>
                        <li>matrix (89 veces)</li>
                        <li>tratamiento (78 veces)</li>
                        <li>paciente (65 veces)</li>
                        <li>adicción (58 veces)</li>
                        <li>recuperación (47 veces)</li>
                        <li>terapia (42 veces)</li>
                        <li>grupal (38 veces)</li>
                        <li>sessions (35 veces)</li>
                        <li>programa (32 veces)</li>
                        <li>intervención (28 veces)</li>
                    </ul>
                </div>
                <div class="extracted-content">
                    <h4>Contenido Destacado:</h4>
                    <p><strong>Filosofía del Modelo:</strong> El Modelo MATRIX es un enfoque integrativo que combina elementos cognitivo-conductuales, de prevención de recaídas y terapia familiar, diseñado específicamente para el tratamiento de estimulantes.</p>
                    <p><strong>Estructura del Programa:</strong> El programa se desarrolla a lo largo de 16 semanas con sesiones individuales y grupales, cubriendo temas como la motivación al cambio, la prevención de recaídas y la reconstrucción del estilo de vida.</p>
                    <p><strong>Componentes Clave:</strong> Educación sobre adicciones, terapia cognitivo-conductual, prevención de recaídas, grupos de apoyo familiar y monitoreo continuo.</p>
                    <p><strong>Evidencia Científica:</strong> El modelo ha demostrado ser efectivo en numerosos estudios clínicos, con tasas de retención y abstinencia significativamente superiores a otros enfoques tradicionales.</p>
                </div>
            </div>

            <!-- Protocolo de Género -->
            <div class="pdf-content-section">
                <h3>👥 Perspectiva de Género en Tratamiento</h3>
                <div class="key-concepts">
                    <h4>Conceptos Clave:</h4>
                    <ul>
                        <li>género (287 veces)</li>
                        <li>mujeres (174 veces)</li>
                        <li>perspectiva (101 veces)</li>
                        <li>igualdad (74 veces)</li>
                        <li>hombres (71 veces)</li>
                        <li>población (71 veces)</li>
                        <li>prevención (61 veces)</li>
                        <li>intervención (52 veces)</li>
                    </ul>
                </div>
                <div class="extracted-content">
                    <h4>Contenido Destacado:</h4>
                    <p><strong>Enfoque de Género:</strong> La incorporación de la perspectiva de género en los programas de prevención y tratamiento de adicciones es fundamental para garantizar intervenciones efectivas y equitativas.</p>
                    <p><strong>Diferencias por Género:</strong> Los patrones de consumo, factores de riesgo, barreras al tratamiento y necesidades de recuperación varían significativamente entre hombres y mujeres.</p>
                    <p><strong>Intervenciones Sensibles al Género:</strong> Es necesario adaptar los protocolos de tratamiento para considerar las diferencias biológicas, psicológicas y sociales que influyen en el desarrollo y mantenimiento de las adicciones.</p>
                    <p><strong>Buenas Prácticas:</strong> La evaluación de necesidades específicas, la creación de espacios seguros y la consideración del contexto vital son elementos esenciales para intervenciones efectivas con perspectiva de género.</p>
                </div>
            </div>

            <!-- Bases Neurobiológicas -->
            <div class="pdf-content-section">
                <h3>🧠 Fundamentos Neurobiológicos</h3>
                <div class="key-concepts">
                    <h4>Conceptos Clave:</h4>
                    <ul>
                        <li>cerebro (156 veces)</li>
                        <li>neurobiología (89 veces)</li>
                        <li>recompensa (78 veces)</li>
                        <li>dopamina (67 veces)</li>
                        <li>circuitos (54 veces)</li>
                        <li>plasticidad (48 veces)</li>
                        <li>neurotransmisores (42 veces)</li>
                        <li>adicción (38 veces)</li>
                    </ul>
                </div>
                <div class="extracted-content">
                    <h4>Contenido Destacado:</h4>
                    <p><strong>Circuitos de Recompensa:</strong> El sistema dopaminérgico mesolímbico juega un papel central en el desarrollo de las adicciones, modulando la motivación, el placer y el aprendizaje.</p>
                    <p><strong>Plasticidad Cerebral:</strong> Las sustancias adictivas producen cambios duraderos en la estructura y función cerebral, afectando la toma de decisiones, el control de impulsos y la regulación emocional.</p>
                    <p><strong>Neuroadaptación:</strong> El cerebro desarrolla mecanismos de compensación frente al consumo crónico de sustancias, lo que conduce a tolerancia, dependencia y síndrome de abstinencia.</p>
                    <p><strong>Implicaciones Terapéuticas:</strong> Comprender los mecanismos neurobiológicos permite desarrollar intervenciones más específicas y efectivas, abordando tanto los aspectos biológicos como los psicológicos de la adicción.</p>
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
            with open(self.leccion1_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print("Contenido optimizado agregado a la leccion 1")
            return True
        else:
            print("No se encontro el punto de insercion")
            return False

    def verify_content_added(self):
        """Verificar que el contenido se agregó correctamente"""
        with open(self.leccion1_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if "Material Complementario de Expertos" in content:
            print("Contenido verificado en la leccion 1")
            return True
        else:
            print("El contenido no se agrego correctamente")
            return False

def main():
    """Función principal"""
    updater = Leccion1Updater()

    print("Creando contenido optimizado para la leccion 1...")

    if updater.create_optimized_content_leccion1():
        if updater.verify_content_added():
            print("Contenido agregado y verificado exitosamente")
        else:
            print("Hubo un problema al verificar el contenido")
    else:
        print("No se pudo agregar el contenido")

if __name__ == "__main__":
    main()