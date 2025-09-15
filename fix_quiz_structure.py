#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para corregir la estructura de las tablas de cuestionarios
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

def analyze_current_state():
    """Analizar el estado actual de las tablas"""
    print("🔍 ANÁLISIS DEL ESTADO ACTUAL")
    print("=" * 50)
    
    # Verificar cuestionarios
    cuestionarios = supabase.table('cuestionarios').select('*').execute().data
    print(f"📋 Cuestionarios encontrados: {len(cuestionarios)}")
    
    cuestionarios_con_leccion = [c for c in cuestionarios if c.get('leccion_id')]
    cuestionarios_sin_leccion = [c for c in cuestionarios if not c.get('leccion_id')]
    
    print(f"   ✅ Con lección asignada: {len(cuestionarios_con_leccion)}")
    print(f"   ⚠️ Sin lección asignada: {len(cuestionarios_sin_leccion)}")
    
    # Verificar preguntas
    preguntas = supabase.table('preguntas').select('*').execute().data
    print(f"❓ Preguntas encontradas: {len(preguntas)}")
    
    # Verificar lecciones con cuestionarios
    lecciones_con_quiz = supabase.table('lecciones').select('*').eq('tiene_cuestionario', True).execute().data
    print(f"📚 Lecciones marcadas con cuestionario: {len(lecciones_con_quiz)}")
    
    return cuestionarios_sin_leccion, lecciones_con_quiz

def assign_quizzes_to_lessons(cuestionarios_sin_leccion, lecciones_con_quiz):
    """Asignar cuestionarios a lecciones basándose en títulos similares"""
    print("\n🔧 ASIGNANDO CUESTIONARIOS A LECCIONES")
    print("=" * 50)
    
    # Mapeo manual basado en los títulos que vimos
    mapeo_cuestionarios = {
        'Conceptos básicos de adicción': '¿Qué es una adicción 1 Cuestionario',
        'Definición conducta adictiva': '¿Qué es una adicción 1 Cuestionario',
        'Cuestionario 2: Técnicas de Intervención Cognitiva': 'TERAPIA COGNITIVA DROGODEPENDENENCIAS'
    }
    
    actualizaciones = 0
    
    for cuestionario in cuestionarios_sin_leccion:
        titulo_cuestionario = cuestionario['titulo']
        
        # Buscar lección correspondiente
        leccion_objetivo = None
        
        if titulo_cuestionario in mapeo_cuestionarios:
            titulo_leccion_buscado = mapeo_cuestionarios[titulo_cuestionario]
            
            for leccion in lecciones_con_quiz:
                if titulo_leccion_buscado.lower() in leccion['titulo'].lower():
                    leccion_objetivo = leccion
                    break
        
        if leccion_objetivo:
            try:
                # Actualizar el cuestionario con la lección
                supabase.table('cuestionarios').update({
                    'leccion_id': leccion_objetivo['id']
                }).eq('id', cuestionario['id']).execute()
                
                print(f"✅ Asignado: '{titulo_cuestionario}' → '{leccion_objetivo['titulo']}'")
                actualizaciones += 1
                
            except Exception as e:
                print(f"❌ Error asignando '{titulo_cuestionario}': {e}")
        else:
            print(f"⚠️ No se encontró lección para: '{titulo_cuestionario}'")
    
    print(f"\n📊 Total de asignaciones realizadas: {actualizaciones}")
    return actualizaciones

def update_lesson_flags():
    """Actualizar flags tiene_cuestionario en lecciones"""
    print("\n🚩 ACTUALIZANDO FLAGS DE LECCIONES")
    print("=" * 50)
    
    # Obtener todas las lecciones
    lecciones = supabase.table('lecciones').select('*').execute().data
    
    # Obtener cuestionarios con lección asignada
    cuestionarios = supabase.table('cuestionarios').select('leccion_id').execute().data
    lecciones_con_cuestionario = set(c['leccion_id'] for c in cuestionarios if c.get('leccion_id'))
    
    actualizaciones = 0
    
    for leccion in lecciones:
        tiene_cuestionario_actual = leccion.get('tiene_cuestionario', False)
        deberia_tener_cuestionario = leccion['id'] in lecciones_con_cuestionario
        
        if tiene_cuestionario_actual != deberia_tener_cuestionario:
            try:
                supabase.table('lecciones').update({
                    'tiene_cuestionario': deberia_tener_cuestionario
                }).eq('id', leccion['id']).execute()
                
                estado = "✅" if deberia_tener_cuestionario else "❌"
                print(f"{estado} Actualizado: '{leccion['titulo']}' → tiene_cuestionario: {deberia_tener_cuestionario}")
                actualizaciones += 1
                
            except Exception as e:
                print(f"❌ Error actualizando '{leccion['titulo']}': {e}")
    
    print(f"\n📊 Total de flags actualizados: {actualizaciones}")
    return actualizaciones

