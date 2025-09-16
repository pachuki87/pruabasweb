#!/usr/bin/env python3
"""
Script para obtener detalles completos de proyectos de Supabase
"""

import os
import requests
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def get_project_details():
    print("🔍 Obteniendo detalles de proyectos de Supabase...\n")
    
    access_token = os.getenv('SUPABASE_ACCESS_TOKEN')
    if not access_token:
        print("❌ SUPABASE_ACCESS_TOKEN no encontrado")
        return False
    
    try:
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
            print(f"✅ {len(projects)} proyectos encontrados:\n")
            
            for i, project in enumerate(projects, 1):
                print(f"{i}. {project.get('name', 'Sin nombre')}")
                print(f"   📋 ID: {project.get('id', 'N/A')}")
                print(f"   🔗 Ref: {project.get('ref', 'N/A')}")
                print(f"   🌐 URL: {project.get('database', {}).get('host', 'N/A')}")
                print(f"   📍 Región: {project.get('region', 'N/A')}")
                print(f"   📊 Estado: {project.get('status', 'N/A')}")
                print(f"   📅 Creado: {project.get('created_at', 'N/A')}")
                
                # Buscar coincidencia con la URL actual
                current_url = os.getenv('VITE_SUPABASE_URL', '')
                if current_url:
                    project_host = project.get('database', {}).get('host', '')
                    if project_host and project_host in current_url:
                        print(f"   ✅ ¡COINCIDE CON TU URL ACTUAL!")
                        print(f"   💡 Usa este ref: {project.get('ref', 'N/A')}")
                
                print()
            
            # Mostrar URL actual para comparación
            current_url = os.getenv('VITE_SUPABASE_URL', '')
            if current_url:
                print(f"🔗 Tu URL actual: {current_url}")
                print(f"📋 Ref actual en .env: {os.getenv('SUPABASE_PROJECT_REF', 'N/A')}")
            
            return True
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Respuesta: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")
        return False

if __name__ == "__main__":
    get_project_details()