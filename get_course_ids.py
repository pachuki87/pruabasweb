#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para obtener los IDs correctos de los cursos
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_SERVICE_KEY")

if not url or not key:
    print("❌ Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY requeridas")
    exit(1)

supabase: Client = create_client(url, key)

def get_course_info():
    """Obtener información de los cursos"""
    print("📚 INFORMACIÓN DE CURSOS")
    print("=" * 50)
    
    try:
        # Obtener todos los cursos
        cursos = supabase.table('cursos').select('id, titulo, descripcion').execute().data
        
        print(f"Total de cursos: {len(cursos)}")
        print()
        
        for i, curso in enumerate(cursos, 1):
            print(f"{i}. {curso['titulo']}")
            print(f"   ID: {curso['id']}")
            print(f"   Descripción: {curso['descripcion'][:100]}..." if len(curso['descripcion']) > 100 else f"   Descripción: {curso['descripcion']}")
            
            # Contar lecciones del curso
            lecciones = supabase.table('lecciones').select('id, titulo, tiene_cuestionario').eq('curso_id', curso['id']).execute().data
            lecciones_con_quiz = [l for l in lecciones if l.get('tiene_cuestionario')]
            
            print(f"   Lecciones: {len(lecciones)} (con cuestionarios: {len(lecciones_con_quiz)})")
            print()
        
        # Generar URLs correctas
        print("🔗 URLS CORRECTAS PARA PRUEBAS:")
        print("=" * 50)
        
        for curso in cursos:
            if 'adiccion' in curso['titulo'].lower():
                # Obtener lecciones con cuestionarios
                lecciones = supabase.table('lecciones').select('id, titulo, orden').eq('curso_id', curso['id']).eq('tiene_cuestionario', True).order('orden').execute().data
                
                print(f"\n📖 {curso['titulo']} (ID: {curso['id']})")
                for leccion in lecciones[:3]:  # Mostrar solo las primeras 3
                    print(f"   http://localhost:5173/student/courses/{curso['id']}/lessons/{leccion['id']}")
                    print(f"   └─ {leccion['titulo']}")
        
        return cursos
        
    except Exception as e:
        print(f"❌ Error obteniendo información de cursos: {e}")
        import traceback
        traceback.print_exc()
        return []

def main():
    print("🔍 OBTENER IDS CORRECTOS DE CURSOS")
    print("=" * 60)
    
    cursos = get_course_info()
    
    if cursos:
        print("\n✅ Información obtenida exitosamente")
        print("   Usa los IDs UUID correctos en las URLs del frontend")
    else:
        print("\n❌ No se pudo obtener información de cursos")

if __name__ == "__main__":
    main()