def verify_frontend_compatibility():
    """Verificar que el frontend pueda acceder a los cuestionarios"""
    print("\n🌐 VERIFICACIÓN DE COMPATIBILIDAD CON FRONTEND")
    print("=" * 50)
    
    # Simular la consulta que hace el frontend
    try:
        # Obtener lecciones con cuestionarios
        lecciones_response = supabase.table('lecciones').select('id, titulo, orden, tiene_cuestionario').eq('tiene_cuestionario', True).order('orden').execute()
        lecciones_con_quiz = lecciones_response.data
        
        print(f"📚 Lecciones con cuestionarios disponibles para el frontend: {len(lecciones_con_quiz)}")
        
        for leccion in lecciones_con_quiz:
            # Buscar cuestionarios de esta lección
            cuestionarios_response = supabase.table('cuestionarios').select('id, titulo').eq('leccion_id', leccion['id']).execute()
            cuestionarios = cuestionarios_response.data
            
            if cuestionarios:
                print(f"   ✅ {leccion['orden']:2d}. {leccion['titulo']} ({len(cuestionarios)} cuestionarios)")
                
                for cuestionario in cuestionarios:
                    # Verificar preguntas
                    preguntas_response = supabase.table('preguntas').select('id, pregunta, tipo').eq('cuestionario_id', cuestionario['id']).execute()
                    preguntas = preguntas_response.data
                    
                    print(f"      └─ {cuestionario['titulo']} ({len(preguntas)} preguntas)")
            else:
                print(f"   ⚠️ {leccion['orden']:2d}. {leccion['titulo']} (sin cuestionarios)")
        
        print("\n🎯 URLs de prueba (puerto 5173):")
        for leccion in lecciones_con_quiz[:3]:
            print(f"   http://localhost:5173/student/courses/1/lessons/{leccion['id']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en verificación del frontend: {e}")
        return False

def main():
    print("🔧 CORRECCIÓN DE ESTRUCTURA DE CUESTIONARIOS")
    print("=" * 60)
    
    try:
        # 1. Analizar estado actual
        cuestionarios_sin_leccion, lecciones_con_quiz = analyze_current_state()
        
        # 2. Asignar cuestionarios a lecciones
        if cuestionarios_sin_leccion:
            asignaciones = assign_quizzes_to_lessons(cuestionarios_sin_leccion, lecciones_con_quiz)
        else:
            print("\n✅ Todos los cuestionarios ya tienen lección asignada")
            asignaciones = 0
        
        # 3. Actualizar flags de lecciones
        flags_actualizados = update_lesson_flags()
        
        # 4. Verificar compatibilidad con frontend
        frontend_ok = verify_frontend_compatibility()
        
        # 5. Resumen final
        print("\n" + "=" * 60)
        print("📊 RESUMEN DE CORRECCIONES:")
        print(f"   - Cuestionarios asignados a lecciones: {asignaciones}")
        print(f"   - Flags de lecciones actualizados: {flags_actualizados}")
        print(f"   - Frontend compatible: {'✅ Sí' if frontend_ok else '❌ No'}")
        
        if asignaciones > 0 or flags_actualizados > 0:
            print("\n🎉 ¡Correcciones aplicadas exitosamente!")
            print("   Los cuestionarios deberían aparecer ahora en el frontend.")
        else:
            print("\n✅ No se necesitaron correcciones.")
        
    except Exception as e:
        print(f"❌ Error durante la corrección: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()