#!/usr/bin/env python3
"""
Script para verificar la configuración del MCP de Supabase
"""

import os
import requests
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def check_supabase_config():
    print("🔍 Verificando configuración de Supabase MCP...\n")
    
    # Verificar token de acceso
    access_token = os.getenv('SUPABASE_ACCESS_TOKEN')
    if not access_token:
        print("❌ SUPABASE_ACCESS_TOKEN no encontrado")
        print("📝 Para configurar:")
        print("   1. Ve a https://supabase.com/dashboard/account/tokens")
        print("   2. Crea un Personal Access Token")
        print("   3. Añádelo al archivo .env como SUPABASE_ACCESS_TOKEN=tu_token")
        return False
    else:
        print(f"✅ SUPABASE_ACCESS_TOKEN encontrado: {access_token[:10]}...")
    
    # Verificar project ref
    project_ref = os.getenv('SUPABASE_PROJECT_REF')
    if not project_ref:
        print("❌ SUPABASE_PROJECT_REF no encontrado")
        print("📝 Para configurar:")
        print("   1. Ve a tu dashboard de Supabase")
        print("   2. Copia el Project Reference ID")
        print("   3. Añádelo al archivo .env como SUPABASE_PROJECT_REF=tu_project_ref")
        return False
    else:
        print(f"✅ SUPABASE_PROJECT_REF encontrado: {project_ref}")
    
    # Verificar conectividad
    try:
        print("\n🌐 Verificando conectividad con Supabase API...")
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            'https://api.supabase.com/v1/projects',
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ Conectividad exitosa - {len(projects)} proyectos encontrados")
            
            # Buscar el proyecto específico
            target_project = None
            for project in projects:
                if project.get('ref') == project_ref:
                    target_project = project
                    break
            
            if target_project:
                print(f"✅ Proyecto encontrado: {target_project.get('name', 'Sin nombre')}")
                print(f"   - Estado: {target_project.get('status', 'Desconocido')}")
                print(f"   - Región: {target_project.get('region', 'Desconocida')}")
            else:
                print(f"❌ Proyecto con ref '{project_ref}' no encontrado")
                print("📋 Proyectos disponibles:")
                for project in projects[:5]:  # Mostrar solo los primeros 5
                    print(f"   - {project.get('name', 'Sin nombre')} (ref: {project.get('ref')})")
                return False
                
        else:
            print(f"❌ Error de conectividad: {response.status_code}")
            print(f"   Respuesta: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")
        return False
    
    print("\n🎉 Configuración de Supabase MCP completada correctamente!")
    print("\n📋 Próximos pasos:")
    print("   1. El MCP de Supabase debería funcionar ahora")
    print("   2. Puedes usar herramientas como list_projects, execute_sql, etc.")
    print("   3. Recuerda usar --read-only para operaciones seguras")
    
    return True

if __name__ == "__main__":
    check_supabase_config()