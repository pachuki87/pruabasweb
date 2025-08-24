import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Contenido educativo para las lecciones restantes
const remainingLessonsContent = {
  6: {
    title: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    content: `
      <div class="lesson-content">
        <h1>INTERVENCIÓN FAMILIAR Y RECOVERY MENTORING</h1>
        
        <h2>1. INTRODUCCIÓN A LA INTERVENCIÓN FAMILIAR</h2>
        <p>La intervención familiar en adicciones es un proceso estructurado que busca motivar a la persona con problemas de consumo a buscar tratamiento, mientras proporciona apoyo y herramientas a la familia para manejar la situación de manera efectiva.</p>
        
        <h3>Objetivos de la Intervención Familiar:</h3>
        <ul>
          <li><strong>Motivar al cambio:</strong> Ayudar a la persona a reconocer la necesidad de tratamiento</li>
          <li><strong>Romper la negación:</strong> Confrontar de manera amorosa pero firme</li>
          <li><strong>Establecer límites:</strong> Definir consecuencias claras</li>
          <li><strong>Proporcionar apoyo:</strong> Ofrecer alternativas de tratamiento</li>
          <li><strong>Proteger a la familia:</strong> Reducir el impacto en otros miembros</li>
        </ul>
        
        <h2>2. TIPOS DE INTERVENCIÓN FAMILIAR</h2>
        
        <h3>2.1 Intervención Clásica (Johnson Model)</h3>
        <p><strong>Características:</strong></p>
        <ul>
          <li>Confrontación directa y estructurada</li>
          <li>Participación de familiares y amigos cercanos</li>
          <li>Preparación previa con un profesional</li>
          <li>Presentación de consecuencias específicas</li>
          <li>Oferta inmediata de tratamiento</li>
        </ul>
        
        <p><strong>Proceso:</strong></p>
        <ol>
          <li>Formación del equipo de intervención</li>
          <li>Recopilación de ejemplos específicos</li>
          <li>Ensayo de la intervención</li>
          <li>Ejecución de la intervención</li>
          <li>Seguimiento y apoyo</li>
        </ol>
        
        <h3>2.2 Intervención ARISE (A Relational Intervention Sequence for Engagement)</h3>
        <p><strong>Fases del modelo ARISE:</strong></p>
        
        <h4>Nivel 1: Llamada inicial y primera reunión familiar</h4>
        <ul>
          <li>Evaluación de la situación</li>
          <li>Educación sobre adicciones</li>
          <li>Desarrollo de estrategias iniciales</li>
          <li>Invitación al adicto a participar</li>
        </ul>
        
        <h4>Nivel 2: Sesiones familiares estructuradas</h4>
        <ul>
          <li>Sesiones regulares con la familia</li>
          <li>Desarrollo de habilidades de comunicación</li>
          <li>Establecimiento de límites</li>
          <li>Preparación para posible intervención formal</li>
        </ul>
        
        <h4>Nivel 3: Intervención formal</h4>
        <ul>
          <li>Intervención estructurada si es necesaria</li>
          <li>Participación de red de apoyo ampliada</li>
          <li>Consecuencias claras y específicas</li>
          <li>Plan de tratamiento inmediato</li>
        </ul>
        
        <h3>2.3 Intervención Sistémica</h3>
        <p>Enfoque que considera a la familia como un sistema:</p>
        <ul>
          <li>Análisis de patrones familiares disfuncionales</li>
          <li>Identificación de roles familiares</li>
          <li>Modificación de dinámicas que mantienen la adicción</li>
          <li>Fortalecimiento de la estructura familiar saludable</li>
        </ul>
        
        <h2>3. RECOVERY MENTORING</h2>
        
        <h3>3.1 Definición y Principios</h3>
        <p>El Recovery Mentoring es un proceso de apoyo entre pares donde una persona con experiencia en recuperación (mentor) guía y apoya a alguien que está iniciando o manteniendo su proceso de recuperación (mentee).</p>
        
        <h3>Principios Fundamentales:</h3>
        <ul>
          <li><strong>Experiencia vivida:</strong> El mentor ha experimentado la adicción y recuperación</li>
          <li><strong>Esperanza:</strong> Demostrar que la recuperación es posible</li>
          <li><strong>Apoyo mutuo:</strong> Beneficio bidireccional de la relación</li>
          <li><strong>Voluntariedad:</strong> Participación libre y voluntaria</li>
          <li><strong>Confidencialidad:</strong> Respeto por la privacidad</li>
        </ul>
        
        <h3>3.2 Diferencias entre Mentoring y Coaching</h3>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Recovery Mentoring</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Recovery Coaching</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Basado en experiencia personal</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Basado en formación profesional</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Relación más informal</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Relación profesional estructurada</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Enfoque en compartir experiencias</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Enfoque en objetivos y habilidades</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Generalmente voluntario</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Servicio profesional remunerado</td>
          </tr>
        </table>
        
        <h3>3.3 Roles del Recovery Mentor</h3>
        <ul>
          <li><strong>Modelo de rol:</strong> Ejemplo viviente de recuperación exitosa</li>
          <li><strong>Guía:</strong> Orientación basada en experiencia personal</li>
          <li><strong>Apoyo emocional:</strong> Comprensión empática de las dificultades</li>
          <li><strong>Motivador:</strong> Inspiración y aliento en momentos difíciles</li>
          <li><strong>Conector:</strong> Enlace con recursos y comunidad de recuperación</li>
        </ul>
        
        <h2>4. PROCESO DE RECOVERY MENTORING</h2>
        
        <h3>4.1 Selección y Preparación de Mentores</h3>
        <p><strong>Criterios de selección:</strong></p>
        <ul>
          <li>Mínimo 2 años de recuperación estable</li>
          <li>Compromiso con el crecimiento personal continuo</li>
          <li>Habilidades de comunicación efectiva</li>
          <li>Capacidad de mantener límites apropiados</li>
          <li>Disponibilidad de tiempo y energía</li>
        </ul>
        
        <p><strong>Formación del mentor:</strong></p>
        <ul>
          <li>Principios y ética del mentoring</li>
          <li>Habilidades de escucha y comunicación</li>
          <li>Manejo de límites y confidencialidad</li>
          <li>Reconocimiento de situaciones de crisis</li>
          <li>Recursos comunitarios disponibles</li>
        </ul>
        
        <h3>4.2 Emparejamiento Mentor-Mentee</h3>
        <p><strong>Factores a considerar:</strong></p>
        <ul>
          <li>Tipo de sustancia de consumo</li>
          <li>Edad y género</li>
          <li>Experiencias de vida similares</li>
          <li>Personalidad y estilo de comunicación</li>
          <li>Disponibilidad geográfica y temporal</li>
        </ul>
        
        <h3>4.3 Desarrollo de la Relación de Mentoring</h3>
        
        <h4>Fase Inicial (Primeras 4-6 semanas)</h4>
        <ul>
          <li>Establecimiento de rapport y confianza</li>
          <li>Clarificación de expectativas mutuas</li>
          <li>Establecimiento de límites y acuerdos</li>
          <li>Identificación de objetivos iniciales</li>
        </ul>
        
        <h4>Fase de Desarrollo (2-6 meses)</h4>
        <ul>
          <li>Reuniones regulares y consistentes</li>
          <li>Compartir experiencias y estrategias</li>
          <li>Apoyo en situaciones desafiantes</li>
          <li>Celebración de logros y progreso</li>
        </ul>
        
        <h4>Fase de Consolidación (6+ meses)</h4>
        <ul>
          <li>Mayor independencia del mentee</li>
          <li>Transición hacia apoyo mutuo</li>
          <li>Preparación para finalización o continuación</li>
          <li>Evaluación de la relación y resultados</li>
        </ul>
        
        <h2>5. INTEGRACIÓN DE INTERVENCIÓN FAMILIAR Y MENTORING</h2>
        
        <h3>5.1 Modelo Integrado</h3>
        <p>La combinación de intervención familiar y recovery mentoring crea un sistema de apoyo integral:</p>
        
        <ul>
          <li><strong>Fase pre-tratamiento:</strong> Intervención familiar para motivar al tratamiento</li>
          <li><strong>Fase de tratamiento:</strong> Apoyo familiar + mentoring para mantener motivación</li>
          <li><strong>Fase post-tratamiento:</strong> Mentoring continuo + apoyo familiar para prevenir recaídas</li>
        </ul>
        
        <h3>5.2 Beneficios de la Integración</h3>
        <ul>
          <li>Apoyo multidimensional (familia + pares)</li>
          <li>Diferentes perspectivas y estrategias</li>
          <li>Mayor red de apoyo social</li>
          <li>Reducción del aislamiento</li>
          <li>Mejores resultados a largo plazo</li>
        </ul>
        
        <h2>6. CASOS PRÁCTICOS</h2>
        
        <h3>Caso 1: Intervención Familiar - Familia Rodríguez</h3>
        <p><strong>Situación:</strong> Hijo de 28 años con adicción a la cocaína, negación del problema</p>
        <p><strong>Intervención:</strong></p>
        <ul>
          <li>Formación del equipo: padres, hermana, mejor amigo</li>
          <li>Preparación de ejemplos específicos de comportamientos problemáticos</li>
          <li>Establecimiento de consecuencias claras</li>
          <li>Oferta de tratamiento inmediato</li>
        </ul>
        <p><strong>Resultado:</strong> Aceptación del tratamiento, ingreso a programa residencial</p>
        
        <h3>Caso 2: Recovery Mentoring - Pedro y Carlos</h3>
        <p><strong>Situación:</strong> Pedro (mentee) saliendo de tratamiento por alcoholismo, Carlos (mentor) con 5 años de sobriedad</p>
        <p><strong>Proceso:</strong></p>
        <ul>
          <li>Reuniones semanales durante 6 meses</li>
          <li>Apoyo en situaciones de riesgo</li>
          <li>Participación conjunta en grupos de AA</li>
          <li>Desarrollo de actividades saludables</li>
        </ul>
        <p><strong>Resultado:</strong> Pedro mantiene 18 meses de sobriedad, se convierte en mentor</p>
        
        <h2>7. EVALUACIÓN Y SEGUIMIENTO</h2>
        
        <h3>7.1 Indicadores de Éxito en Intervención Familiar</h3>
        <ul>
          <li>Aceptación del tratamiento por parte del adicto</li>
          <li>Mejora en la comunicación familiar</li>
          <li>Establecimiento de límites saludables</li>
          <li>Reducción del estrés familiar</li>
          <li>Participación en programas de apoyo</li>
        </ul>
        
        <h3>7.2 Indicadores de Éxito en Recovery Mentoring</h3>
        <ul>
          <li>Mantenimiento de la abstinencia</li>
          <li>Mejora en habilidades de afrontamiento</li>
          <li>Aumento de la autoeficacia</li>
          <li>Expansión de la red de apoyo social</li>
          <li>Participación en actividades de recuperación</li>
        </ul>
        
        <h3>7.3 Herramientas de Evaluación</h3>
        <ul>
          <li>Cuestionario de Funcionamiento Familiar</li>
          <li>Escala de Calidad de la Relación de Mentoring</li>
          <li>Inventario de Estrategias de Afrontamiento</li>
          <li>Medida de Apoyo Social Percibido</li>
        </ul>
        
        <h2>8. CONSIDERACIONES ÉTICAS</h2>
        
        <h3>8.1 En Intervención Familiar</h3>
        <ul>
          <li>Respeto por la autonomía del individuo</li>
          <li>Evitar coerción excesiva</li>
          <li>Protección de menores en la familia</li>
          <li>Confidencialidad de la información</li>
          <li>Preparación para posible rechazo</li>
        </ul>
        
        <h3>8.2 En Recovery Mentoring</h3>
        <ul>
          <li>Mantenimiento de límites apropiados</li>
          <li>Confidencialidad de la información compartida</li>
          <li>Reconocimiento de limitaciones del rol</li>
          <li>Derivación apropiada a profesionales</li>
          <li>Autocuidado del mentor</li>
        </ul>
        
        <h2>CONCLUSIONES</h2>
        <p>La intervención familiar y el recovery mentoring son estrategias complementarias que fortalecen significativamente el proceso de recuperación. Su integración proporciona un sistema de apoyo robusto que aborda tanto las necesidades individuales como familiares.</p>
        
        <p>El éxito de estas intervenciones depende de la preparación adecuada, la selección cuidadosa de participantes y el seguimiento continuo del proceso.</p>
      </div>
    `
  },
  7: {
    title: 'NUEVOS MODELOS TERAPEUTICOS',
    content: `
      <div class="lesson-content">
        <h1>NUEVOS MODELOS TERAPÉUTICOS EN ADICCIONES</h1>
        
        <h2>1. INTRODUCCIÓN A LOS NUEVOS ENFOQUES</h2>
        <p>El campo del tratamiento de adicciones ha evolucionado significativamente en las últimas décadas, incorporando nuevos modelos terapéuticos basados en evidencia científica y enfoques innovadores que complementan los tratamientos tradicionales.</p>
        
        <h3>Características de los Nuevos Modelos:</h3>
        <ul>
          <li><strong>Basados en evidencia:</strong> Respaldados por investigación científica rigurosa</li>
          <li><strong>Integrativos:</strong> Combinan diferentes enfoques terapéuticos</li>
          <li><strong>Personalizados:</strong> Adaptados a las necesidades individuales</li>
          <li><strong>Holísticos:</strong> Consideran a la persona en su totalidad</li>
          <li><strong>Tecnológicamente avanzados:</strong> Incorporan nuevas tecnologías</li>
        </ul>
        
        <h2>2. TERAPIAS DE TERCERA GENERACIÓN</h2>
        
        <h3>2.1 Terapia de Aceptación y Compromiso (ACT)</h3>
        <p>La ACT se enfoca en aumentar la flexibilidad psicológica y el compromiso con valores personales.</p>
        
        <h4>Principios Fundamentales:</h4>
        <ul>
          <li><strong>Aceptación:</strong> Aceptar pensamientos y emociones sin luchar contra ellos</li>
          <li><strong>Defusión cognitiva:</strong> Cambiar la relación con los pensamientos</li>
          <li><strong>Contacto con el presente:</strong> Mindfulness y atención plena</li>
          <li><strong>Yo como contexto:</strong> Perspectiva flexible del self</li>
          <li><strong>Valores:</strong> Identificar lo que realmente importa</li>
          <li><strong>Acción comprometida:</strong> Comportamientos alineados con valores</li>
        </ul>
        
        <h4>Aplicación en Adicciones:</h4>
        <ul>
          <li>Aceptación del craving sin actuar sobre él</li>
          <li>Identificación de valores personales más allá del consumo</li>
          <li>Desarrollo de flexibilidad psicológica</li>
          <li>Reducción de la evitación experiencial</li>
        </ul>
        
        <h3>2.2 Terapia Dialéctica Conductual (DBT)</h3>
        <p>Originalmente desarrollada para trastorno límite de personalidad, adaptada para adicciones.</p>
        
        <h4>Módulos de Habilidades:</h4>
        <ul>
          <li><strong>Mindfulness:</strong> Conciencia del momento presente</li>
          <li><strong>Tolerancia al malestar:</strong> Sobrevivir a crisis sin empeorar</li>
          <li><strong>Regulación emocional:</strong> Entender y manejar emociones</li>
          <li><strong>Efectividad interpersonal:</strong> Mantener relaciones y autorespeto</li>
        </ul>
        
        <h4>Aplicación en Adicciones:</h4>
        <ul>
          <li>Manejo de impulsos y craving</li>
          <li>Regulación de emociones intensas</li>
          <li>Desarrollo de habilidades de afrontamiento</li>
          <li>Mejora de relaciones interpersonales</li>
        </ul>
        
        <h3>2.3 Mindfulness-Based Relapse Prevention (MBRP)</h3>
        <p>Integra prácticas de mindfulness con estrategias cognitivo-conductuales de prevención de recaídas.</p>
        
        <h4>Componentes Clave:</h4>
        <ul>
          <li>Meditación mindfulness</li>
          <li>Conciencia corporal</li>
          <li>Observación de pensamientos y emociones</li>
          <li>Respuesta vs. reacción automática</li>
          <li>Aceptación radical</li>
        </ul>
        
        <h2>3. TERAPIAS BASADAS EN NEUROCIENCIA</h2>
        
        <h3>3.1 Neurofeedback</h3>
        <p>Técnica que permite a los individuos aprender a autorregular su actividad cerebral.</p>
        
        <h4>Mecanismo de Acción:</h4>
        <ul>
          <li>Monitoreo en tiempo real de ondas cerebrales</li>
          <li>Retroalimentación visual o auditiva</li>
          <li>Entrenamiento de patrones cerebrales saludables</li>
          <li>Mejora de la autorregulación neuronal</li>
        </ul>
        
        <h4>Aplicaciones en Adicciones:</h4>
        <ul>
          <li>Reducción del craving</li>
          <li>Mejora de la función ejecutiva</li>
          <li>Regulación emocional</li>
          <li>Reducción de ansiedad y depresión</li>
        </ul>
        
        <h3>3.2 Estimulación Magnética Transcraneal (TMS)</h3>
        <p>Técnica no invasiva que utiliza campos magnéticos para estimular áreas específicas del cerebro.</p>
        
        <h4>Mecanismo:</h4>
        <ul>
          <li>Estimulación de la corteza prefrontal</li>
          <li>Modulación de circuitos de recompensa</li>
          <li>Mejora de la función ejecutiva</li>
          <li>Reducción del craving</li>
        </ul>
        
        <h2>4. TERAPIAS EXPERIENCIALES</h2>
        
        <h3>4.1 Terapia Asistida por Animales</h3>
        <p>Incorporación de animales entrenados en el proceso terapéutico.</p>
        
        <h4>Beneficios:</h4>
        <ul>
          <li>Reducción del estrés y ansiedad</li>
          <li>Mejora de la autoestima</li>
          <li>Desarrollo de habilidades sociales</li>
          <li>Aumento de la motivación terapéutica</li>
          <li>Práctica de responsabilidad y cuidado</li>
        </ul>
        
        <h3>4.2 Terapia de Arte y Expresión Creativa</h3>
        <p>Utilización de medios artísticos para facilitar la expresión y el procesamiento emocional.</p>
        
        <h4>Modalidades:</h4>
        <ul>
          <li><strong>Arte visual:</strong> Pintura, dibujo, escultura</li>
          <li><strong>Música:</strong> Composición, interpretación, escucha</li>
          <li><strong>Drama:</strong> Teatro terapéutico, role-playing</li>
          <li><strong>Escritura:</strong> Journaling, poesía, narrativa</li>
          <li><strong>Danza/Movimiento:</strong> Expresión corporal</li>
        </ul>
        
        <h3>4.3 Terapia de Aventura y Naturaleza</h3>
        <p>Utilización de actividades al aire libre y desafíos físicos como herramientas terapéuticas.</p>
        
        <h4>Componentes:</h4>
        <ul>
          <li>Actividades de desafío físico</li>
          <li>Trabajo en equipo</li>
          <li>Resolución de problemas</li>
          <li>Conexión con la naturaleza</li>
          <li>Desarrollo de confianza</li>
        </ul>
        
        <h2>5. TERAPIAS DIGITALES E INNOVACIÓN TECNOLÓGICA</h2>
        
        <h3>5.1 Realidad Virtual (VR) en Tratamiento</h3>
        <p>Uso de entornos virtuales inmersivos para exposición controlada y entrenamiento de habilidades.</p>
        
        <h4>Aplicaciones:</h4>
        <ul>
          <li><strong>Exposición a situaciones de riesgo:</strong> Práctica segura de rechazo</li>
          <li><strong>Entrenamiento de habilidades:</strong> Simulación de situaciones sociales</li>
          <li><strong>Relajación:</strong> Entornos virtuales calmantes</li>
          <li><strong>Terapia de aversión:</strong> Asociaciones negativas controladas</li>
        </ul>
        
        <h3>5.2 Aplicaciones Móviles Terapéuticas</h3>
        <p>Herramientas digitales para apoyo continuo y automonitoreo.</p>
        
        <h4>Características:</h4>
        <ul>
          <li>Seguimiento de síntomas y triggers</li>
          <li>Recordatorios de medicación</li>
          <li>Ejercicios de mindfulness</li>
          <li>Conexión con redes de apoyo</li>
          <li>Acceso a recursos educativos</li>
        </ul>
        
        <h3>5.3 Inteligencia Artificial en Tratamiento</h3>
        <p>Uso de algoritmos de IA para personalizar y optimizar tratamientos.</p>
        
        <h4>Aplicaciones:</h4>
        <ul>
          <li>Predicción de riesgo de recaída</li>
          <li>Personalización de intervenciones</li>
          <li>Análisis de patrones de comportamiento</li>
          <li>Chatbots terapéuticos</li>
        </ul>
        
        <h2>6. ENFOQUES INTEGRATIVOS</h2>
        
        <h3>6.1 Medicina Integrativa</h3>
        <p>Combinación de medicina convencional con terapias complementarias basadas en evidencia.</p>
        
        <h4>Componentes:</h4>
        <ul>
          <li><strong>Acupuntura:</strong> Para manejo de síntomas de abstinencia</li>
          <li><strong>Yoga:</strong> Integración mente-cuerpo</li>
          <li><strong>Meditación:</strong> Reducción del estrés y autorregulación</li>
          <li><strong>Nutrición:</strong> Restauración de la salud física</li>
          <li><strong>Ejercicio:</strong> Mejora del bienestar general</li>
        </ul>
        
        <h3>6.2 Modelo Biopsicosocial-Espiritual</h3>
        <p>Enfoque holístico que considera todas las dimensiones de la persona.</p>
        
        <h4>Dimensiones:</h4>
        <ul>
          <li><strong>Biológica:</strong> Aspectos médicos y neurobiológicos</li>
          <li><strong>Psicológica:</strong> Procesos cognitivos y emocionales</li>
          <li><strong>Social:</strong> Relaciones y contexto social</li>
          <li><strong>Espiritual:</strong> Sentido, propósito y trascendencia</li>
        </ul>
        
        <h2>7. TERAPIAS EMERGENTES</h2>
        
        <h3>7.1 Terapia Asistida por Psicodélicos</h3>
        <p>Investigación emergente sobre el uso terapéutico de sustancias psicodélicas en contextos controlados.</p>
        
        <h4>Sustancias en Investigación:</h4>
        <ul>
          <li><strong>Psilocibina:</strong> Para depresión y adicciones</li>
          <li><strong>MDMA:</strong> Para TEPT y terapia de pareja</li>
          <li><strong>Ketamina:</strong> Para depresión resistente</li>
          <li><strong>Ayahuasca:</strong> En contextos ceremoniales controlados</li>
        </ul>
        
        <p><strong>Nota:</strong> Estas terapias están en fase de investigación y requieren supervisión médica especializada.</p>
        
        <h3>7.2 Terapia de Microbioma</h3>
        <p>Enfoque emergente que considera la conexión intestino-cerebro en adicciones.</p>
        
        <h4>Estrategias:</h4>
        <ul>
          <li>Probióticos específicos</li>
          <li>Modificación dietética</li>
          <li>Trasplante de microbiota fecal</li>
          <li>Prebióticos dirigidos</li>
        </ul>
        
        <h2>8. IMPLEMENTACIÓN DE NUEVOS MODELOS</h2>
        
        <h3>8.1 Consideraciones para la Implementación</h3>
        <ul>
          <li><strong>Formación del personal:</strong> Capacitación especializada</li>
          <li><strong>Recursos tecnológicos:</strong> Equipamiento necesario</li>
          <li><strong>Evaluación de efectividad:</strong> Medición de resultados</li>
          <li><strong>Integración con tratamientos existentes:</strong> Complementariedad</li>
          <li><strong>Consideraciones éticas:</strong> Consentimiento informado</li>
        </ul>
        
        <h3>8.2 Barreras y Desafíos</h3>
        <ul>
          <li>Resistencia al cambio</li>
          <li>Limitaciones de recursos</li>
          <li>Falta de evidencia a largo plazo</li>
          <li>Regulaciones y políticas</li>
          <li>Accesibilidad y equidad</li>
        </ul>
        
        <h2>9. CASOS CLÍNICOS</h2>
        
        <h3>Caso 1: Integración de ACT y Neurofeedback</h3>
        <p><strong>Paciente:</strong> Mujer de 35 años con adicción a benzodiacepinas</p>
        <p><strong>Tratamiento:</strong></p>
        <ul>
          <li>Sesiones de ACT para trabajar valores y aceptación</li>
          <li>Neurofeedback para regulación de ansiedad</li>
          <li>Mindfulness para manejo del craving</li>
        </ul>
        <p><strong>Resultado:</strong> Reducción significativa de ansiedad y mantenimiento de abstinencia</p>
        
        <h3>Caso 2: Terapia de Arte y VR</h3>
        <p><strong>Paciente:</strong> Hombre de 28 años con adicción a cocaína y trauma</p>
        <p><strong>Tratamiento:</strong></p>
        <ul>
          <li>Arte terapia para procesamiento emocional</li>
          <li>VR para exposición gradual a triggers</li>
          <li>DBT para regulación emocional</li>
        </ul>
        <p><strong>Resultado:</strong> Mejora en procesamiento del trauma y habilidades de afrontamiento</p>
        
        <h2>10. EVALUACIÓN DE EFECTIVIDAD</h2>
        
        <h3>10.1 Métricas de Evaluación</h3>
        <ul>
          <li><strong>Tasas de retención:</strong> Permanencia en tratamiento</li>
          <li><strong>Reducción de consumo:</strong> Frecuencia e intensidad</li>
          <li><strong>Mejora funcional:</strong> Trabajo, relaciones, salud</li>
          <li><strong>Satisfacción del paciente:</strong> Experiencia subjetiva</li>
          <li><strong>Costo-efectividad:</strong> Relación costo-beneficio</li>
        </ul>
        
        <h3>10.2 Herramientas de Medición</h3>
        <ul>
          <li>Escalas de craving y abstinencia</li>
          <li>Cuestionarios de calidad de vida</li>
          <li>Medidas neuropsicológicas</li>
          <li>Biomarcadores</li>
          <li>Seguimiento longitudinal</li>
        </ul>
        
        <h2>CONCLUSIONES</h2>
        <p>Los nuevos modelos terapéuticos en adicciones representan una evolución natural del campo, incorporando avances científicos y tecnológicos para mejorar los resultados del tratamiento.</p>
        
        <p>La integración cuidadosa de estos enfoques con los tratamientos establecidos promete un futuro más efectivo y personalizado en el tratamiento de las adicciones.</p>
        
        <p>Es fundamental mantener un enfoque basado en evidencia y considerar las necesidades individuales de cada paciente al implementar estos nuevos modelos terapéuticos.</p>
      </div>
    `
  },
  9: {
    title: 'INTELIGENCIA EMOCIONAL',
    content: `
      <div class="lesson-content">
        <h1>INTELIGENCIA EMOCIONAL EN EL TRATAMIENTO DE ADICCIONES</h1>
        
        <h2>1. INTRODUCCIÓN A LA INTELIGENCIA EMOCIONAL</h2>
        <p>La inteligencia emocional (IE) se define como la capacidad de reconocer, comprender y manejar nuestras propias emociones, así como las de los demás. En el contexto de las adicciones, la IE juega un papel crucial tanto en el desarrollo como en la recuperación.</p>
        
        <h3>Definición de Inteligencia Emocional:</h3>
        <p>Según Daniel Goleman, la IE incluye cinco componentes principales:</p>
        <ul>
          <li><strong>Autoconciencia emocional:</strong> Reconocer las propias emociones</li>
          <li><strong>Autorregulación:</strong> Manejar las emociones de manera efectiva</li>
          <li><strong>Motivación:</strong> Utilizar las emociones para alcanzar objetivos</li>
          <li><strong>Empatía:</strong> Reconocer y comprender las emociones de otros</li>
          <li><strong>Habilidades sociales:</strong> Manejar las relaciones interpersonales</li>
        </ul>
        
        <h2>2. RELACIÓN ENTRE INTELIGENCIA EMOCIONAL Y ADICCIONES</h2>
        
        <h3>2.1 Déficits de IE en Personas con Adicciones</h3>
        <p>Las investigaciones han demostrado que las personas con trastornos por uso de sustancias frecuentemente presentan:</p>
        
        <ul>
          <li><strong>Dificultades en el reconocimiento emocional:</strong> Problemas para identificar y nombrar emociones</li>
          <li><strong>Disregulación emocional:</strong> Incapacidad para manejar emociones intensas</li>
          <li><strong>Alexitimia:</strong> Dificultad para expresar emociones verbalmente</li>
          <li><strong>Impulsividad emocional:</strong> Reacciones automáticas sin reflexión</li>
          <li><strong>Déficits en empatía:</strong> Dificultad para comprender las emociones de otros</li>
        </ul>
        
        <h3>2.2 El Consumo como Estrategia de Regulación Emocional</h3>
        <p>Muchas personas utilizan sustancias como una forma disfuncional de:</p>
        <ul>
          <li>Evitar emociones dolorosas</li>
          <li>Intensificar emociones positivas</li>
          <li>Numerar el dolor emocional</li>
          <li>Manejar el estrés y la ansiedad</li>
          <li>Facilitar la interacción social</li>
        </ul>
        
        <h2>3. MODELOS TEÓRICOS DE INTELIGENCIA EMOCIONAL</h2>
        
        <h3>3.1 Modelo de Habilidades de Mayer y Salovey</h3>
        <p>Este modelo conceptualiza la IE como un conjunto de habilidades mentales:</p>
        
        <h4>Cuatro Ramas de la IE:</h4>
        <ol>
          <li><strong>Percepción emocional:</strong> Identificar emociones en uno mismo y otros</li>
          <li><strong>Uso de emociones:</strong> Utilizar emociones para facilitar el pensamiento</li>
          <li><strong>Comprensión emocional:</strong> Entender las causas y consecuencias de las emociones</li>
          <li><strong>Regulación emocional:</strong> Manejar emociones en uno mismo y otros</li>
        </ol>
        
        <h3>3.2 Modelo de Competencias de Goleman</h3>
        <p>Enfoque en competencias emocionales aplicables:</p>
        
        <h4>Competencias Personales:</h4>
        <ul>
          <li><strong>Autoconciencia:</strong> Conciencia emocional, autoevaluación, autoconfianza</li>
          <li><strong>Autorregulación:</strong> Autocontrol, adaptabilidad, orientación al logro</li>
          <li><strong>Motivación:</strong> Motivación de logro, compromiso, iniciativa</li>
        </ul>
        
        <h4>Competencias Sociales:</h4>
        <ul>
          <li><strong>Empatía:</strong> Comprensión de otros, orientación al servicio</li>
          <li><strong>Habilidades sociales:</strong> Influencia, comunicación, liderazgo</li>
        </ul>
        
        <h3>3.3 Modelo de Bar-On</h3>
        <p>Modelo mixto que incluye habilidades emocionales y rasgos de personalidad:</p>
        <ul>
          <li>Habilidades intrapersonales</li>
          <li>Habilidades interpersonales</li>
          <li>Manejo del estrés</li>
          <li>Adaptabilidad</li>
          <li>Estado de ánimo general</li>
        </ul>
        
        <h2>4. EVALUACIÓN DE LA INTELIGENCIA EMOCIONAL</h2>
        
        <h3>4.1 Instrumentos de Medición</h3>
        
        <h4>Tests de Habilidades:</h4>
        <ul>
          <li><strong>MSCEIT (Mayer-Salovey-Caruso EIT):</strong> Mide habilidades específicas de IE</li>
          <li><strong>MEIS (Multifactor Emotional Intelligence Scale):</strong> Versión anterior del MSCEIT</li>
        </ul>
        
        <h4>Medidas de Autoreporte:</h4>
        <ul>
          <li><strong>EQ-i 2.0 (Emotional Quotient Inventory):</strong> Basado en el modelo de Bar-On</li>
          <li><strong>ECI (Emotional Competence Inventory):</strong> Basado en el modelo de Goleman</li>
          <li><strong>TEIQue (Trait Emotional Intelligence Questionnaire):</strong> Mide IE como rasgo</li>
        </ul>
        
        <h4>Medidas Específicas para Adicciones:</h4>
        <ul>
          <li><strong>DERS (Difficulties in Emotion Regulation Scale):</strong> Dificultades en regulación emocional</li>
          <li><strong>TAS-20 (Toronto Alexithymia Scale):</strong> Mide alexitimia</li>
          <li><strong>PANAS (Positive and Negative Affect Schedule):</strong> Estados afectivos</li>
        </ul>
        
        <h2>5. DESARROLLO DE LA INTELIGENCIA EMOCIONAL EN TRATAMIENTO</h2>
        
        <h3>5.1 Programa de Entrenamiento en IE</h3>
        
        <h4>Fase 1: Autoconciencia Emocional (Sesiones 1-4)</h4>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Identificar y nombrar emociones básicas</li>
          <li>Reconocer señales físicas de las emociones</li>
          <li>Desarrollar vocabulario emocional</li>
          <li>Practicar mindfulness emocional</li>
        </ul>
        
        <p><strong>Técnicas:</strong></p>
        <ul>
          <li>Diario emocional</li>
          <li>Rueda de emociones</li>
          <li>Escaneo corporal</li>
          <li>Meditación de conciencia emocional</li>
        </ul>
        
        <h4>Fase 2: Comprensión Emocional (Sesiones 5-8)</h4>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Entender las causas de las emociones</li>
          <li>Reconocer patrones emocionales</li>
          <li>Identificar triggers emocionales</li>
          <li>Comprender la función de las emociones</li>
        </ul>
        
        <p><strong>Técnicas:</strong></p>
        <ul>
          <li>Análisis de antecedentes-comportamiento-consecuencias (ABC)</li>
          <li>Mapeo de triggers emocionales</li>
          <li>Exploración de creencias sobre emociones</li>
          <li>Psicoeducación sobre neurobiología emocional</li>
        </ul>
        
        <h4>Fase 3: Regulación Emocional (Sesiones 9-12)</h4>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Desarrollar estrategias de regulación saludables</li>
          <li>Practicar técnicas de manejo del estrés</li>
          <li>Aprender a tolerar emociones difíciles</li>
          <li>Reemplazar el consumo como estrategia de regulación</li>
        </ul>
        
        <p><strong>Técnicas:</strong></p>
        <ul>
          <li>Técnicas de respiración</li>
          <li>Relajación muscular progresiva</li>
          <li>Reestructuración cognitiva</li>
          <li>Técnicas de distracción saludable</li>
          <li>Ejercicio físico como regulador emocional</li>
        </ul>
        
        <h4>Fase 4: Habilidades Sociales y Empatía (Sesiones 13-16)</h4>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Mejorar la comunicación emocional</li>
          <li>Desarrollar empatía hacia otros</li>
          <li>Practicar resolución de conflictos</li>
          <li>Fortalecer relaciones interpersonales</li>
        </ul>
        
        <p><strong>Técnicas:</strong></p>
        <ul>
          <li>Role-playing de situaciones sociales</li>
          <li>Práctica de escucha activa</li>
          <li>Ejercicios de perspectiva-taking</li>
          <li>Comunicación asertiva</li>
        </ul>
        
        <h2>6. TÉCNICAS ESPECÍFICAS DE INTERVENCIÓN</h2>
        
        <h3>6.1 Técnicas de Conciencia Emocional</h3>
        
        <h4>Diario Emocional Estructurado:</h4>
        <ul>
          <li><strong>Situación:</strong> ¿Qué pasó?</li>
          <li><strong>Emoción:</strong> ¿Qué sentí?</li>
          <li><strong>Intensidad:</strong> Del 1 al 10</li>
          <li><strong>Pensamientos:</strong> ¿Qué pensé?</li>
          <li><strong>Sensaciones físicas:</strong> ¿Qué sentí en el cuerpo?</li>
          <li><strong>Comportamiento:</strong> ¿Qué hice?</li>
        </ul>
        
        <h4>Técnica STOP:</h4>
        <ul>
          <li><strong>S</strong> - Stop (Parar)</li>
          <li><strong>T</strong> - Take a breath (Respirar)</li>
          <li><strong>O</strong> - Observe (Observar emociones y pensamientos)</li>
          <li><strong>P</strong> - Proceed (Proceder con conciencia)</li>
        </ul>
        
        <h3>6.2 Técnicas de Regulación Emocional</h3>
        
        <h4>Técnica TIPP (para crisis emocionales):</h4>
        <ul>
          <li><strong>T</strong> - Temperature (Cambiar temperatura corporal)</li>
          <li><strong>I</strong> - Intense exercise (Ejercicio intenso)</li>
          <li><strong>P</strong> - Paced breathing (Respiración controlada)</li>
          <li><strong>P</strong> - Paired muscle relaxation (Relajación muscular)</li>
        </ul>
        
        <h4>Técnica de Surfear la Ola Emocional:</h4>
        <ol>
          <li>Reconocer la emoción intensa</li>
          <li>Recordar que las emociones son temporales</li>
          <li>Observar sin juzgar</li>
          <li>Respirar conscientemente</li>
          <li>Esperar a que la intensidad disminuya</li>
        </ol>
        
        <h3>6.3 Técnicas de Desarrollo de Empatía</h3>
        
        <h4>Ejercicio de Perspectiva Múltiple:</h4>
        <ul>
          <li>Describir una situación conflictiva</li>
          <li>Identificar las emociones propias</li>
          <li>Imaginar las emociones de la otra persona</li>
          <li>Considerar perspectivas de observadores externos</li>
          <li>Buscar puntos en común</li>
        </ul>
        
        <h2>7. INTELIGENCIA EMOCIONAL EN DIFERENTES CONTEXTOS</h2>
        
        <h3>7.1 IE en Terapia Individual</h3>
        <ul>
          <li>Evaluación personalizada de déficits de IE</li>
          <li>Desarrollo de plan de tratamiento específico</li>
          <li>Práctica intensiva de habilidades</li>
          <li>Procesamiento de experiencias emocionales</li>
        </ul>
        
        <h3>7.2 IE en Terapia Grupal</h3>
        <ul>
          <li>Aprendizaje vicario de habilidades emocionales</li>
          <li>Práctica de habilidades sociales</li>
          <li>Feedback de pares sobre expresión emocional</li>
          <li>Apoyo mutuo en el desarrollo de IE</li>
        </ul>
        
        <h3>7.3 IE en Terapia Familiar</h3>
        <ul>
          <li>Mejora de la comunicación emocional familiar</li>
          <li>Desarrollo de empatía entre miembros</li>
          <li>Manejo de conflictos emocionales</li>
          <li>Creación de ambiente emocionalmente seguro</li>
        </ul>
        
        <h2>8. CASOS CLÍNICOS</h2>
        
        <h3>Caso 1: María, 32 años - Alcoholismo y Alexitimia</h3>
        <p><strong>Presentación:</strong> Dificultad para identificar y expresar emociones, uso del alcohol para "sentirse mejor"</p>
        
        <p><strong>Evaluación de IE:</strong></p>
        <ul>
          <li>TAS-20: Puntuación alta en alexitimia</li>
          <li>DERS: Dificultades significativas en regulación emocional</li>
          <li>Vocabulario emocional limitado</li>
        </ul>
        
        <p><strong>Intervención:</strong></p>
        <ul>
          <li>Entrenamiento en reconocimiento emocional</li>
          <li>Desarrollo de vocabulario emocional</li>
          <li>Técnicas de expresión emocional</li>
          <li>Estrategias alternativas de regulación</li>
        </ul>
        
        <p><strong>Resultados:</strong></p>
        <ul>
          <li>Mejora en identificación de emociones</li>
          <li>Reducción del consumo de alcohol</li>
          <li>Mejor comunicación en relaciones</li>
          <li>Aumento de la autoconciencia emocional</li>
        </ul>
        
        <h3>Caso 2: Carlos, 28 años - Cocaína y Disregulación Emocional</h3>
        <p><strong>Presentación:</strong> Consumo de cocaína para manejar estrés laboral y emociones intensas</p>
        
        <p><strong>Evaluación de IE:</strong></p>
        <ul>
          <li>MSCEIT: Puntuaciones bajas en regulación emocional</li>
          <li>Alta impulsividad emocional</li>
          <li>Estrategias de afrontamiento inadecuadas</li>
        </ul>
        
        <p><strong>Intervención:</strong></p>
        <ul>
          <li>Técnicas de regulación emocional</li>
          <li>Manejo del estrés</li>
          <li>Desarrollo de tolerancia al malestar</li>
          <li>Habilidades de comunicación asertiva</li>
        </ul>
        
        <p><strong>Resultados:</strong></p>
        <ul>
          <li>Mejor manejo del estrés laboral</li>
          <li>Reducción significativa del consumo</li>
          <li>Mejora en relaciones interpersonales</li>
          <li>Aumento de la autoeficacia emocional</li>
        </ul>
        
        <h2>9. INTELIGENCIA EMOCIONAL EN PROFESIONALES</h2>
        
        <h3>9.1 IE en Terapeutas de Adicciones</h3>
        <p>Los profesionales también necesitan desarrollar su IE para:</p>
        <ul>
          <li>Manejar el estrés del trabajo terapéutico</li>
          <li>Desarrollar empatía sin sobreimplicación</li>
          <li>Mantener límites profesionales apropiados</li>
          <li>Prevenir el burnout</li>
          <li>Mejorar la alianza terapéutica</li>
        </ul>
        
        <h3>9.2 Entrenamiento en IE para Profesionales</h3>
        <ul>
          <li>Autoconciencia de reacciones emocionales</li>
          <li>Manejo de contratransferencia</li>
          <li>Técnicas de autorregulación</li>
          <li>Desarrollo de resiliencia emocional</li>
          <li>Habilidades de comunicación empática</li>
        </ul>
        
        <h2>10. EVALUACIÓN DE RESULTADOS</h2>
        
        <h3>10.1 Indicadores de Mejora en IE</h3>
        <ul>
          <li><strong>Cuantitativos:</strong></li>
          <ul>
            <li>Mejora en puntuaciones de tests de IE</li>
            <li>Reducción en escalas de alexitimia</li>
            <li>Disminución de dificultades en regulación emocional</li>
            <li>Aumento en medidas de bienestar emocional</li>
          </ul>
          
          <li><strong>Cualitativos:</strong></li>
          <ul>
            <li>Mayor vocabulario emocional</li>
            <li>Mejor expresión de emociones</li>
            <li>Relaciones interpersonales más satisfactorias</li>
            <li>Manejo más efectivo del estrés</li>
          </ul>
        </ul>
        
        <h3>10.2 Relación entre IE y Resultados de Tratamiento</h3>
        <p>Estudios han demostrado que la mejora en IE se asocia con:</p>
        <ul>
          <li>Mayor retención en tratamiento</li>
          <li>Reducción en tasas de recaída</li>
          <li>Mejora en calidad de vida</li>
          <li>Mejor funcionamiento social y laboral</li>
          <li>Reducción de síntomas de ansiedad y depresión</li>
        </ul>
        
        <h2>11. INTEGRACIÓN CON OTROS ENFOQUES</h2>
        
        <h3>11.1 IE y Terapia Cognitivo-Conductual</h3>
        <ul>
          <li>Identificación de pensamientos automáticos emocionales</li>
          <li>Reestructuración de creencias sobre emociones</li>
          <li>Desarrollo de estrategias de afrontamiento emocional</li>
          <li>Prevención de recaídas basada en manejo emocional</li>
        </ul>
        
        <h3>11.2 IE y Mindfulness</h3>
        <ul>
          <li>Conciencia presente de estados emocionales</li>
          <li>Aceptación no juiciosa de emociones</li>
          <li>Observación de patrones emocionales</li>
          <li>Regulación emocional a través de la atención plena</li>
        </ul>
        
        <h3>11.3 IE y Terapia Dialéctica Conductual</h3>
        <ul>
          <li>Módulo específico de regulación emocional</li>
          <li>Habilidades de tolerancia al malestar</li>
          <li>Efectividad interpersonal</li>
          <li>Mindfulness emocional</li>
        </ul>
        
        <h2>CONCLUSIONES</h2>
        <p>La inteligencia emocional es un componente fundamental en el tratamiento de adicciones. Los déficits en IE no solo contribuyen al desarrollo y mantenimiento de las adicciones, sino que también pueden obstaculizar la recuperación.</p>
        
        <p>El desarrollo sistemático de habilidades de inteligencia emocional a través de programas estructurados puede mejorar significativamente los resultados del tratamiento y la calidad de vida de las personas en recuperación.</p>
        
        <p>La integración de enfoques de IE con otras modalidades terapéuticas ofrece un marco comprehensivo para abordar las complejidades emocionales inherentes a los trastornos por uso de sustancias.</p>
      </div>
    `
  }
};

