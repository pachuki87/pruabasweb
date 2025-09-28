#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para verificar la estructura de las tablas del sistema de cuestionarios
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
    print("Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY requeridas")
    exit(1)

supabase: Client = create_client(url, key)

def check_table_structure(table_name):
    """Verificar la estructura de una tabla obteniendo una fila de muestra"""
    try:
        print(f"\n🔍 Verificando estructura de la tabla '{table_name}':")
        print("-" * 50)
        
        # Obtener una fila de muestra para ver las columnas disponibles
        response = supabase.table(table_name).select('*').limit(1).execute()
        
        if response.data:
            sample_row = response.data[0]
            print(f"Columnas encontradas en '{table_name}':")
            for column, value in sample_row.items():
                value_type = type(value).__name__
                value_preview = str(value)[:50] + '...' if len(str(value)) > 50 else str(value)
                print(f"   - {column}: {value_type} = {value_preview}")
        else:
            print(f"La tabla '{table_name}' está vacía")
            
        # Contar total de registros
        count_response = supabase.table(table_name).select('*', count='exact').execute()
        total_count = count_response.count if hasattr(count_response, 'count') else len(count_response.data)
        print(f"Total de registros: {total_count}")
        
    except Exception as e:
        print(f"Error al verificar '{table_name}': {e}")

def main():
    print("🔍 VERIFICACIÓN DE ESTRUCTURA DE TABLAS")
    print("=" * 60)
    
    # Tablas relacionadas con cuestionarios
    tables_to_check = [
        'cuestionarios',
        'preguntas', 
        'opciones_respuesta',
        'lecciones'
    ]
    
    for table in tables_to_check:
        check_table_structure(table)
    
    print("\n" + "=" * 60)
    print("VERIFICACIÓN COMPLETADA")

if __name__ == "__main__":
    main()