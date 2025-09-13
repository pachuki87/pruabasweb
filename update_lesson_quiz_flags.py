#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar el campo 'tiene_cuestionario' en las lecciones
que tienen cuestionarios asignados
"""

from supabase import create_client
import sys

# Configuración de Supabase
SUPABASE_URL = "https://ywvjqvnvvpxkbdzqtldi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dmpxdm52dnB4a2JkenF0bGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzAzNzI5NCwiZXhwIjoyMDM4NjEzMjk0fQ.VVOTgL_7hfgr2ixPjZYGnJbcj_9P7ixNJlBhZhQKKOE"

# ID del curso Master
MASTER_CURSO_ID = "b5ef8c64-fe26-4f20-8221-80a1bf475b05"

def update_lesson_quiz_flags():
    """
    Actualiza el campo tiene_cuestionario en las lecciones
    """
    try:
        # Inicializar cliente
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("🔄 ACTUALIZANDO FLAGS DE CUESTIONARIOS EN LECCIONES")
        print("=" * 60)
        
        # 1. Obtener todas las lecciones del curso Master
        print("📚 Obteniendo lecciones del curso Master...")
        lecciones_response = client.table('lecciones').select('id, titulo, tiene_cuestionario').eq('curso_id', MASTER_CURSO_ID).execute()
        lecciones = lecciones_response.data
        
        if not lecciones:
            print("❌ No se encontraron lecciones para el curso Master")
            return False
        
        print(f"✅ Encontradas {len(lecciones)} lecciones del Master")
        
        # 2. Obtener cuestionarios y sus lecciones asignadas
        print("\n📝 Obteniendo cuestionarios asignados a lecciones...")
        cuestionarios_response = client.table('cuestionarios').select('leccion_id').eq('curso_id', MASTER_CURSO_ID).is_('leccion_id', 'not.null').execute()
        
        lecciones_con_cuestionario = set()
        for cuestionario in cuestionarios_response.data:
            if cuestionario['leccion_id']:
                lecciones_con_cuestionario.add(cuestionario['leccion_id'])
        
        print(f"✅ Encontradas {len(lecciones_con_cuestionario)} lecciones con cuestionarios asignados")
        
        # 3. Analizar estado actual
        lecciones_a_actualizar = []
        lecciones_a_desmarcar = []
        
        for leccion in lecciones:
            leccion_id = leccion['id']
            tiene_cuestionario_actual = leccion.get('tiene_cuestionario', False)
            deberia_tener_cuestionario = leccion_id in lecciones_con_cuestionario
            
            if deberia_tener_cuestionario and not tiene_cuestionario_actual:
                # Lección tiene cuestionario pero no está marcada
                lecciones_a_actualizar.append({
                    'id': leccion_id,
                    'titulo': leccion['titulo'],
                    'accion': 'marcar_con_cuestionario'
                })
            elif not deberia_tener_cuestionario and tiene_cuestionario_actual:
                # Lección no tiene cuestionario pero está marcada
                lecciones_a_desmarcar.append({
                    'id': leccion_id,
                    'titulo': leccion['titulo'],
                    'accion': 'desmarcar_cuestionario'
                })
        
        # 4. Mostrar resumen
        print("\n📊 ANÁLISIS DE LECCIONES:")
        print(f"  Lecciones a marcar con cuestionario: {len(lecciones_a_actualizar)}")
        print(f"  Lecciones a desmarcar cuestionario: {len(lecciones_a_desmarcar)}")
        
        if lecciones_a_actualizar:
            print("\n✅ Lecciones que se marcarán con cuestionario:")
            for i, leccion in enumerate(lecciones_a_actualizar[:10], 1):
                print(f"  {i}. {leccion['titulo']}")
            if len(lecciones_a_actualizar) > 10:
                print(f"  ... y {len(lecciones_a_actualizar) - 10} más")
        
        if lecciones_a_desmarcar:
            print("\n❌ Lecciones que se desmarcarán (no tienen cuestionario):")
            for i, leccion in enumerate(lecciones_a_desmarcar[:10], 1):
                print(f"  {i}. {leccion['titulo']}")
            if len(lecciones_a_desmarcar) > 10:
                print(f"  ... y {len(lecciones_a_desmarcar) - 10} más")
        
        total_cambios = len(lecciones_a_actualizar) + len(lecciones_a_desmarcar)
        
        if total_cambios == 0:
            print("\n✅ Todas las lecciones ya tienen el flag correcto. No hay cambios necesarios.")
            return True
        
        # 5. Confirmar antes de proceder
        print(f"\n⚠️  Se van a actualizar {total_cambios} lecciones")
        respuesta = input("\n¿Continuar con la actualización? (s/N): ").strip().lower()
        if respuesta not in ['s', 'si', 'sí', 'y', 'yes']:
            print("❌ Operación cancelada por el usuario")
            return False
        
        # 6. Actualizar lecciones
        print("\n🔄 Actualizando lecciones...")
        
        actualizadas = 0
        errores = 0
        
        # Marcar lecciones con cuestionario
        for leccion in lecciones_a_actualizar:
            try:
                update_response = client.table('lecciones').update({
                    'tiene_cuestionario': True
                }).eq('id', leccion['id']).execute()
                
                if update_response.data:
                    actualizadas += 1
                    print(f"  ✅ Marcada: {leccion['titulo']}")
                else:
                    errores += 1
                    print(f"  ❌ Error marcando: {leccion['titulo']}")
                    
            except Exception as e:
                errores += 1
                print(f"  ❌ Error marcando {leccion['titulo']}: {e}")
        
        # Desmarcar lecciones sin cuestionario
        for leccion in lecciones_a_desmarcar:
            try:
                update_response = client.table('lecciones').update({
                    'tiene_cuestionario': False
                }).eq('id', leccion['id']).execute()
                
                if update_response.data:
                    actualizadas += 1
                    print(f"  ✅ Desmarcada: {leccion['titulo']}")
                else:
                    errores += 1
                    print(f"  ❌ Error desmarcando: {leccion['titulo']}")
                    
            except Exception as e:
                errores += 1
                print(f"  ❌ Error desmarcando {leccion['titulo']}: {e}")
        
        # 7. Resumen final
        print("\n" + "=" * 60)
        print("📊 RESUMEN FINAL:")
        print(f"✅ Lecciones actualizadas correctamente: {actualizadas}")
        print(f"❌ Errores durante la actualización: {errores}")
        print(f"📝 Total procesadas: {total_cambios}")
        
        if errores == 0:
            print("\n🎉 ¡Todas las lecciones fueron actualizadas exitosamente!")
            return True
        else:
            print(f"\n⚠️  Se completó con {errores} errores")
            return False
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_lesson_flags():
    """
    Verifica que los flags estén correctamente asignados
    """
    try:
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("\n🔍 VERIFICANDO FLAGS DESPUÉS DE LA ACTUALIZACIÓN")
        print("=" * 55)
        
        # Obtener lecciones con cuestionarios
        cuestionarios_response = client.table('cuestionarios').select('leccion_id').eq('curso_id', MASTER_CURSO_ID).is_('leccion_id', 'not.null').execute()
        lecciones_con_cuestionario = set(c['leccion_id'] for c in cuestionarios_response.data if c['leccion_id'])
        
        # Obtener lecciones marcadas como con cuestionario
        lecciones_response = client.table('lecciones').select('id, titulo, tiene_cuestionario').eq('curso_id', MASTER_CURSO_ID).eq('tiene_cuestionario', True).execute()
        lecciones_marcadas = set(l['id'] for l in lecciones_response.data)
        
        # Comparar
        correctas = lecciones_con_cuestionario.intersection(lecciones_marcadas)
        faltantes = lecciones_con_cuestionario - lecciones_marcadas
        sobrantes = lecciones_marcadas - lecciones_con_cuestionario
        
        print(f"✅ Lecciones correctamente marcadas: {len(correctas)}")
        print(f"❌ Lecciones con cuestionario no marcadas: {len(faltantes)}")
        print(f"⚠️  Lecciones marcadas sin cuestionario: {len(sobrantes)}")
        
        return len(faltantes) == 0 and len(sobrantes) == 0
        
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return False

def main():
    print("🚀 SCRIPT DE ACTUALIZACIÓN DE FLAGS DE CUESTIONARIOS")
    print("=" * 60)
    print(f"Curso Master ID: {MASTER_CURSO_ID}")
    print("=" * 60)
    
    # Ejecutar actualización
    if update_lesson_quiz_flags():
        # Verificar resultado
        verify_lesson_flags()
    else:
        print("\n❌ La actualización no se completó exitosamente")
        sys.exit(1)

if __name__ == "__main__":
    main()