#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para verificar el estado de preguntas y cuestionarios del curso Master
"""

from supabase import create_client

# Configuración de Supabase
SUPABASE_URL = "https://ywvjqvnvvpxkbdzqtldi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dmpxdm52dnB4a2JkenF0bGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzAzNzI5NCwiZXhwIjoyMDM4NjEzMjk0fQ.VVOTgL_7hfgr2ixPjZYGnJbcj_9P7ixNJlBhZhQKKOE"

# ID del curso Master
MASTER_CURSO_ID = "b5ef8c64-fe26-4f20-8221-80a1bf475b05"

def main():
    try:
        # Inicializar cliente
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("🔍 VERIFICANDO ESTADO DE PREGUNTAS Y CUESTIONARIOS")
        print("=" * 60)
        
        # Verificar curso Master
        print(f"📚 Curso Master ID: {MASTER_CURSO_ID}")
        curso_response = client.table('cursos').select('*').eq('id', MASTER_CURSO_ID).execute()
        if curso_response.data:
            curso = curso_response.data[0]
            print(f"✅ Curso encontrado: {curso['titulo']}")
        else:
            print("❌ Curso Master no encontrado")
            return
        
        print("\n" + "=" * 60)
        
        # Verificar cuestionarios del Master
        print("📝 CUESTIONARIOS DEL MASTER:")
        cuestionarios_response = client.table('cuestionarios').select('*').eq('curso_id', MASTER_CURSO_ID).execute()
        cuestionarios = cuestionarios_response.data
        
        print(f"Total cuestionarios: {len(cuestionarios)}")
        for i, cuestionario in enumerate(cuestionarios, 1):
            leccion_info = "Sin lección" if not cuestionario.get('leccion_id') else f"Lección: {cuestionario['leccion_id']}"
            print(f"  {i}. {cuestionario['titulo']} - {leccion_info}")
        
        print("\n" + "=" * 60)
        
        # Verificar preguntas del Master
        print("❓ PREGUNTAS DEL MASTER:")
        preguntas_response = client.table('preguntas').select('*').eq('curso_id', MASTER_CURSO_ID).execute()
        preguntas_master = preguntas_response.data
        
        print(f"Total preguntas del Master: {len(preguntas_master)}")
        
        # Verificar preguntas sin curso asignado
        print("\n❓ PREGUNTAS SIN CURSO ASIGNADO:")
        preguntas_sin_curso_response = client.table('preguntas').select('*').is_('curso_id', 'null').execute()
        preguntas_sin_curso = preguntas_sin_curso_response.data
        
        print(f"Total preguntas sin curso: {len(preguntas_sin_curso)}")
        
        if preguntas_sin_curso:
            print("\nPrimeras 10 preguntas sin curso:")
            for i, pregunta in enumerate(preguntas_sin_curso[:10], 1):
                cuestionario_info = f"Cuestionario: {pregunta['cuestionario_id']}" if pregunta.get('cuestionario_id') else "Sin cuestionario"
                print(f"  {i}. {pregunta['texto'][:50]}... - {cuestionario_info}")
        
        print("\n" + "=" * 60)
        
        # Verificar si hay preguntas de cuestionarios del Master que no tienen curso_id
        print("🔍 PREGUNTAS DE CUESTIONARIOS DEL MASTER SIN CURSO_ID:")
        
        cuestionarios_ids = [c['id'] for c in cuestionarios]
        preguntas_problematicas = []
        
        for cuestionario_id in cuestionarios_ids:
            preguntas_cuestionario = client.table('preguntas').select('*').eq('cuestionario_id', cuestionario_id).execute()
            for pregunta in preguntas_cuestionario.data:
                if not pregunta.get('curso_id'):
                    preguntas_problematicas.append({
                        'pregunta_id': pregunta['id'],
                        'texto': pregunta['texto'],
                        'cuestionario_id': cuestionario_id
                    })
        
        print(f"Preguntas problemáticas encontradas: {len(preguntas_problematicas)}")
        
        if preguntas_problematicas:
            print("\nDetalles de preguntas problemáticas:")
            for i, pregunta in enumerate(preguntas_problematicas[:5], 1):
                print(f"  {i}. ID: {pregunta['pregunta_id']} - Cuestionario: {pregunta['cuestionario_id']}")
                print(f"     Texto: {pregunta['texto'][:80]}...")
        
        print("\n" + "=" * 60)
        print("✅ Verificación completada")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()