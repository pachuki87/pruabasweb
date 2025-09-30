#!/usr/bin/env python3
"""
Script para iniciar el servidor de procesamiento de preguntas abiertas
"""

import subprocess
import sys
import os

def check_dependencies():
    """Verificar si las dependencias están instaladas"""
    try:
        import fastapi
        import uvicorn
        import pydantic
        print("✅ Todas las dependencias están instaladas")
        return True
    except ImportError as e:
        print(f"❌ Falta dependencia: {e}")
        print("Por favor, instala las dependencias con:")
        print("pip install -r requirements.txt")
        return False

def start_server():
    """Iniciar el servidor Uvicorn"""
    print("🚀 Iniciando servidor de procesamiento de preguntas abiertas...")
    print("📍 URL del servidor: http://localhost:8000")
    print("📖 Documentación: http://localhost:8000/docs")
    print("🔍 Endpoint webhook: http://localhost:8000/webhook/open-questions")
    print("=" * 60)

    try:
        # Iniciar el servidor
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "procesador_preguntas_libres:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")

if __name__ == "__main__":
    print("🧠 Procesador de Preguntas Abiertas - Instituto Lidera")
    print("=" * 60)

    # Verificar dependencias
    if not check_dependencies():
        sys.exit(1)

    # Iniciar servidor
    start_server()