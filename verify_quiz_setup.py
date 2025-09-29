#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para verificar el estado completo del sistema de cuestionarios
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

def main():
    print("🔍 VERIFICACIÓN COMPLETA DEL SISTEMA DE CUESTIONARIOS")
    print("=" * 60)
    
    try:
        # 1. Verificar lecciones con cuestionarios
        print("\n1️⃣ LECCIONES CON CUESTIONARIOS:")
        print("-" * 40)
        
        response = supabase.table('lecciones').select('id, titulo, orden, tiene_cuestionario').eq('tiene_cuestionario', True).order('orden').execute()
        lecciones_con_quiz = response.data
        
        print(f"📚 Total de lecciones con cuestionarios: {len(lecciones_con_quiz)}")
        
        for leccion in lecciones_con_quiz:
            print(f"   {leccion['orden']:2d}. {leccion['titulo']} (ID: {leccion['id']})")
        
        # 2. Verificar cuestionarios en la base de datos
        print("\n2️⃣ CUESTIONARIOS EN LA BASE DE DATOS:")
        print("-" * 40)
        
        response = supabase.table('cuestionarios').select('id, titulo, leccion_id').order('titulo').execute()
        cuestionarios = response.data
        
        print(f"📝 Total de cuestionarios: {len(cuestionarios)}")
        
        cuestionarios_validos = []
        cuestionarios_sin_leccion = []
        
        for cuestionario in cuestionarios:
            if cuestionario['leccion_id'] and cuestionario['leccion_id'] != 'None':
                try:
                    # Buscar la lección asociada
                    leccion_response = supabase.table('lecciones').select('titulo, orden').eq('id', cuestionario['leccion_id']).single().execute()
                    leccion_info = leccion_response.data if leccion_response.data else None
                    
                    if leccion_info:
                        cuestionarios_validos.append({
                            'cuestionario': cuestionario,
                            'leccion': leccion_info
                        })
                        print(f"   ✅ {cuestionario['titulo']}")
                        print(f"      └─ Lección: {leccion_info['orden']}. {leccion_info['titulo']}")
                    else:
                        cuestionarios_sin_leccion.append(cuestionario)
                        print(f"   ⚠️ {cuestionario['titulo']} (Lección no encontrada: {cuestionario['leccion_id']})")
                except Exception as e:
                    cuestionarios_sin_leccion.append(cuestionario)
                    print(f"   ❌ {cuestionario['titulo']} (Error: {str(e)})")
            else:
                cuestionarios_sin_leccion.append(cuestionario)
                print(f"   ⚠️ {cuestionario['titulo']} (Sin lección asignada)")
        
        # 3. Verificar preguntas por cuestionario válido
        print("\n3️⃣ PREGUNTAS POR CUESTIONARIO:")
        print("-" * 40)
        
        total_preguntas = 0
        
        for item in cuestionarios_validos:
            cuestionario = item['cuestionario']
            leccion = item['leccion']
            
            response = supabase.table('preguntas').select('id, texto, tipo').eq('cuestionario_id', cuestionario['id']).execute()
            preguntas = response.data
            total_preguntas += len(preguntas)
            
            print(f"\n📋 {cuestionario['titulo']} ({len(preguntas)} preguntas):")
            print(f"    └─ Lección: {leccion['orden']}. {leccion['titulo']}")
            
            for i, pregunta in enumerate(preguntas, 1):
                # Contar opciones de respuesta
                opciones_response = supabase.table('opciones_respuesta').select('id').eq('pregunta_id', pregunta['id']).execute()
                num_opciones = len(opciones_response.data)
                
                texto_corto = pregunta['texto'][:50] + '...' if len(pregunta['texto']) > 50 else pregunta['texto']
                print(f"   {i:2d}. {texto_corto}")
                print(f"       └─ Tipo: {pregunta['tipo']}, Opciones: {num_opciones}")
        
        # 4. Mostrar cuestionarios problemáticos
        if cuestionarios_sin_leccion:
            print("\n⚠️ CUESTIONARIOS SIN LECCIÓN VÁLIDA:")
            print("-" * 40)
            for cuestionario in cuestionarios_sin_leccion:
                response = supabase.table('preguntas').select('id').eq('cuestionario_id', cuestionario['id']).execute()
                num_preguntas = len(response.data)
                print(f"   - {cuestionario['titulo']} ({num_preguntas} preguntas)")
                print(f"     └─ leccion_id: {cuestionario['leccion_id']}")
        
        # 5. Verificar integridad de datos
        print("\n4️⃣ VERIFICACIÓN DE INTEGRIDAD:")
        print("-" * 40)
        
        # Verificar que todas las lecciones con tiene_cuestionario=True tengan cuestionarios
        lecciones_sin_cuestionario = []
        for leccion in lecciones_con_quiz:
            cuestionario_existe = any(item['cuestionario']['leccion_id'] == leccion['id'] for item in cuestionarios_validos)
            if not cuestionario_existe:
                lecciones_sin_cuestionario.append(leccion)
        
        if lecciones_sin_cuestionario:
            print("⚠️ Lecciones marcadas con cuestionario pero sin cuestionarios válidos:")
            for leccion in lecciones_sin_cuestionario:
                print(f"   - {leccion['orden']}. {leccion['titulo']}")
        else:
            print("✅ Todas las lecciones marcadas tienen cuestionarios asociados")
        
        # 6. Resumen para el frontend
        print("\n5️⃣ RESUMEN PARA EL FRONTEND:")
        print("-" * 40)
        
        print(f"📊 Estadísticas:")
        print(f"   - Lecciones con cuestionarios: {len(lecciones_con_quiz)}")
        print(f"   - Cuestionarios válidos: {len(cuestionarios_validos)}")
        print(f"   - Cuestionarios problemáticos: {len(cuestionarios_sin_leccion)}")
        print(f"   - Total de preguntas: {total_preguntas}")
        
        print("\n🎯 URLs de prueba (puerto 5173):")
        for leccion in lecciones_con_quiz[:3]:  # Mostrar solo las primeras 3
            print(f"   http://localhost:5173/student/courses/1/lessons/{leccion['id']}")
        
        print("\n✅ VERIFICACIÓN COMPLETADA")
        
        # 7. Recomendaciones
        print("\n6️⃣ RECOMENDACIONES:")
        print("-" * 40)
        
        if cuestionarios_sin_leccion:
            print("🔧 Acciones recomendadas:")
            print("   1. Ejecutar migración SQL para agregar columna leccion_id")
            print("   2. Asignar lecciones a cuestionarios huérfanos")
            print("   3. Verificar que el frontend puede acceder a los cuestionarios")
        else:
            print("✅ El sistema está correctamente configurado")
            print("   - Todos los cuestionarios tienen lecciones asignadas")
            print("   - Las lecciones marcadas tienen cuestionarios")
            print("   - El frontend debería mostrar los cuestionarios correctamente")
        
    except Exception as e:
        print(f"❌ Error durante la verificación: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()