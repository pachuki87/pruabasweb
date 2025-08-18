import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

class DatabaseCleanup {
  constructor() {
    this.report = {
      duplicatesFound: 0,
      duplicatesRemoved: 0,
      nullImageUrlsFound: 0,
      nullImageUrlsFixed: 0,
      backupCreated: false,
      errors: []
    };
  }

  // Crear backup de los datos antes de la limpieza
  async createBackup() {
    try {
      console.log('🔄 Creando backup de la base de datos...');
      
      const { data: lecciones, error } = await supabase
        .from('lecciones')
        .select('*');
      
      if (error) throw error;
      
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `lecciones_backup_${timestamp}.json`);
      
      fs.writeFileSync(backupFile, JSON.stringify(lecciones, null, 2));
      
      this.report.backupCreated = true;
      console.log(`✅ Backup creado: ${backupFile}`);
      console.log(`📊 Total de registros en backup: ${lecciones.length}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Error creando backup:', error.message);
      this.report.errors.push(`Error creando backup: ${error.message}`);
      throw error;
    }
  }

  // Analizar duplicados basándose en título y curso_id
  async findDuplicates() {
    try {
      console.log('🔍 Analizando duplicados...');
      
      const { data: lecciones, error } = await supabase
        .from('lecciones')
        .select('*')
        .order('creado_en', { ascending: false });
      
      if (error) throw error;
      
      const duplicateGroups = {};
      const duplicates = [];
      
      // Agrupar por título y curso_id
      lecciones.forEach(leccion => {
        const key = `${leccion.titulo}_${leccion.curso_id}`;
        if (!duplicateGroups[key]) {
          duplicateGroups[key] = [];
        }
        duplicateGroups[key].push(leccion);
      });
      
      // Identificar grupos con más de un elemento (duplicados)
      Object.entries(duplicateGroups).forEach(([key, group]) => {
        if (group.length > 1) {
          // Mantener el más reciente (primero en la lista ordenada por creado_en desc)
          const [keep, ...toRemove] = group;
          duplicates.push({
            key,
            keep,
            toRemove
          });
        }
      });
      
      this.report.duplicatesFound = duplicates.reduce((sum, group) => sum + group.toRemove.length, 0);
      
      console.log(`📊 Grupos duplicados encontrados: ${duplicates.length}`);
      console.log(`📊 Total de registros duplicados a eliminar: ${this.report.duplicatesFound}`);
      
      return duplicates;
    } catch (error) {
      console.error('❌ Error analizando duplicados:', error.message);
      this.report.errors.push(`Error analizando duplicados: ${error.message}`);
      throw error;
    }
  }

  // Encontrar registros con imagen_url NULL
  async findNullImageUrls() {
    try {
      console.log('🔍 Analizando campos imagen_url NULL...');
      
      const { data: nullImageUrls, error } = await supabase
        .from('lecciones')
        .select('*')
        .is('imagen_url', null);
      
      if (error) throw error;
      
      this.report.nullImageUrlsFound = nullImageUrls.length;
      console.log(`📊 Registros con imagen_url NULL: ${nullImageUrls.length}`);
      
      return nullImageUrls;
    } catch (error) {
      console.error('❌ Error analizando imagen_url NULL:', error.message);
      this.report.errors.push(`Error analizando imagen_url NULL: ${error.message}`);
      throw error;
    }
  }

  // Eliminar duplicados manteniendo el más reciente
  async removeDuplicates(duplicates) {
    try {
      console.log('🗑️ Eliminando duplicados...');
      
      let removedCount = 0;
      
      for (const group of duplicates) {
        console.log(`\n📝 Procesando grupo: ${group.key}`);
        console.log(`   Manteniendo: ${group.keep.titulo} (ID: ${group.keep.id})`);
        console.log(`   Eliminando ${group.toRemove.length} duplicados:`);
        
        for (const duplicate of group.toRemove) {
          console.log(`   - ${duplicate.titulo} (ID: ${duplicate.id})`);
          
          const { error } = await supabase
            .from('lecciones')
            .delete()
            .eq('id', duplicate.id);
          
          if (error) {
            console.error(`   ❌ Error eliminando ${duplicate.id}:`, error.message);
            this.report.errors.push(`Error eliminando duplicado ${duplicate.id}: ${error.message}`);
          } else {
            removedCount++;
          }
        }
      }
      
      this.report.duplicatesRemoved = removedCount;
      console.log(`\n✅ Duplicados eliminados: ${removedCount}`);
      
    } catch (error) {
      console.error('❌ Error eliminando duplicados:', error.message);
      this.report.errors.push(`Error eliminando duplicados: ${error.message}`);
      throw error;
    }
  }

  // Limpiar campos imagen_url NULL
  async fixNullImageUrls(nullImageUrls) {
    try {
      console.log('🔧 Corrigiendo campos imagen_url NULL...');
      
      let fixedCount = 0;
      
      for (const leccion of nullImageUrls) {
        // Establecer una URL por defecto o cadena vacía
        const { error } = await supabase
          .from('lecciones')
          .update({ imagen_url: '' })
          .eq('id', leccion.id);
        
        if (error) {
          console.error(`❌ Error corrigiendo imagen_url para ${leccion.id}:`, error.message);
          this.report.errors.push(`Error corrigiendo imagen_url ${leccion.id}: ${error.message}`);
        } else {
          fixedCount++;
        }
      }
      
      this.report.nullImageUrlsFixed = fixedCount;
      console.log(`✅ Campos imagen_url corregidos: ${fixedCount}`);
      
    } catch (error) {
      console.error('❌ Error corrigiendo imagen_url NULL:', error.message);
      this.report.errors.push(`Error corrigiendo imagen_url NULL: ${error.message}`);
      throw error;
    }
  }

  // Generar reporte final
  generateReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📋 REPORTE DE LIMPIEZA DE BASE DE DATOS');
    console.log('='.repeat(50));
    console.log(`🔄 Backup creado: ${this.report.backupCreated ? '✅ Sí' : '❌ No'}`);
    console.log(`🔍 Duplicados encontrados: ${this.report.duplicatesFound}`);
    console.log(`🗑️ Duplicados eliminados: ${this.report.duplicatesRemoved}`);
    console.log(`🖼️ Campos imagen_url NULL encontrados: ${this.report.nullImageUrlsFound}`);
    console.log(`🔧 Campos imagen_url NULL corregidos: ${this.report.nullImageUrlsFixed}`);
    
    if (this.report.errors.length > 0) {
      console.log(`\n❌ Errores encontrados (${this.report.errors.length}):`);
      this.report.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ No se encontraron errores durante la limpieza');
    }
    
    console.log('='.repeat(50));
    
    // Guardar reporte en archivo
    const reportFile = path.join(process.cwd(), 'cleanup-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(this.report, null, 2));
    console.log(`📄 Reporte guardado en: ${reportFile}`);
  }

  // Verificar estado final de la base de datos
  async verifyFinalState() {
    try {
      console.log('\n🔍 Verificando estado final de la base de datos...');
      
      const { data: lecciones, error } = await supabase
        .from('lecciones')
        .select('*');
      
      if (error) throw error;
      
      const totalLecciones = lecciones.length;
      const leccionesConImagenNull = lecciones.filter(l => l.imagen_url === null).length;
      
      // Verificar duplicados restantes
      const duplicateCheck = {};
      let duplicatesRemaining = 0;
      
      lecciones.forEach(leccion => {
        const key = `${leccion.titulo}_${leccion.curso_id}`;
        if (duplicateCheck[key]) {
          duplicatesRemaining++;
        } else {
          duplicateCheck[key] = true;
        }
      });
      
      console.log(`📊 Estado final:`);
      console.log(`   Total de lecciones: ${totalLecciones}`);
      console.log(`   Lecciones con imagen_url NULL: ${leccionesConImagenNull}`);
      console.log(`   Duplicados restantes: ${duplicatesRemaining}`);
      
      return {
        totalLecciones,
        leccionesConImagenNull,
        duplicatesRemaining
      };
    } catch (error) {
      console.error('❌ Error verificando estado final:', error.message);
      this.report.errors.push(`Error verificando estado final: ${error.message}`);
      throw error;
    }
  }

  // Ejecutar limpieza completa
  async runCleanup() {
    try {
      console.log('🚀 Iniciando limpieza de base de datos...');
      console.log('⚠️ IMPORTANTE: Este proceso modificará la base de datos');
      
      // 1. Crear backup
      await this.createBackup();
      
      // 2. Analizar problemas
      const duplicates = await this.findDuplicates();
      const nullImageUrls = await this.findNullImageUrls();
      
      // 3. Confirmar antes de proceder
      console.log('\n⚠️ ¿Desea continuar con la limpieza? (Este proceso es irreversible)');
      console.log('   - Se eliminarán los duplicados identificados');
      console.log('   - Se corregirán los campos imagen_url NULL');
      
      // 4. Ejecutar limpieza
      if (duplicates.length > 0) {
        await this.removeDuplicates(duplicates);
      }
      
      if (nullImageUrls.length > 0) {
        await this.fixNullImageUrls(nullImageUrls);
      }
      
      // 5. Verificar estado final
      await this.verifyFinalState();
      
      // 6. Generar reporte
      this.generateReport();
      
      console.log('\n🎉 Limpieza de base de datos completada exitosamente!');
      
    } catch (error) {
      console.error('💥 Error durante la limpieza:', error.message);
      this.report.errors.push(`Error general: ${error.message}`);
      this.generateReport();
      throw error;
    }
  }
}

// Ejecutar limpieza
const cleanup = new DatabaseCleanup();
cleanup.runCleanup().catch(console.error);