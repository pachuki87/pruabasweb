#!/usr/bin/env python3
"""
Script para analizar PDFs del Máster en Adicciones y extraer contenido relevante
para ampliar el contenido HTML de cada lección.
"""

import os
import re
import fitz  # PyMuPDF
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from collections import defaultdict
import json
from pathlib import Path

# Descargar recursos necesarios de NLTK
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

class PDFAnalyzer:
    def __init__(self, pdfs_dir):
        self.pdfs_dir = Path(pdfs_dir)
        self.stop_words = set(stopwords.words('spanish'))
        self.modules_mapping = self._create_modules_mapping()

    def _create_modules_mapping(self):
        """Mapeo de palabras clave a módulos del máster"""
        return {
            'FUNDAMENTOS P TERAPEUTICO': [
                'proceso', 'terapéutico', 'tratamiento', 'básico', 'fundamento', 'modelo',
                'caballo', 'introducción', 'general'
            ],
            'TERAPIA COGNITIVA DROGODEPENDENENCIAS': [
                'cognitivo', 'conductual', 'act', 'terapia', 'tcc', 'intervención',
                'mental', 'psicológico', 'carmen luciano'
            ],
            'FAMILIA Y TRABAJO EQUIPO': [
                'familiar', 'familia', 'equipo', 'comunicación', 'padres', 'hijos',
                'escudero', 'gotman'
            ],
            'RECOVERY COACHING': [
                'coaching', 'health coaching', 'transform', 'recuperación',
                'mentoring', 'recovery'
            ],
            'PSICOLOGIA APLICADA ADICCIONES': [
                'psicología', 'adicción', 'drogodependencia', 'conducta',
                'prevención', 'trastorno'
            ],
            'INTERVENCION FAMILIAR Y RECOVERY MENTORING': [
                'intervención familiar', 'recovery mentoring', 'niño interior',
                'guía práctica', 'familiar'
            ],
            'NUEVOS MODELOS TERAPEUTICOS': [
                'nuevos modelos', 'aceptación', 'compromiso', 'terapias',
                'innovación', 'actualizado'
            ],
            'GESTION PERSPECTIVA GENERO': [
                'género', 'mujeres', 'perspectiva', 'diferencias',
                'femenino', 'masculino'
            ],
            'INTELIGENCIA EMOCIONAL': [
                'inteligencia emocional', 'emociones', 'emocional',
                'cuaderno', 'ejercicios'
            ]
        }

    def extract_text_from_pdf(self, pdf_path):
        """Extraer texto de un archivo PDF"""
        text = ""
        try:
            with fitz.open(pdf_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text
        except Exception as e:
            print(f"Error al procesar {pdf_path}: {e}")
            return ""

    def clean_text(self, text):
        """Limpiar y normalizar texto"""
        # Eliminar caracteres especiales y espacios extra
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\sáéíóúÁÉÍÓÚñÑüÜ.,;:¿?¡!()-]', '', text)
        return text.strip()

    def extract_key_concepts(self, text, top_n=20):
        """Extraer conceptos clave del texto"""
        words = word_tokenize(text.lower())
        words = [word for word in words if word.isalpha() and word not in self.stop_words]

        freq_dist = FreqDist(words)
        return freq_dist.most_common(top_n)

    def classify_pdf_by_module(self, pdf_name, text):
        """Clasificar un PDF en su módulo correspondiente"""
        pdf_name_lower = pdf_name.lower()
        text_lower = text.lower()

        module_scores = defaultdict(int)

        for module, keywords in self.modules_mapping.items():
            for keyword in keywords:
                if keyword.lower() in pdf_name_lower:
                    module_scores[module] += 3  # Peso mayor si está en el nombre
                if keyword.lower() in text_lower:
                    module_scores[module] += 1

        if module_scores:
            return max(module_scores, key=module_scores.get)
        else:
            return None

    def extract_meaningful_content(self, text, max_sentences=50):
        """Extraer contenido significativo del texto"""
        sentences = sent_tokenize(text, language='spanish')

        # Filtrar oraciones muy cortas o sin significado
        meaningful_sentences = []
        for sentence in sentences:
            if len(sentence.split()) > 10 and len(sentence.split()) < 100:
                meaningful_sentences.append(sentence)

        return meaningful_sentences[:max_sentences]

    def analyze_pdfs(self):
        """Analizar todos los PDFs y generar informe"""
        results = {}

        pdf_files = list(self.pdfs_dir.glob("*.pdf"))

        for pdf_file in pdf_files:
            print(f"Analizando: {pdf_file.name.encode('ascii', 'ignore').decode('ascii')}")

            text = self.extract_text_from_pdf(pdf_file)
            if not text:
                continue

            cleaned_text = self.clean_text(text)

            # Extraer información
            key_concepts = self.extract_key_concepts(cleaned_text)
            module = self.classify_pdf_by_module(pdf_file.name, cleaned_text)
            meaningful_content = self.extract_meaningful_content(cleaned_text)

            results[pdf_file.name] = {
                'file_path': str(pdf_file),
                'size': pdf_file.stat().st_size,
                'module': module,
                'key_concepts': key_concepts,
                'content_preview': meaningful_content[:10],  # Primeras 10 oraciones
                'total_content': meaningful_content
            }

        return results

    def generate_html_content(self, results):
        """Generar contenido HTML para cada módulo"""
        module_content = defaultdict(list)

        for pdf_name, data in results.items():
            if data['module']:
                module_content[data['module']].append({
                    'pdf_name': pdf_name,
                    'key_concepts': data['key_concepts'],
                    'content': data['total_content']
                })

        html_templates = {}

        for module, contents in module_content.items():
            html_sections = []

            for content_data in contents:
                # Crear sección HTML para este PDF
                section_html = f"""
                <div class="pdf-content-section">
                    <h3>Contenido de: {content_data['pdf_name']}</h3>

                    <div class="key-concepts">
                        <h4>Conceptos Clave:</h4>
                        <ul>
                """

                for concept, frequency in content_data['key_concepts']:
                    section_html += f"                            <li>{concept} ({frequency} veces)</li>"

                section_html += """
                        </ul>
                    </div>

                    <div class="extracted-content">
                        <h4>Contenido Extraído:</h4>
                """

                for i, sentence in enumerate(content_data['content']):
                    section_html += f"                        <p>{sentence}</p>\n"

                section_html += """
                    </div>
                </div>
                <hr class="content-separator">
                """

                html_sections.append(section_html)

            html_templates[module] = "\n".join(html_sections)

        return html_templates

    def save_results(self, results, output_file='pdf_analysis_results.json'):
        """Guardar resultados en archivo JSON"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"Resultados guardados en {output_file}")

    def save_html_templates(self, html_templates, output_dir='html_templates'):
        """Guardar plantillas HTML generadas"""
        os.makedirs(output_dir, exist_ok=True)

        for module, html_content in html_templates.items():
            # Limpiar nombre del módulo para el archivo
            safe_module_name = re.sub(r'[^\w\s-]', '', module).strip().replace(' ', '_')
            output_file = os.path.join(output_dir, f"{safe_module_name}_content.html")

            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"Plantilla HTML guardada: {output_file}")

def main():
    """Función principal"""
    # Ruta a los PDFs
    pdfs_dir = "C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\pdfs\\master-adicciones"

    if not os.path.exists(pdfs_dir):
        print(f"Directorio no encontrado: {pdfs_dir}")
        return

    # Crear analizador
    analyzer = PDFAnalyzer(pdfs_dir)

    # Analizar PDFs
    print("Iniciando análisis de PDFs...")
    results = analyzer.analyze_pdfs()

    # Guardar resultados
    analyzer.save_results(results)

    # Generar contenido HTML
    print("Generando contenido HTML...")
    html_templates = analyzer.generate_html_content(results)
    analyzer.save_html_templates(html_templates)

    # Mostrar resumen
    print("\n=== RESUMEN DEL ANÁLISIS ===")
    print(f"PDFs analizados: {len(results)}")

    module_count = defaultdict(int)
    for data in results.values():
        if data['module']:
            module_count[data['module']] += 1

    print("\nDistribución por módulos:")
    for module, count in module_count.items():
        print(f"  {module}: {count} PDFs")

    print("\nAnálisis completado!")

if __name__ == "__main__":
    main()