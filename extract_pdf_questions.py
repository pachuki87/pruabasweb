import pymupdf
import re
import json
import os

def extract_text_from_pdf(pdf_path):
    """Extrae todo el texto de un archivo PDF"""
    text = ""
    try:
        doc = pymupdf.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
            text += "\n\n--- PÁGINA {} ---\n\n".format(page_num + 1)
        doc.close()
    except Exception as e:
        print(f"Error procesando PDF: {e}")
    return text

def analyze_questions_by_module(text):
    """Analiza el texto extraído para identificar módulos y preguntas"""
    modules = {}
    
    # Patrones para identificar módulos
    module_patterns = [
        r'MÓDULO\s+(\d+)[:\s]*([^\n]+)',
        r'Módulo\s+(\d+)[:\s]*([^\n]+)',
        r'TEMA\s+(\d+)[:\s]*([^\n]+)',
        r'Tema\s+(\d+)[:\s]*([^\n]+)',
        r'UNIDAD\s+(\d+)[:\s]*([^\n]+)',
        r'Unidad\s+(\d+)[:\s]*([^\n]+)'
    ]
    
    # Patrones para identificar preguntas
    question_patterns = [
        r'\d+[\.)\s]+([^\n]+\?)',  # Preguntas numeradas que terminan en ?
        r'¿([^?]+\?)',  # Preguntas que empiezan con ¿
        r'Pregunta\s*\d*[:\s]*([^\n]+)',  # Preguntas explícitas
        r'\b(Explique|Describa|Analice|Compare|Defina|Enumere)[^\n]+',  # Preguntas abiertas
        r'[a-z]\)\s*([^\n]+)',  # Opciones múltiples
        r'Verdadero\s*o\s*Falso',  # Verdadero/Falso
        r'V\s*o\s*F[:\s]*([^\n]+)'  # V o F
    ]
    
    lines = text.split('\n')
    current_module = None
    current_module_name = ""
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Buscar módulos
        for pattern in module_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                module_num = match.group(1)
                module_name = match.group(2).strip() if len(match.groups()) > 1 else f"Módulo {module_num}"
                current_module = f"modulo_{module_num}"
                current_module_name = module_name
                
                if current_module not in modules:
                    modules[current_module] = {
                        'nombre': module_name,
                        'numero': int(module_num),
                        'preguntas_abiertas': [],
                        'preguntas_cuestionario': []
                    }
                break
        
        # Buscar preguntas si estamos en un módulo
        if current_module:
            for pattern in question_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                for match in matches:
                    question_text = match.strip() if isinstance(match, str) else line.strip()
                    
                    # Determinar tipo de pregunta
                    question_type = determine_question_type(question_text, lines[max(0, i-2):i+3])
                    
                    question_obj = {
                        'texto': question_text,
                        'tipo': question_type,
                        'modulo': current_module_name,
                        'pagina_aproximada': get_approximate_page(text, line)
                    }
                    
                    if question_type == 'texto_libre':
                        modules[current_module]['preguntas_abiertas'].append(question_obj)
                    else:
                        modules[current_module]['preguntas_cuestionario'].append(question_obj)
    
    return modules

def determine_question_type(question_text, context_lines):
    """Determina si una pregunta es abierta o de cuestionario"""
    question_lower = question_text.lower()
    context_text = ' '.join(context_lines).lower()
    
    # Indicadores de preguntas de opción múltiple
    multiple_choice_indicators = [
        'a)', 'b)', 'c)', 'd)', 'e)',
        'verdadero', 'falso', 'v o f',
        'seleccione', 'marque', 'elija',
        'opción correcta', 'alternativa'
    ]
    
    # Indicadores de preguntas abiertas
    open_question_indicators = [
        'explique', 'describa', 'analice', 'compare',
        'defina', 'enumere', 'desarrolle', 'argumente',
        'justifique', 'comente', 'reflexione'
    ]
    
    # Verificar contexto para opciones múltiples
    for indicator in multiple_choice_indicators:
        if indicator in context_text or indicator in question_lower:
            return 'multiple_choice'
    
    # Verificar indicadores de preguntas abiertas
    for indicator in open_question_indicators:
        if indicator in question_lower:
            return 'texto_libre'
    
    # Si termina en ? y no tiene indicadores de opción múltiple, probablemente es abierta
    if question_text.endswith('?') and not any(ind in context_text for ind in multiple_choice_indicators):
        return 'texto_libre'
    
    # Por defecto, asumir que es de opción múltiple
    return 'multiple_choice'

def get_approximate_page(full_text, line_text):
    """Obtiene la página aproximada donde aparece una línea"""
    page_markers = full_text.split('--- PÁGINA')
    for i, section in enumerate(page_markers):
        if line_text in section:
            return i
    return 1

def save_questions_to_json(modules, output_file):
    """Guarda las preguntas extraídas en formato JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(modules, f, ensure_ascii=False, indent=2)

def main():
    pdf_path = r"C:\Users\pabli\OneDrive\Desktop\institutoooo\pruabasweb\master en adicciones\Master cuestionarios.pdf"
    output_file = "preguntas_extraidas.json"
    
    print("Extrayendo texto del PDF...")
    text = extract_text_from_pdf(pdf_path)
    
    if not text.strip():
        print("No se pudo extraer texto del PDF")
        return
    
    print(f"Texto extraído: {len(text)} caracteres")
    
    # Guardar texto extraído para revisión
    with open("texto_extraido.txt", "w", encoding="utf-8") as f:
        f.write(text)
    
    print("Analizando preguntas por módulo...")
    modules = analyze_questions_by_module(text)
    
    print(f"Módulos encontrados: {len(modules)}")
    for module_id, module_data in modules.items():
        print(f"- {module_data['nombre']}: {len(module_data['preguntas_abiertas'])} abiertas, {len(module_data['preguntas_cuestionario'])} cuestionario")
    
    print("Guardando preguntas en JSON...")
    save_questions_to_json(modules, output_file)
    
    print(f"Proceso completado. Revisa {output_file} y texto_extraido.txt")

if __name__ == "__main__":
    main()