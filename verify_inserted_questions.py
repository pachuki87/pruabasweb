import json
from supabase import create_client, Client

# Configuración de Supabase
SUPABASE_URL = "https://lyojcqiiixkqqtpoejdo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM"

# ID del curso "Experto en Conductas Adictivas"
CURSO_ID = "d7c3e503-ed61-4d7a-9e5f-aedc407d4836"

def init_supabase():
    """Inicializa el cliente de Supabase"""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print(f"Error conectando a Supabase: {e}")
        return None

def verify_cuestionarios(supabase):
    """Verifica los cuestionarios creados"""
    try:
        result = supabase.table('cuestionarios').select('*').eq('curso_id', CURSO_ID).execute()
        
        if result.data:
            print(f"\n📋 CUESTIONARIOS ENCONTRADOS: {len(result.data)}")
            print("=" * 50)
            
            for cuestionario in result.data:
                print(f"📚 {cuestionario['titulo']}")
                print(f"   ID: {cuestionario['id']}")
                print(f"   Creado: {cuestionario.get('creado_en', 'N/A')}")
                print()
            
            return result.data
        else:
            print("❌ No se encontraron cuestionarios")
            return []
            
    except Exception as e:
        print(f"❌ Error verificando cuestionarios: {e}")
        return []

def verify_preguntas(supabase, cuestionarios):
    """Verifica las preguntas de cada cuestionario"""
    total_preguntas = 0
    total_texto_libre = 0
    total_multiple_choice = 0
    
    print("\n❓ PREGUNTAS POR CUESTIONARIO")
    print("=" * 50)
    
    for cuestionario in cuestionarios:
        try:
            result = supabase.table('preguntas').select('*').eq('cuestionario_id', cuestionario['id']).execute()
            
            if result.data:
                preguntas = result.data
                texto_libre = len([p for p in preguntas if p['tipo'] == 'texto_libre'])
                multiple_choice = len([p for p in preguntas if p['tipo'] == 'multiple_choice'])
                
                print(f"📚 {cuestionario['titulo']}")
                print(f"   Total preguntas: {len(preguntas)}")
                print(f"   - Texto libre: {texto_libre}")
                print(f"   - Opción múltiple: {multiple_choice}")
                
                # Mostrar algunas preguntas de ejemplo
                for i, pregunta in enumerate(preguntas[:3]):
                    tipo_icon = "📝" if pregunta['tipo'] == 'texto_libre' else "🔘"
                    print(f"   {tipo_icon} {pregunta['pregunta'][:60]}...")
                
                if len(preguntas) > 3:
                    print(f"   ... y {len(preguntas) - 3} preguntas más")
                
                print()
                
                total_preguntas += len(preguntas)
                total_texto_libre += texto_libre
                total_multiple_choice += multiple_choice
                
            else:
                print(f"⚠️ {cuestionario['titulo']}: Sin preguntas")
                
        except Exception as e:
            print(f"❌ Error verificando preguntas para {cuestionario['titulo']}: {e}")
    
    print("\n📊 RESUMEN TOTAL")
    print("=" * 30)
    print(f"Total preguntas: {total_preguntas}")
    print(f"Preguntas abiertas: {total_texto_libre}")
    print(f"Preguntas múltiples: {total_multiple_choice}")
    
    return total_preguntas

def verify_opciones_respuesta(supabase, cuestionarios):
    """Verifica las opciones de respuesta para preguntas de opción múltiple"""
    total_opciones = 0
    
    print("\n🔘 OPCIONES DE RESPUESTA")
    print("=" * 30)
    
    for cuestionario in cuestionarios:
        try:
            # Obtener preguntas de opción múltiple
            preguntas_result = supabase.table('preguntas').select('*').eq('cuestionario_id', cuestionario['id']).eq('tipo', 'multiple_choice').execute()
            
            if preguntas_result.data:
                for pregunta in preguntas_result.data:
                    opciones_result = supabase.table('opciones_respuesta').select('*').eq('pregunta_id', pregunta['id']).execute()
                    
                    if opciones_result.data:
                        opciones = opciones_result.data
                        correctas = len([o for o in opciones if o['es_correcta']])
                        
                        print(f"❓ {pregunta['pregunta'][:50]}...")
                        print(f"   Opciones: {len(opciones)} (Correctas: {correctas})")
                        
                        for opcion in opciones:
                            estado = "✅" if opcion['es_correcta'] else "⭕"
                            print(f"   {estado} {opcion['opcion']}")
                        
                        print()
                        total_opciones += len(opciones)
                        
        except Exception as e:
            print(f"❌ Error verificando opciones: {e}")
    
    print(f"Total opciones de respuesta: {total_opciones}")
    return total_opciones

def main():
    print("🔍 Verificando preguntas insertadas en la base de datos...")
    
    # Inicializar Supabase
    supabase = init_supabase()
    if not supabase:
        print("❌ No se pudo conectar a Supabase")
        return
    
    # Verificar cuestionarios
    cuestionarios = verify_cuestionarios(supabase)
    
    if not cuestionarios:
        print("❌ No hay cuestionarios para verificar")
        return
    
    # Verificar preguntas
    total_preguntas = verify_preguntas(supabase, cuestionarios)
    
    # Verificar opciones de respuesta
    total_opciones = verify_opciones_respuesta(supabase, cuestionarios)
    
    print("\n🎉 VERIFICACIÓN COMPLETADA")
    print("=" * 40)
    print(f"✅ Cuestionarios creados: {len(cuestionarios)}")
    print(f"✅ Preguntas insertadas: {total_preguntas}")
    print(f"✅ Opciones de respuesta: {total_opciones}")
    print("\n💡 Las preguntas del documento 'Master cuestionarios' han sido")
    print("   procesadas e insertadas exitosamente en la base de datos.")
    print("\n⚠️ NOTA IMPORTANTE:")
    print("   Las preguntas de opción múltiple tienen opciones por defecto.")
    print("   Debes editarlas desde el panel de administración para")
    print("   configurar las opciones correctas según el contenido original.")

if __name__ == "__main__":
    main()