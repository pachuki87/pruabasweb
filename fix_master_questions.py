#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para corregir la asignación de preguntas al curso Master
"""

from supabase import create_client
import sys

# Configuración de Supabase
SUPABASE_URL = "https://ywvjqvnvvpxkbdzqtldi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dmpxdm52dnB4a2JkenF0bGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzAzNzI5NCwiZXhwIjoyMDM4NjEzMjk0fQ.VVOTgL_7hfgr2ixPjZYGnJbcj_9P7ixNJlBhZhQKKOE"

# ID del curso Master
MASTER_CURSO_ID = "b5ef8c64-fe26-4f20-8221-80a1bf475b05"

def fix_questions_assignment():
    """
    Corrige la asignación de preguntas al curso Master
    """
    try:
        # Inicializar cliente
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("🔧 CORRIGIENDO ASIGNACIÓN DE PREGUNTAS AL CURSO MASTER")
        print("=" * 65)
        
        # 1. Obtener todos los cuestionarios del curso Master
        print("📝 Obteniendo cuestionarios del curso Master...")
        cuestionarios_response = client.table('cuestionarios').select('id, titulo').eq('curso_id', MASTER_CURSO_ID).execute()
        cuestionarios = cuestionarios_response.data
        
        if not cuestionarios:
            print("❌ No se encontraron cuestionarios para el curso Master")
            return False
        
        print(f"✅ Encontrados {len(cuestionarios)} cuestionarios del Master")
        
        cuestionarios_ids = [c['id'] for c in cuestionarios]
        
        # 2. Encontrar preguntas de estos cuestionarios que no tienen curso_id asignado
        print("\n🔍 Buscando preguntas sin curso_id asignado...")
        
        preguntas_a_corregir = []
        
        for cuestionario_id in cuestionarios_ids:
            # Buscar preguntas de este cuestionario sin curso_id
            preguntas_response = client.table('preguntas').select('id, texto, cuestionario_id').eq('cuestionario_id', cuestionario_id).is_('curso_id', 'null').execute()
            
            for pregunta in preguntas_response.data:
                preguntas_a_corregir.append({
                    'id': pregunta['id'],
                    'texto': pregunta['texto'][:50] + '...',
                    'cuestionario_id': pregunta['cuestionario_id']
                })
        
        print(f"📊 Encontradas {len(preguntas_a_corregir)} preguntas a corregir")
        
        if not preguntas_a_corregir:
            print("✅ No hay preguntas que corregir. Todas están correctamente asignadas.")
            return True
        
        # 3. Mostrar resumen antes de corregir
        print("\n📋 RESUMEN DE PREGUNTAS A CORREGIR:")
        for i, pregunta in enumerate(preguntas_a_corregir[:10], 1):
            print(f"  {i}. ID: {pregunta['id']} - {pregunta['texto']}")
        
        if len(preguntas_a_corregir) > 10:
            print(f"  ... y {len(preguntas_a_corregir) - 10} preguntas más")
        
        # 4. Confirmar antes de proceder
        print(f"\n⚠️  Se van a actualizar {len(preguntas_a_corregir)} preguntas")
        print(f"   Curso ID a asignar: {MASTER_CURSO_ID}")
        
        respuesta = input("\n¿Continuar con la corrección? (s/N): ").strip().lower()
        if respuesta not in ['s', 'si', 'sí', 'y', 'yes']:
            print("❌ Operación cancelada por el usuario")
            return False
        
        # 5. Actualizar preguntas
        print("\n🔄 Actualizando preguntas...")
        
        actualizadas = 0
        errores = 0
        
        for pregunta in preguntas_a_corregir:
            try:
                # Actualizar la pregunta con el curso_id del Master
                update_response = client.table('preguntas').update({
                    'curso_id': MASTER_CURSO_ID
                }).eq('id', pregunta['id']).execute()
                
                if update_response.data:
                    actualizadas += 1
                    if actualizadas % 10 == 0:
                        print(f"   Actualizadas: {actualizadas}/{len(preguntas_a_corregir)}")
                else:
                    errores += 1
                    print(f"   ❌ Error actualizando pregunta {pregunta['id']}")
                    
            except Exception as e:
                errores += 1
                print(f"   ❌ Error actualizando pregunta {pregunta['id']}: {e}")
        
        # 6. Resumen final
        print("\n" + "=" * 65)
        print("📊 RESUMEN FINAL:")
        print(f"✅ Preguntas actualizadas correctamente: {actualizadas}")
        print(f"❌ Errores durante la actualización: {errores}")
        print(f"📝 Total procesadas: {len(preguntas_a_corregir)}")
        
        if errores == 0:
            print("\n🎉 ¡Todas las preguntas fueron corregidas exitosamente!")
            return True
        else:
            print(f"\n⚠️  Se completó con {errores} errores")
            return False
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_assignment():
    """
    Verifica que las preguntas estén correctamente asignadas
    """
    try:
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("\n🔍 VERIFICANDO ASIGNACIÓN DESPUÉS DE LA CORRECCIÓN")
        print("=" * 55)
        
        # Obtener cuestionarios del Master
        cuestionarios_response = client.table('cuestionarios').select('id').eq('curso_id', MASTER_CURSO_ID).execute()
        cuestionarios_ids = [c['id'] for c in cuestionarios_response.data]
        
        # Verificar preguntas sin curso_id
        preguntas_sin_curso = []
        for cuestionario_id in cuestionarios_ids:
            preguntas_response = client.table('preguntas').select('id').eq('cuestionario_id', cuestionario_id).is_('curso_id', 'null').execute()
            preguntas_sin_curso.extend(preguntas_response.data)
        
        if not preguntas_sin_curso:
            print("✅ Todas las preguntas están correctamente asignadas al curso Master")
        else:
            print(f"❌ Aún quedan {len(preguntas_sin_curso)} preguntas sin asignar")
        
        return len(preguntas_sin_curso) == 0
        
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return False

def main():
    print("🚀 SCRIPT DE CORRECCIÓN DE PREGUNTAS DEL CURSO MASTER")
    print("=" * 60)
    print(f"Curso Master ID: {MASTER_CURSO_ID}")
    print("=" * 60)
    
    # Ejecutar corrección
    if fix_questions_assignment():
        # Verificar resultado
        verify_assignment()
    else:
        print("\n❌ La corrección no se completó exitosamente")
        sys.exit(1)

if __name__ == "__main__":
    main()