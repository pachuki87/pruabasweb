#!/usr/bin/env python3
"""
Script para agregar la columna leccion_id a la tabla preguntas
y establecer la relación entre preguntas y lecciones.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Variables de entorno de Supabase no encontradas")
    exit(1)

supabase: Client = create_client(url, key)

def add_leccion_id_column():
    """
    Agregar la columna leccion_id a la tabla preguntas
    """
    print("🔧 Agregando columna leccion_id a la tabla preguntas...")
    
    # SQL para agregar la columna
    sql_add_column = """
    ALTER TABLE preguntas 
    ADD COLUMN IF NOT EXISTS leccion_id UUID REFERENCES lecciones(id);
    """
    
    try:
        result = supabase.rpc('execute_sql', {'query': sql_add_column}).execute()
        print("✅ Columna leccion_id agregada exitosamente")
        return True
    except Exception as e:
        print(f"❌ Error al agregar columna: {e}")
        return False

def get_cuestionarios_and_lessons():
    """
    Obtener la relación entre cuestionarios y lecciones
    """
    print("📊 Obteniendo relación cuestionarios-lecciones...")
    
    try:
        # Obtener cuestionarios con sus lecciones
        cuestionarios = supabase.table('cuestionarios').select('id, leccion_id, titulo').execute()
        
        print(f"Encontrados {len(cuestionarios.data)} cuestionarios:")
        for cuest in cuestionarios.data:
            print(f"  - {cuest['titulo']} (ID: {cuest['id']}, Lección: {cuest['leccion_id']})")
        
        return cuestionarios.data
    except Exception as e:
        print(f"❌ Error al obtener cuestionarios: {e}")
        return []

def update_preguntas_with_leccion_id(cuestionarios):
    """
    Actualizar las preguntas con el leccion_id correspondiente
    """
    print("🔄 Actualizando preguntas con leccion_id...")
    
    updated_count = 0
    
    for cuestionario in cuestionarios:
        cuestionario_id = cuestionario['id']
        leccion_id = cuestionario['leccion_id']
        
        if not leccion_id:
            print(f"⚠️  Cuestionario {cuestionario['titulo']} no tiene leccion_id asignado")
            continue
        
        try:
            # Actualizar todas las preguntas de este cuestionario
            result = supabase.table('preguntas').update({
                'leccion_id': leccion_id
            }).eq('cuestionario_id', cuestionario_id).execute()
            
            count = len(result.data) if result.data else 0
            updated_count += count
            print(f"  ✅ Actualizadas {count} preguntas del cuestionario '{cuestionario['titulo']}'")
            
        except Exception as e:
            print(f"❌ Error actualizando preguntas del cuestionario {cuestionario['titulo']}: {e}")
    
    print(f"\n📈 Total de preguntas actualizadas: {updated_count}")
    return updated_count

def verify_updates():
    """
    Verificar que las actualizaciones se realizaron correctamente
    """
    print("\n🔍 Verificando actualizaciones...")
    
    try:
        # Contar preguntas con leccion_id
        preguntas_con_leccion = supabase.table('preguntas').select('id').not_.is_('leccion_id', 'null').execute()
        
        # Contar preguntas sin leccion_id
        preguntas_sin_leccion = supabase.table('preguntas').select('id').is_('leccion_id', 'null').execute()
        
        total_con_leccion = len(preguntas_con_leccion.data)
        total_sin_leccion = len(preguntas_sin_leccion.data)
        
        print(f"📊 Preguntas con leccion_id: {total_con_leccion}")
        print(f"📊 Preguntas sin leccion_id: {total_sin_leccion}")
        
        if total_sin_leccion > 0:
            print("⚠️  Hay preguntas sin leccion_id asignado")
            
            # Mostrar algunas preguntas sin leccion_id
            preguntas_huerfanas = supabase.table('preguntas').select('id, cuestionario_id, pregunta').is_('leccion_id', 'null').limit(5).execute()
            
            print("\nEjemplos de preguntas sin leccion_id:")
            for pregunta in preguntas_huerfanas.data:
                print(f"  - ID: {pregunta['id']}, Cuestionario: {pregunta['cuestionario_id']}")
                print(f"    Pregunta: {pregunta['pregunta'][:100]}...")
        
        return total_con_leccion, total_sin_leccion
        
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return 0, 0

def main():
    print("🚀 Iniciando proceso de agregar leccion_id a preguntas...\n")
    
    # Paso 1: Agregar la columna
    if not add_leccion_id_column():
        print("❌ No se pudo agregar la columna. Abortando.")
        return
    
    # Paso 2: Obtener cuestionarios y lecciones
    cuestionarios = get_cuestionarios_and_lessons()
    if not cuestionarios:
        print("❌ No se encontraron cuestionarios. Abortando.")
        return
    
    # Paso 3: Actualizar preguntas
    updated_count = update_preguntas_with_leccion_id(cuestionarios)
    
    # Paso 4: Verificar
    con_leccion, sin_leccion = verify_updates()
    
    print("\n" + "="*50)
    print("📋 RESUMEN FINAL:")
    print(f"✅ Columna leccion_id agregada a tabla preguntas")
    print(f"✅ {updated_count} preguntas actualizadas")
    print(f"📊 {con_leccion} preguntas con leccion_id")
    print(f"📊 {sin_leccion} preguntas sin leccion_id")
    
    if sin_leccion == 0:
        print("🎉 ¡Todas las preguntas tienen leccion_id asignado!")
    else:
        print("⚠️  Algunas preguntas necesitan revisión manual")
    
    print("="*50)

if __name__ == "__main__":
    main()