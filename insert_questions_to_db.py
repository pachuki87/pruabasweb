import json
import uuid
from supabase import create_client, Client
import os
from datetime import datetime

# Configuración de Supabase
SUPABASE_URL = "https://lyojcqiiixkqqtpoejdo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM"

# ID del curso "Experto en Conductas Adictivas"
CURSO_ID = "d7c3e503-ed61-4d7a-9e5f-aedc407d4836"

def init_supabase():
    """Inicializa el cliente de Supabase"""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print(f"Error conectando a Supabase: {e}")
        return None

def load_extracted_questions():
    """Carga las preguntas extraídas del JSON"""
    try:
        with open('preguntas_extraidas.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error cargando preguntas: {e}")
        return None

def create_cuestionario(supabase, titulo, curso_id, leccion_id=None):
    """Crea un nuevo cuestionario en la base de datos"""
    try:
        cuestionario_data = {
            'id': str(uuid.uuid4()),
            'titulo': titulo,
            'curso_id': curso_id,
            'leccion_id': leccion_id,
            'creado_en': datetime.now().isoformat()
        }
        
        result = supabase.table('cuestionarios').insert(cuestionario_data).execute()
        
        if result.data:
            print(f"✅ Cuestionario creado: {titulo}")
            return result.data[0]['id']
        else:
            print(f"❌ Error creando cuestionario: {titulo}")
            return None
            
    except Exception as e:
        print(f"❌ Error creando cuestionario {titulo}: {e}")
        return None

def create_pregunta(supabase, cuestionario_id, pregunta_text, tipo, orden, explicacion=None):
    """Crea una nueva pregunta en la base de datos"""
    try:
        pregunta_data = {
            'id': str(uuid.uuid4()),
            'cuestionario_id': cuestionario_id,
            'pregunta': pregunta_text,
            'tipo': tipo,
            'orden': orden,
            'explicacion': explicacion,
            'creado_en': datetime.now().isoformat()
        }
        
        result = supabase.table('preguntas').insert(pregunta_data).execute()
        
        if result.data:
            return result.data[0]['id']
        else:
            print(f"❌ Error creando pregunta: {pregunta_text[:50]}...")
            return None
            
    except Exception as e:
        print(f"❌ Error creando pregunta: {e}")
        return None

def create_opciones_respuesta(supabase, pregunta_id, opciones):
    """Crea opciones de respuesta para preguntas de opción múltiple"""
    try:
        opciones_data = []
        for i, opcion in enumerate(opciones):
            opcion_data = {
                'id': str(uuid.uuid4()),
                'pregunta_id': pregunta_id,
                'opcion': opcion['texto'],
                'es_correcta': opcion.get('es_correcta', False),
                'orden': i + 1,
                'creado_en': datetime.now().isoformat()
            }
            opciones_data.append(opcion_data)
        
        if opciones_data:
            result = supabase.table('opciones_respuesta').insert(opciones_data).execute()
            if result.data:
                return True
        return False
        
    except Exception as e:
        print(f"❌ Error creando opciones: {e}")
        return False

def generate_default_options_for_multiple_choice():
    """Genera opciones por defecto para preguntas de opción múltiple"""
    return [
        {'texto': 'Opción A', 'es_correcta': True},
        {'texto': 'Opción B', 'es_correcta': False},
        {'texto': 'Opción C', 'es_correcta': False},
        {'texto': 'Opción D', 'es_correcta': False}
    ]

def process_module_questions(supabase, module_id, module_data):
    """Procesa las preguntas de un módulo específico"""
    print(f"\n📚 Procesando {module_data['nombre']}...")
    
    # Crear cuestionario para el módulo
    cuestionario_titulo = f"Cuestionario: {module_data['nombre']}"
    cuestionario_id = create_cuestionario(supabase, cuestionario_titulo, CURSO_ID)
    
    if not cuestionario_id:
        print(f"❌ No se pudo crear cuestionario para {module_data['nombre']}")
        return False
    
    total_preguntas = 0
    
    # Procesar preguntas abiertas (texto_libre)
    for i, pregunta in enumerate(module_data['preguntas_abiertas']):
        pregunta_id = create_pregunta(
            supabase, 
            cuestionario_id, 
            pregunta['texto'], 
            'texto_libre', 
            total_preguntas + 1,
            f"Pregunta abierta del módulo {module_data['numero']}"
        )
        
        if pregunta_id:
            total_preguntas += 1
            print(f"  ✅ Pregunta abierta {total_preguntas}: {pregunta['texto'][:50]}...")
        else:
            print(f"  ❌ Error con pregunta abierta: {pregunta['texto'][:50]}...")
    
    # Procesar preguntas de cuestionario (multiple_choice)
    for i, pregunta in enumerate(module_data['preguntas_cuestionario']):
        # Filtrar preguntas que parecen ser fragmentos o mal extraídas
        if len(pregunta['texto'].strip()) < 10 or pregunta['texto'].strip() in ['s Abiertas', '?']:
            print(f"  ⚠️ Saltando pregunta fragmentada: {pregunta['texto']}")
            continue
            
        pregunta_id = create_pregunta(
            supabase, 
            cuestionario_id, 
            pregunta['texto'], 
            'multiple_choice', 
            total_preguntas + 1,
            f"Pregunta de opción múltiple del módulo {module_data['numero']}"
        )
        
        if pregunta_id:
            # Crear opciones por defecto para preguntas de opción múltiple
            opciones = generate_default_options_for_multiple_choice()
            if create_opciones_respuesta(supabase, pregunta_id, opciones):
                total_preguntas += 1
                print(f"  ✅ Pregunta múltiple {total_preguntas}: {pregunta['texto'][:50]}...")
            else:
                print(f"  ❌ Error creando opciones para: {pregunta['texto'][:50]}...")
        else:
            print(f"  ❌ Error con pregunta múltiple: {pregunta['texto'][:50]}...")
    
    print(f"📊 Total preguntas procesadas para {module_data['nombre']}: {total_preguntas}")
    return total_preguntas > 0

def main():
    print("🚀 Iniciando inserción de preguntas en la base de datos...")
    
    # Cargar preguntas extraídas
    modules = load_extracted_questions()
    if not modules:
        print("❌ No se pudieron cargar las preguntas extraídas")
        return
    
    # Inicializar Supabase
    supabase = init_supabase()
    if not supabase:
        print("❌ No se pudo conectar a Supabase")
        return
    
    print(f"📋 Módulos encontrados: {len(modules)}")
    
    # Procesar cada módulo
    total_modules_processed = 0
    for module_id, module_data in modules.items():
        try:
            if process_module_questions(supabase, module_id, module_data):
                total_modules_processed += 1
        except Exception as e:
            print(f"❌ Error procesando módulo {module_id}: {e}")
            continue
    
    print(f"\n🎉 Proceso completado!")
    print(f"📊 Módulos procesados exitosamente: {total_modules_processed}/{len(modules)}")
    print(f"💡 Revisa la base de datos para verificar que las preguntas se insertaron correctamente")
    print(f"⚠️ Nota: Las preguntas de opción múltiple tienen opciones por defecto que debes editar")

if __name__ == "__main__":
    print("⚠️ IMPORTANTE: Antes de ejecutar este script:")
    print("1. Configura SUPABASE_URL y SUPABASE_KEY en el código")
    print("2. Instala supabase: pip install supabase")
    print("3. Asegúrate de tener el archivo preguntas_extraidas.json")
    print("\n¿Deseas continuar? (y/n): ", end="")
    
    respuesta = input().lower()
    if respuesta == 'y' or respuesta == 'yes':
        main()
    else:
        print("❌ Operación cancelada")