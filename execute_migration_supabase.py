#!/usr/bin/env python3
"""
Script para ejecutar la migración SQL directamente en Supabase
usando el service key y RPC.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def get_supabase_client():
    """
    Obtener cliente de Supabase con service key
    """
    url = os.getenv("VITE_SUPABASE_URL")
    service_key = os.getenv("VITE_SUPABASE_SERVICE_KEY")
    
    if not url or not service_key:
        print("❌ Error: Variables de Supabase no encontradas")
        return None
    
    try:
        supabase: Client = create_client(url, service_key)
        print("✅ Cliente de Supabase inicializado")
        return supabase
    except Exception as e:
        print(f"❌ Error inicializando Supabase: {e}")
        return None

def execute_sql_step_by_step(supabase):
    """
    Ejecutar cada paso de la migración por separado
    """
    print("🔧 Ejecutando migración paso a paso...\n")
    
    # Paso 1: Agregar columna
    print("📝 Paso 1: Agregando columna leccion_id...")
    try:
        result = supabase.rpc('execute_sql', {
            'sql': 'ALTER TABLE preguntas ADD COLUMN leccion_id UUID REFERENCES lecciones(id);'
        }).execute()
        print("✅ Columna leccion_id agregada exitosamente")
    except Exception as e:
        if "already exists" in str(e).lower():
            print("⚠️  La columna leccion_id ya existe")
        else:
            print(f"❌ Error agregando columna: {e}")
            return False
    
    # Paso 2: Crear índice
    print("\n📝 Paso 2: Creando índice...")
    try:
        result = supabase.rpc('execute_sql', {
            'sql': 'CREATE INDEX IF NOT EXISTS idx_preguntas_leccion_id ON preguntas(leccion_id);'
        }).execute()
        print("✅ Índice creado exitosamente")
    except Exception as e:
        print(f"❌ Error creando índice: {e}")
        # No es crítico, continuamos
    
    # Paso 3: Actualizar preguntas existentes
    print("\n📝 Paso 3: Actualizando preguntas existentes...")
    try:
        result = supabase.rpc('execute_sql', {
            'sql': '''UPDATE preguntas 
                     SET leccion_id = c.leccion_id
                     FROM cuestionarios c
                     WHERE preguntas.cuestionario_id = c.id
                     AND c.leccion_id IS NOT NULL;'''
        }).execute()
        print("✅ Preguntas actualizadas exitosamente")
    except Exception as e:
        print(f"❌ Error actualizando preguntas: {e}")
        return False
    
    return True

def verify_migration_results(supabase):
    """
    Verificar los resultados de la migración
    """
    print("\n🔍 Verificando resultados de la migración...")
    
    try:
        # Verificar estadísticas
        result = supabase.rpc('execute_sql', {
            'sql': '''SELECT 
                        COUNT(CASE WHEN leccion_id IS NOT NULL THEN 1 END) as con_leccion_id,
                        COUNT(CASE WHEN leccion_id IS NULL THEN 1 END) as sin_leccion_id,
                        COUNT(*) as total
                      FROM preguntas;'''
        }).execute()
        
        if result.data:
            stats = result.data[0]
            print(f"📊 Estadísticas de preguntas:")
            print(f"  - Total: {stats['total']}")
            print(f"  - Con leccion_id: {stats['con_leccion_id']}")
            print(f"  - Sin leccion_id: {stats['sin_leccion_id']}")
        
        # Mostrar ejemplos
        result = supabase.table('preguntas').select('id, pregunta, leccion_id, cuestionario_id').limit(5).execute()
        
        print("\n📝 Ejemplos de preguntas actualizadas:")
        for pregunta in result.data:
            pregunta_corta = pregunta['pregunta'][:50] + "..." if len(pregunta['pregunta']) > 50 else pregunta['pregunta']
            leccion_status = f"Lección: {pregunta['leccion_id'][:8]}..." if pregunta['leccion_id'] else "Sin lección"
            print(f"  - {pregunta_corta} ({leccion_status})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verificando resultados: {e}")
        return False

def main():
    print("🚀 Ejecutando migración leccion_id en Supabase...\n")
    
    # Obtener cliente de Supabase
    supabase = get_supabase_client()
    if not supabase:
        return
    
    # Ejecutar migración
    if execute_sql_step_by_step(supabase):
        # Verificar resultados
        if verify_migration_results(supabase):
            print("\n🎉 ¡Migración completada exitosamente!")
            print("✅ La columna leccion_id ha sido agregada a la tabla preguntas")
            print("✅ Las preguntas existentes han sido actualizadas con sus lecciones correspondientes")
        else:
            print("\n⚠️  Migración ejecutada pero hubo problemas en la verificación")
    else:
        print("\n❌ La migración falló")

if __name__ == "__main__":
    main()