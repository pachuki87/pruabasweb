/**
 * EmailService.js
 * Servicio para enviar resúmenes de cuestionarios por email
 */

import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializa el transporter de Nodemailer con configuración desde variables de entorno
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || ''
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2'
        }
      });

      // Verificar la configuración
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Error en la configuración del servicio de email:', error);
        } else {
          console.log('Servicio de email configurado correctamente');
        }
      });
    } catch (error) {
      console.error('Error al inicializar el servicio de email:', error);
    }
  }

  /**
   * Envía un resumen de cuestionario por email
   * @param {Object} userData - Datos del usuario
   * @param {Object} quizData - Datos del cuestionario
   * @param {Object} summaryData - Datos del resumen
   * @param {string} htmlContent - Contenido HTML del email
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendQuizSummaryEmail(userData, quizData, summaryData, htmlContent) {
    try {
      if (!this.transporter) {
        throw new Error('El servicio de email no está configurado correctamente');
      }

      if (!userData?.email) {
        throw new Error('El usuario no tiene un email válido');
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Instituto Lidera" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: `Resumen de Cuestionario - ${quizData.titulo || 'Cuestionario Completado'}`,
        html: htmlContent,
        // Opcional: enviar también versión texto plano
        text: this.generateTextSummary(userData, quizData, summaryData),
        // Opcional: añadir archivos adjuntos si existen
        attachments: this.generateAttachments(summaryData)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('Email enviado correctamente:', {
        messageId: result.messageId,
        to: userData.email,
        subject: mailOptions.subject
      });

      return {
        success: true,
        messageId: result.messageId,
        to: userData.email,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error al enviar email:', error);
      
      return {
        success: false,
        error: error.message,
        to: userData?.email || 'unknown',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Genera una versión texto plano del resumen
   * @param {Object} userData - Datos del usuario
   * @param {Object} quizData - Datos del cuestionario
   * @param {Object} summaryData - Datos del resumen
   * @returns {string} - Resumen en formato texto
   */
  generateTextSummary(userData, quizData, summaryData) {
    const { results, questionsSummary } = summaryData;
    
    let textSummary = `
==================================================
         RESUMEN DE CUESTIONARIO COMPLETADO
==================================================

INFORMACIÓN GENERAL:
- Alumno: ${userData?.nombre || userData?.name || 'Usuario'}
- Email: ${userData?.email || 'No disponible'}
- Curso: ${quizData?.titulo || 'Cuestionario'}
- Fecha: ${new Date().toLocaleString('es-ES')}

RESULTADOS:
- Puntuación: ${results.score}/${results.maxScore} (${results.percentage}%)
- Respuestas Correctas: ${results.correctAnswers}/${results.totalQuestions}
- Tiempo Empleado: ${Math.floor(results.timeSpent / 60)}:${(results.timeSpent % 60).toString().padStart(2, '0')}
- Estado: ${results.approved ? 'APROBADO ✅' : 'NO APROBADO ❌'}

DETALLE DE RESPUESTAS:
==================================================`;

    questionsSummary.forEach((q, index) => {
      textSummary += `
${index + 1}. ${q.questionText}
   Tiempo: ${q.timeSpent}s`;
      
      if (q.questionType === 'texto_libre') {
        textSummary += `
   Tu respuesta: ${q.userAnswer.content || 'No respondida'}`;
        
        if (q.userAnswer.files && q.userAnswer.files.length > 0) {
          textSummary += `
   Archivos adjuntos: ${q.userAnswer.files.map(f => f.name).join(', ')}`;
        }
      } else {
        textSummary += `
   Tu respuesta: ${q.userAnswer.selectedOption}
   Respuesta correcta: ${q.correctAnswer.correctOption}
   Resultado: ${q.isCorrect ? '✅ Correcto' : '❌ Incorrecto'}`;
      }
      
      textSummary += '\n';
    });

    textSummary += `
==================================================
Este resumen se ha generado automáticamente tras completar el cuestionario.
© ${new Date().getFullYear()} Instituto Lidera - Sistema de E-Learning
==================================================`;

    return textSummary;
  }

  /**
   * Genera archivos adjuntos si existen en el resumen
   * @param {Object} summaryData - Datos del resumen
   * @returns {Array} - Lista de archivos adjuntos
   */
  generateAttachments(summaryData) {
    const attachments = [];
    
    // Por ahora, no manejamos archivos adjuntos directamente desde el resumen
    // ya que los archivos se suben por separado y se almacenan en Supabase Storage
    // Si se necesita adjuntar archivos, se implementaría aquí
    
    // Ejemplo de cómo se podría adjuntar un archivo:
    // if (summaryData.hasAttachments) {
    //   attachments.push({
    //     filename: 'resumen_cuestionario.pdf',
    //     path: '/path/to/resumen.pdf'
    //   });
    // }
    
    return attachments;
  }

  /**
   * Envía un email de prueba para verificar la configuración
   * @param {string} toEmail - Email destinatario
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendTestEmail(toEmail) {
    try {
      if (!this.transporter) {
        throw new Error('El servicio de email no está configurado correctamente');
      }

      const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; padding: 30px; text-align: center; }
        .header { color: #2c3e50; margin-bottom: 20px; }
        .success { color: #27ae60; font-size: 24px; margin: 20px 0; }
        .config { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Email de Prueba</h1>
            <p>Servicio de Email del Instituto Lidera</p>
        </div>
        
        <div class="success">
            ✅ ¡Configuración de email correcta!
        </div>
        
        <div class="config">
            <h3>Configuración:</h3>
            <p><strong>Host:</strong> ${process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com'}</p>
            <p><strong>Puerto:</strong> ${process.env.EMAIL_SMTP_PORT || 587}</p>
            <p><strong>Usuario:</strong> ${process.env.EMAIL_USER || 'No configurado'}</p>
            <p><strong>Destinatario:</strong> ${toEmail}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        </div>
        
        <p>Este email confirma que el servicio de envío de resúmenes de cuestionarios está funcionando correctamente.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #7f8c8d; font-size: 12px;">
            © ${new Date().getFullYear()} Instituto Lidera - Sistema de E-Learning
        </p>
    </div>
</body>
</html>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Instituto Lidera" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '📧 Email de Prueba - Instituto Lidera',
        html: testHtml,
        text: 'Email de prueba - Servicio de email configurado correctamente.'
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('Email de prueba enviado correctamente:', {
        messageId: result.messageId,
        to: toEmail
      });

      return {
        success: true,
        messageId: result.messageId,
        to: toEmail,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error al enviar email de prueba:', error);
      
      return {
        success: false,
        error: error.message,
        to: toEmail,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Verifica si el servicio de email está configurado correctamente
   * @returns {boolean} - True si está configurado, false si no
   */
  isConfigured() {
    return !!(
      process.env.EMAIL_SMTP_HOST &&
      process.env.EMAIL_SMTP_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      this.transporter
    );
  }

  /**
   * Obtiene el estado actual del servicio de email
   * @returns {Object} - Estado del servicio
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      host: process.env.EMAIL_SMTP_HOST || 'No configurado',
      port: process.env.EMAIL_SMTP_PORT || 'No configurado',
      user: process.env.EMAIL_USER ? 'Configurado' : 'No configurado',
      transporter: !!this.transporter
    };
  }
}

export default new EmailService();