async function expandRemainingLessons() {
  console.log('🚀 Iniciando expansión de lecciones restantes (6, 7, 9)...');
  
  try {
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (cursoError || !curso) {
      throw new Error('No se encontró el curso');
    }
    
    console.log(`✅ Curso encontrado: ${curso.titulo}`);
    
    // Procesar cada lección restante
    for (const [lessonNumber, lessonData] of Object.entries(remainingLessonsContent)) {
      console.log(`\n📝 Procesando lección ${lessonNumber}: ${lessonData.title}`);
      
      // Actualizar contenido en la base de datos
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({
          contenido_html: lessonData.content
        })
        .eq('curso_id', curso.id)
        .eq('orden', parseInt(lessonNumber));
      
      if (updateError) {
        console.error(`❌ Error actualizando lección ${lessonNumber}:`, updateError);
        continue;
      }
      
      console.log(`✅ Lección ${lessonNumber} actualizada exitosamente`);
      console.log(`   Contenido: ${lessonData.content.length} caracteres`);
    }
    
    console.log('\n🎉 Expansión de lecciones completada!');
    
    // Verificar el estado final de todas las lecciones
    console.log('\n📊 Estado final de las lecciones:');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('orden, titulo, contenido_html')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error obteniendo lecciones:', leccionesError);
      return;
    }
    
    lecciones.forEach(leccion => {
      const contentLength = leccion.contenido_html ? leccion.contenido_html.length : 0;
      const status = contentLength > 5000 ? '✅ Completo' : 
                    contentLength > 1000 ? '⚠️ Moderado' : '❌ Insuficiente';
      console.log(`   Lección ${leccion.orden}: ${leccion.titulo} - ${contentLength} caracteres ${status}`);
    });
    
  } catch (error) {
    console.error('❌ Error en la expansión:', error);
  }
}

// Ejecutar la función
expandRemainingLessons();