#!/usr/bin/env python3
"""
Script para aplicar la migración que agrega leccion_id a preguntas
usando el cliente de Supabase con service key.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def get_supabase_client():
    """
    Obtener cliente de Supabase con service key para operaciones administrativas
    """
    url = os.getenv("VITE_SUPABASE_URL")
    service_key = os.getenv("VITE_SUPABASE_SERVICE_KEY")
    
    if not url or not service_key:
        print("❌ Error: Variables de Supabase no encontradas")
        print("💡 Verifica VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY en .env")
        return None
    
    try:
        supabase: Client = create_client(url, service_key)
        print("✅ Cliente de Supabase inicializado")
        return supabase
    except Exception as e:
        print(f"❌ Error inicializando Supabase: {e}")
        return None

def check_column_exists(supabase):
    """
    Verificar si la columna leccion_id ya existe
    """
    print("🔍 Verificando si la columna leccion_id existe...")
    
    try:
        # Intentar hacer una consulta que use la columna
        result = supabase.table('preguntas').select('leccion_id').limit(1).execute()
        print("✅ La columna leccion_id ya existe")
        return True
    except Exception as e:
        if "column" in str(e).lower() and "does not exist" in str(e).lower():
            print("📝 La columna leccion_id no existe, necesita ser creada")
            return False
        else:
            print(f"❌ Error verificando columna: {e}")
            return False

def get_cuestionarios_with_lessons(supabase):
    """
    Obtener cuestionarios que tienen leccion_id asignado
    """
    print("📊 Obteniendo cuestionarios con lecciones...")
    
    try:
        result = supabase.table('cuestionarios').select('id, titulo, leccion_id').execute()
        
        cuestionarios_con_leccion = [c for c in result.data if c['leccion_id']]
        cuestionarios_sin_leccion = [c for c in result.data if not c['leccion_id']]
        
        print(f"✅ Encontrados {len(cuestionarios_con_leccion)} cuestionarios con lección")
        print(f"⚠️  Encontrados {len(cuestionarios_sin_leccion)} cuestionarios sin lección")
        
        if cuestionarios_con_leccion:
            print("\nCuestionarios con lección:")
            for c in cuestionarios_con_leccion[:5]:  # Mostrar solo los primeros 5
                print(f"  - {c['titulo']} (Lección ID: {c['leccion_id']})")
        
        return cuestionarios_con_leccion
        
    except Exception as e:
        print(f"❌ Error obteniendo cuestionarios: {e}")
        return []

def update_preguntas_manually(supabase, cuestionarios):
    """
    Actualizar preguntas manualmente una por una
    (ya que no podemos agregar la columna directamente)
    """
    print("🔄 Simulando actualización de preguntas con leccion_id...")
    
    total_preguntas = 0
    preguntas_por_cuestionario = {}
    
    for cuestionario in cuestionarios:
        try:
            # Obtener preguntas de este cuestionario
            result = supabase.table('preguntas').select('id, pregunta').eq('cuestionario_id', cuestionario['id']).execute()
            
            count = len(result.data)
            total_preguntas += count
            preguntas_por_cuestionario[cuestionario['titulo']] = {
                'count': count,
                'leccion_id': cuestionario['leccion_id']
            }
            
            print(f"  📝 {cuestionario['titulo']}: {count} preguntas → Lección {cuestionario['leccion_id']}")
            
        except Exception as e:
            print(f"❌ Error procesando {cuestionario['titulo']}: {e}")
    
    print(f"\n📊 Total de preguntas que necesitan leccion_id: {total_preguntas}")
    return preguntas_por_cuestionario

def show_migration_sql():
    """
    Mostrar el SQL que se necesita ejecutar manualmente
    """
    print("\n" + "="*60)
    print("📋 SQL PARA EJECUTAR MANUALMENTE EN SUPABASE:")
    print("="*60)
    
    sql = """
-- 1. Agregar la columna leccion_id a la tabla preguntas
ALTER TABLE preguntas 
ADD COLUMN leccion_id UUID REFERENCES lecciones(id);

-- 2. Crear índice para mejorar rendimiento
CREATE INDEX idx_preguntas_leccion_id ON preguntas(leccion_id);

-- 3. Actualizar preguntas existentes con leccion_id
UPDATE preguntas 
SET leccion_id = c.leccion_id
FROM cuestionarios c
WHERE preguntas.cuestionario_id = c.id
AND c.leccion_id IS NOT NULL;

-- 4. Verificar el resultado
SELECT 
    COUNT(CASE WHEN leccion_id IS NOT NULL THEN 1 END) as con_leccion_id,
    COUNT(CASE WHEN leccion_id IS NULL THEN 1 END) as sin_leccion_id,
    COUNT(*) as total
FROM preguntas;
"""
    
    print(sql)
    print("="*60)
    print("💡 Copia y pega este SQL en el editor SQL de Supabase")
    print("🔗 Ve a: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/sql")
    print("="*60)

def verify_current_state(supabase):
    """
    Verificar el estado actual de las preguntas
    """
    print("\n🔍 Verificando estado actual...")
    
    try:
        # Contar preguntas totales
        result = supabase.table('preguntas').select('id', count='exact').execute()
        total_preguntas = result.count
        
        print(f"📊 Total de preguntas en la base de datos: {total_preguntas}")
        
        # Mostrar algunas preguntas de ejemplo
        result = supabase.table('preguntas').select('id, pregunta, cuestionario_id').limit(3).execute()
        
        print("\n📝 Ejemplos de preguntas:")
        for pregunta in result.data:
            pregunta_corta = pregunta['pregunta'][:60] + "..." if len(pregunta['pregunta']) > 60 else pregunta['pregunta']
            print(f"  - ID: {pregunta['id']}")
            print(f"    Pregunta: {pregunta_corta}")
            print(f"    Cuestionario ID: {pregunta['cuestionario_id']}")
        
        return total_preguntas
        
    except Exception as e:
        print(f"❌ Error verificando estado: {e}")
        return 0

def main():
    print("🚀 Iniciando análisis de migración leccion_id...\n")
    
    # Obtener cliente de Supabase
    supabase = get_supabase_client()
    if not supabase:
        return
    
    # Verificar estado actual
    total_preguntas = verify_current_state(supabase)
    if total_preguntas == 0:
        print("❌ No se encontraron preguntas en la base de datos")
        return
    
    # Verificar si la columna existe
    column_exists = check_column_exists(supabase)
    
    if not column_exists:
        print("\n⚠️  La columna leccion_id no existe en la tabla preguntas")
        print("📋 Se necesita ejecutar una migración SQL manualmente")
    
    # Obtener cuestionarios con lecciones
    cuestionarios = get_cuestionarios_with_lessons(supabase)
    
    if cuestionarios:
        # Simular actualización
        preguntas_info = update_preguntas_manually(supabase, cuestionarios)
        
        # Mostrar SQL para ejecutar manualmente
        show_migration_sql()
        
        print("\n" + "="*50)
        print("📋 RESUMEN:")
        print(f"✅ {total_preguntas} preguntas encontradas")
        print(f"✅ {len(cuestionarios)} cuestionarios con lección asignada")
        
        if not column_exists:
            print("⚠️  Columna leccion_id necesita ser creada")
            print("💡 Ejecuta el SQL mostrado arriba en Supabase")
        else:
            print("✅ Columna leccion_id ya existe")
        
        print("="*50)
    else:
        print("❌ No se encontraron cuestionarios con lecciones asignadas")

if __name__ == "__main__":
    main()