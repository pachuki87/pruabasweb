#!/usr/bin/env python3
"""
Script para actualizar los flags tiene_cuestionario en las lecciones
basado en los cuestionarios asignados.
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

def get_lecciones_with_cuestionarios(supabase):
    """
    Obtener lecciones que tienen cuestionarios asignados
    """
    print("📊 Analizando lecciones y cuestionarios...")
    
    try:
        # Obtener todas las lecciones
        lecciones_result = supabase.table('lecciones').select('id, titulo, tiene_cuestionario').execute()
        lecciones = {l['id']: l for l in lecciones_result.data}
        
        # Obtener cuestionarios con leccion_id
        cuestionarios_result = supabase.table('cuestionarios').select('id, titulo, leccion_id').execute()
        
        # Agrupar por lección
        lecciones_con_cuestionarios = {}
        lecciones_sin_cuestionarios = set(lecciones.keys())
        
        for cuestionario in cuestionarios_result.data:
            if cuestionario['leccion_id']:
                leccion_id = cuestionario['leccion_id']
                if leccion_id not in lecciones_con_cuestionarios:
                    lecciones_con_cuestionarios[leccion_id] = []
                lecciones_con_cuestionarios[leccion_id].append(cuestionario)
                lecciones_sin_cuestionarios.discard(leccion_id)
        
        print(f"✅ {len(lecciones_con_cuestionarios)} lecciones tienen cuestionarios")
        print(f"📝 {len(lecciones_sin_cuestionarios)} lecciones sin cuestionarios")
        
        return lecciones, lecciones_con_cuestionarios, lecciones_sin_cuestionarios
        
    except Exception as e:
        print(f"❌ Error obteniendo datos: {e}")
        return {}, {}, set()

def update_tiene_cuestionario_flags(supabase, lecciones, lecciones_con_cuestionarios, lecciones_sin_cuestionarios):
    """
    Actualizar los flags tiene_cuestionario
    """
    print("\n🔄 Actualizando flags tiene_cuestionario...")
    
    actualizaciones_exitosas = 0
    errores = 0
    
    # Actualizar lecciones que SÍ tienen cuestionarios
    for leccion_id, cuestionarios in lecciones_con_cuestionarios.items():
        leccion = lecciones.get(leccion_id)
        if not leccion:
            continue
            
        try:
            if not leccion['tiene_cuestionario']:  # Solo actualizar si está en false
                result = supabase.table('lecciones').update({
                    'tiene_cuestionario': True
                }).eq('id', leccion_id).execute()
                
                print(f"  ✅ {leccion['titulo']}: tiene_cuestionario = True ({len(cuestionarios)} cuestionarios)")
                actualizaciones_exitosas += 1
            else:
                print(f"  ℹ️  {leccion['titulo']}: ya tenía tiene_cuestionario = True")
                
        except Exception as e:
            print(f"  ❌ Error actualizando {leccion['titulo']}: {e}")
            errores += 1
    
    # Actualizar lecciones que NO tienen cuestionarios
    for leccion_id in lecciones_sin_cuestionarios:
        leccion = lecciones.get(leccion_id)
        if not leccion:
            continue
            
        try:
            if leccion['tiene_cuestionario']:  # Solo actualizar si está en true
                result = supabase.table('lecciones').update({
                    'tiene_cuestionario': False
                }).eq('id', leccion_id).execute()
                
                print(f"  ✅ {leccion['titulo']}: tiene_cuestionario = False (sin cuestionarios)")
                actualizaciones_exitosas += 1
            else:
                print(f"  ℹ️  {leccion['titulo']}: ya tenía tiene_cuestionario = False")
                
        except Exception as e:
            print(f"  ❌ Error actualizando {leccion['titulo']}: {e}")
            errores += 1
    
    return actualizaciones_exitosas, errores

def verify_updates(supabase):
    """
    Verificar las actualizaciones realizadas
    """
    print("\n🔍 Verificando actualizaciones...")
    
    try:
        # Contar lecciones por estado
        result = supabase.table('lecciones').select('tiene_cuestionario').execute()
        
        con_cuestionario = sum(1 for l in result.data if l['tiene_cuestionario'])
        sin_cuestionario = sum(1 for l in result.data if not l['tiene_cuestionario'])
        
        print(f"📊 Estado final:")
        print(f"  - Lecciones con cuestionario: {con_cuestionario}")
        print(f"  - Lecciones sin cuestionario: {sin_cuestionario}")
        print(f"  - Total lecciones: {len(result.data)}")
        
        # Mostrar ejemplos de lecciones con cuestionarios
        result = supabase.table('lecciones').select('titulo, tiene_cuestionario').eq('tiene_cuestionario', True).limit(5).execute()
        
        if result.data:
            print("\n📝 Ejemplos de lecciones con cuestionarios:")
            for leccion in result.data:
                print(f"  - {leccion['titulo']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verificando: {e}")
        return False

def show_summary(lecciones_con_cuestionarios, lecciones):
    """
    Mostrar resumen detallado
    """
    print("\n" + "="*60)
    print("📋 RESUMEN DETALLADO")
    print("="*60)
    
    print("\n🎯 Lecciones con cuestionarios:")
    for leccion_id, cuestionarios in lecciones_con_cuestionarios.items():
        leccion = lecciones.get(leccion_id, {})
        print(f"\n📚 {leccion.get('titulo', 'Lección desconocida')}")
        for cuestionario in cuestionarios:
            print(f"  └── 📝 {cuestionario['titulo']}")
    
    print("\n" + "="*60)
    print("💡 PRÓXIMOS PASOS:")
    print("1. ✅ Flags tiene_cuestionario actualizados")
    print("2. 🔄 Aplicar migración SQL manualmente (ver migration_instructions.md)")
    print("3. 🧪 Verificar frontend después de la migración")
    print("="*60)

def main():
    print("🚀 Actualizando flags tiene_cuestionario...\n")
    
    # Obtener cliente de Supabase
    supabase = get_supabase_client()
    if not supabase:
        return
    
    # Obtener datos
    lecciones, lecciones_con_cuestionarios, lecciones_sin_cuestionarios = get_lecciones_with_cuestionarios(supabase)
    
    if not lecciones:
        print("❌ No se pudieron obtener las lecciones")
        return
    
    # Actualizar flags
    actualizaciones, errores = update_tiene_cuestionario_flags(
        supabase, lecciones, lecciones_con_cuestionarios, lecciones_sin_cuestionarios
    )
    
    # Verificar actualizaciones
    verify_updates(supabase)
    
    # Mostrar resumen
    show_summary(lecciones_con_cuestionarios, lecciones)
    
    print(f"\n🎉 Proceso completado:")
    print(f"  ✅ {actualizaciones} actualizaciones exitosas")
    print(f"  ❌ {errores} errores")

if __name__ == "__main__":
    main()