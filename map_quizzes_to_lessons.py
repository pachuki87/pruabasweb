#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para mapear cuestionarios con lecciones del curso 'Experto en Conductas Adictivas'
basándose en los nombres y actualizar la base de datos.
"""

import os
import sys
import time
from supabase import create_client, Client
import re
from difflib import SequenceMatcher
from typing import List, Dict, Optional

# Configuración de Supabase
SUPABASE_URL = "https://ywvjqvnvvpxkbdzqtldi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dmpxdm52dnB4a2JkenF0bGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzAzNzI5NCwiZXhwIjoyMDM4NjEzMjk0fQ.VVOTgL_7hfgr2ixPjZYGnJbcj_9P7ixNJlBhZhQKKOE"

# ID del curso
CURSO_ID = "d7c3e503-ed61-4d7a-9e5f-aedc407d4836"

def init_supabase() -> Optional[Client]:
    """Inicializar cliente de Supabase con manejo de errores"""
    try:
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        # Test de conexión
        test_response = client.table('cursos').select('id').limit(1).execute()
        print("✅ Conexión a Supabase establecida")
        return client
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {e}")
        print("💡 Verificando conectividad...")
        return None

def clean_title(title: str) -> str:
    """Limpiar título para comparación"""
    # Remover números, cuestionarios, espacios extra
    cleaned = re.sub(r'\d+\s*cuestionarios?', '', title, flags=re.IGNORECASE)
    cleaned = re.sub(r'^\d+\.?\s*', '', cleaned)  # Remover números al inicio
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()  # Normalizar espacios
    return cleaned.lower()

def similarity(a: str, b: str) -> float:
    """Calcular similitud entre dos strings"""
    return SequenceMatcher(None, a, b).ratio()

def get_lessons_and_quizzes(supabase: Client) -> tuple:
    """Obtener lecciones y cuestionarios del curso"""
    try:
        print("📚 Obteniendo lecciones del curso...")
        
        # Obtener lecciones
        lessons_response = supabase.table('lecciones').select('*').eq('curso_id', CURSO_ID).order('orden').execute()
        lessons = lessons_response.data
        
        print(f"✅ Encontradas {len(lessons)} lecciones")
        
        # Obtener cuestionarios sin lección asignada
        quizzes_response = supabase.table('cuestionarios').select('*').eq('curso_id', CURSO_ID).is_('leccion_id', 'null').execute()
        quizzes = quizzes_response.data
        
        print(f"✅ Encontrados {len(quizzes)} cuestionarios sin asignar")
        
        return lessons, quizzes
        
    except Exception as e:
        print(f"❌ Error obteniendo datos: {e}")
        return [], []

def map_quizzes_to_lessons(lessons: List[Dict], quizzes: List[Dict]) -> List[Dict]:
    """Mapear cuestionarios a lecciones basándose en similitud de nombres"""
    mappings = []
    
    print("\n🔍 Mapeando cuestionarios con lecciones...")
    
    for quiz in quizzes:
        quiz_title_clean = clean_title(quiz['titulo'])
        best_match = None
        best_similarity = 0.0
        
        for lesson in lessons:
            lesson_title_clean = clean_title(lesson['titulo'])
            sim = similarity(quiz_title_clean, lesson_title_clean)
            
            if sim > best_similarity:
                best_similarity = sim
                best_match = lesson
        
        if best_match and best_similarity > 0.3:  # Umbral de similitud
            mappings.append({
                'quiz_id': quiz['id'],
                'quiz_title': quiz['titulo'],
                'lesson_id': best_match['id'],
                'lesson_title': best_match['titulo'],
                'similarity': best_similarity
            })
            print(f"  📝 {quiz['titulo'][:50]}... → {best_match['titulo'][:50]}... ({best_similarity:.2f})")
        else:
            print(f"  ❓ Sin coincidencia para: {quiz['titulo'][:50]}...")
    
    return mappings

def update_quiz_assignments(supabase: Client, mappings: List[Dict]) -> bool:
    """Actualizar asignaciones de cuestionarios en la base de datos"""
    try:
        print(f"\n💾 Actualizando {len(mappings)} asignaciones...")
        
        for mapping in mappings:
            response = supabase.table('cuestionarios').update({
                'leccion_id': mapping['lesson_id']
            }).eq('id', mapping['quiz_id']).execute()
            
            if response.data:
                print(f"  ✅ Actualizado: {mapping['quiz_title'][:30]}...")
            else:
                print(f"  ❌ Error actualizando: {mapping['quiz_title'][:30]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error actualizando asignaciones: {e}")
        return False

def show_summary(supabase: Client):
    """Mostrar resumen final"""
    try:
        print("\n📊 RESUMEN FINAL:")
        
        # Cuestionarios asignados
        assigned_response = supabase.table('cuestionarios').select('*').eq('curso_id', CURSO_ID).not_.is_('leccion_id', 'null').execute()
        assigned_count = len(assigned_response.data)
        
        # Cuestionarios sin asignar
        unassigned_response = supabase.table('cuestionarios').select('*').eq('curso_id', CURSO_ID).is_('leccion_id', 'null').execute()
        unassigned_count = len(unassigned_response.data)
        
        print(f"  ✅ Cuestionarios asignados: {assigned_count}")
        print(f"  ❓ Cuestionarios sin asignar: {unassigned_count}")
        
        if unassigned_count > 0:
            print("\n📋 Cuestionarios sin asignar:")
            for quiz in unassigned_response.data:
                print(f"  - {quiz['titulo']}")
        
    except Exception as e:
        print(f"❌ Error generando resumen: {e}")

def main():
    """Función principal"""
    print("🚀 Iniciando mapeo de cuestionarios a lecciones...")
    
    # Inicializar Supabase
    supabase = init_supabase()
    if not supabase:
        print("❌ No se pudo conectar a Supabase. Verifica tu conexión a internet.")
        sys.exit(1)
    
    # Obtener datos
    lessons, quizzes = get_lessons_and_quizzes(supabase)
    
    if not lessons:
        print("❌ No se encontraron lecciones")
        sys.exit(1)
    
    if not quizzes:
        print("ℹ️ No hay cuestionarios sin asignar")
        show_summary(supabase)
        sys.exit(0)
    
    # Mapear cuestionarios
    mappings = map_quizzes_to_lessons(lessons, quizzes)
    
    if not mappings:
        print("❌ No se encontraron coincidencias")
        sys.exit(1)
    
    # Confirmar actualización
    print(f"\n❓ ¿Deseas actualizar {len(mappings)} asignaciones? (s/N): ", end="")
    confirm = input().strip().lower()
    
    if confirm in ['s', 'si', 'sí', 'y', 'yes']:
        success = update_quiz_assignments(supabase, mappings)
        if success:
            print("\n🎉 ¡Mapeo completado exitosamente!")
        else:
            print("\n❌ Hubo errores durante la actualización")
    else:
        print("\n❌ Operación cancelada")
    
    # Mostrar resumen
    show_summary(supabase)

if __name__ == "__main__":
    main()