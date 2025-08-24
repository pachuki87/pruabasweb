import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de lecciones con contenido educativo expandido
const lessonContent = {
  2: {
    title: 'TERAPIA COGNITIVA DROGODEPENDENCIAS',
    content: `
      <div class="lesson-content">
        <h1>TERAPIA COGNITIVA EN DROGODEPENDENCIAS</h1>
        
        <h2>1. INTRODUCCIÓN A LA TERAPIA COGNITIVA</h2>
        <p>La terapia cognitiva en el tratamiento de las drogodependencias se basa en la premisa de que los pensamientos, emociones y comportamientos están interconectados. Los patrones de pensamiento disfuncionales pueden contribuir al mantenimiento del consumo de sustancias.</p>
        
        <h3>Principios Fundamentales:</h3>
        <ul>
          <li><strong>Identificación de pensamientos automáticos:</strong> Reconocer los pensamientos que preceden al consumo</li>
          <li><strong>Reestructuración cognitiva:</strong> Modificar patrones de pensamiento disfuncionales</li>
          <li><strong>Desarrollo de habilidades de afrontamiento:</strong> Estrategias para manejar situaciones de riesgo</li>
          <li><strong>Prevención de recaídas:</strong> Identificar y manejar situaciones de alto riesgo</li>
        </ul>
        
        <h2>2. TÉCNICAS COGNITIVAS ESPECÍFICAS</h2>
        
        <h3>2.1 Registro de Pensamientos Disfuncionales</h3>
        <p>Esta técnica permite identificar y analizar los pensamientos automáticos que llevan al consumo:</p>
        <ul>
          <li>Situación desencadenante</li>
          <li>Pensamiento automático</li>
          <li>Emoción resultante</li>
          <li>Comportamiento (consumo)</li>
          <li>Pensamiento alternativo</li>
        </ul>
        
        <h3>2.2 Cuestionamiento Socrático</h3>
        <p>Preguntas que ayudan al paciente a examinar sus creencias:</p>
        <ul>
          <li>¿Qué evidencia tengo de que este pensamiento es cierto?</li>
          <li>¿Hay alguna evidencia en contra?</li>
          <li>¿Qué le diría a un amigo en esta situación?</li>
          <li>¿Cuál es la peor cosa que podría pasar?</li>
        </ul>
        
        <h3>2.3 Técnicas de Distracción Cognitiva</h3>
        <p>Estrategias para interrumpir pensamientos relacionados con el consumo:</p>
        <ul>
          <li>Técnica de parada de pensamiento</li>
          <li>Actividades de concentración</li>
          <li>Ejercicios de mindfulness</li>
          <li>Visualización positiva</li>
        </ul>
        
        <h2>3. APLICACIÓN EN DIFERENTES SUSTANCIAS</h2>
        
        <h3>3.1 Alcohol</h3>
        <p>Pensamientos comunes: "Necesito beber para relajarme", "No puedo divertirme sin alcohol"</p>
        <p>Estrategias específicas: Identificar situaciones sociales de riesgo, desarrollar habilidades sociales alternativas</p>
        
        <h3>3.2 Cocaína</h3>
        <p>Pensamientos comunes: "Necesito cocaína para rendir en el trabajo", "Me ayuda a ser más sociable"</p>
        <p>Estrategias específicas: Manejo del estrés laboral, técnicas de relajación</p>
        
        <h3>3.3 Cannabis</h3>
        <p>Pensamientos comunes: "El cannabis me ayuda a dormir", "Me calma la ansiedad"</p>
        <p>Estrategias específicas: Higiene del sueño, técnicas de manejo de ansiedad</p>
        
        <h2>4. PLAN DE TRATAMIENTO COGNITIVO</h2>
        
        <h3>Fase 1: Evaluación y Psicoeducación (Sesiones 1-4)</h3>
        <ul>
          <li>Evaluación de patrones de consumo</li>
          <li>Identificación de pensamientos automáticos</li>
          <li>Psicoeducación sobre el modelo cognitivo</li>
          <li>Establecimiento de objetivos</li>
        </ul>
        
        <h3>Fase 2: Intervención Activa (Sesiones 5-12)</h3>
        <ul>
          <li>Reestructuración cognitiva</li>
          <li>Desarrollo de habilidades de afrontamiento</li>
          <li>Práctica de técnicas en situaciones reales</li>
          <li>Manejo de situaciones de alto riesgo</li>
        </ul>
        
        <h3>Fase 3: Consolidación y Prevención (Sesiones 13-16)</h3>
        <ul>
          <li>Consolidación de aprendizajes</li>
          <li>Plan de prevención de recaídas</li>
          <li>Preparación para el alta</li>
          <li>Seguimiento a largo plazo</li>
        </ul>
        
        <h2>5. CASOS CLÍNICOS PRÁCTICOS</h2>
        
        <h3>Caso 1: María, 35 años, dependencia al alcohol</h3>
        <p><strong>Pensamiento automático:</strong> "Después del trabajo necesito una copa para relajarme"</p>
        <p><strong>Intervención:</strong> Identificar alternativas de relajación, cuestionar la necesidad del alcohol</p>
        <p><strong>Resultado:</strong> Desarrollo de rutina de ejercicio y técnicas de respiración</p>
        
        <h3>Caso 2: Carlos, 28 años, dependencia a la cocaína</h3>
        <p><strong>Pensamiento automático:</strong> "Sin cocaína no puedo rendir en las reuniones importantes"</p>
        <p><strong>Intervención:</strong> Técnicas de manejo de ansiedad, preparación específica para reuniones</p>
        <p><strong>Resultado:</strong> Mejora en la confianza y rendimiento laboral sin sustancias</p>
        
        <h2>6. EVALUACIÓN DE RESULTADOS</h2>
        
        <h3>Indicadores de Éxito:</h3>
        <ul>
          <li>Reducción en la frecuencia de pensamientos automáticos relacionados con el consumo</li>
          <li>Aumento en el uso de estrategias de afrontamiento alternativas</li>
          <li>Mejora en la autoeficacia percibida</li>
          <li>Reducción o eliminación del consumo de sustancias</li>
          <li>Mejora en el funcionamiento social, laboral y familiar</li>
        </ul>
        
        <h3>Instrumentos de Evaluación:</h3>
        <ul>
          <li>Cuestionario de Pensamientos Automáticos (ATQ)</li>
          <li>Escala de Autoeficacia para la Abstinencia</li>
          <li>Inventario de Situaciones de Consumo</li>
          <li>Registro diario de pensamientos y comportamientos</li>
        </ul>
        
        <h2>CONCLUSIONES</h2>
        <p>La terapia cognitiva ha demostrado ser una intervención eficaz en el tratamiento de las drogodependencias. Su enfoque en la modificación de patrones de pensamiento disfuncionales proporciona a los pacientes herramientas prácticas para mantener la abstinencia y mejorar su calidad de vida.</p>
        
        <p>La combinación de técnicas cognitivas con estrategias conductuales y el apoyo social constituye un enfoque integral que maximiza las posibilidades de éxito en el tratamiento de las adicciones.</p>
      </div>
    `
  },
  3: {
    title: 'FAMILIA Y TRABAJO EQUIPO',
    content: `
      <div class="lesson-content">
        <h1>FAMILIA Y TRABAJO EN EQUIPO EN ADICCIONES</h1>
        
        <h2>1. LA FAMILIA COMO SISTEMA</h2>
        <p>La familia es un sistema complejo donde las adicciones afectan a todos sus miembros. Comprender la dinámica familiar es esencial para un tratamiento integral.</p>
        
        <h3>Características del Sistema Familiar:</h3>
        <ul>
          <li><strong>Interdependencia:</strong> Los cambios en un miembro afectan a todo el sistema</li>
          <li><strong>Homeostasis:</strong> Tendencia a mantener el equilibrio, incluso disfuncional</li>
          <li><strong>Roles familiares:</strong> Cada miembro adopta roles específicos para mantener la estabilidad</li>
          <li><strong>Comunicación:</strong> Patrones de comunicación que pueden facilitar o dificultar la recuperación</li>
        </ul>
        
        <h2>2. IMPACTO DE LAS ADICCIONES EN LA FAMILIA</h2>
        
        <h3>2.1 Efectos Emocionales</h3>
        <ul>
          <li>Ansiedad y estrés constante</li>
          <li>Sentimientos de culpa y vergüenza</li>
          <li>Ira y resentimiento</li>
          <li>Desesperanza y depresión</li>
          <li>Miedo y preocupación constante</li>
        </ul>
        
        <h3>2.2 Efectos Conductuales</h3>
        <ul>
          <li>Codependencia</li>
          <li>Comportamientos de control</li>
          <li>Aislamiento social</li>
          <li>Negación del problema</li>
          <li>Comportamientos de rescate</li>
        </ul>
        
        <h3>2.3 Efectos en la Estructura Familiar</h3>
        <ul>
          <li>Alteración de roles familiares</li>
          <li>Pérdida de límites apropiados</li>
          <li>Comunicación disfuncional</li>
          <li>Conflictos constantes</li>
          <li>Deterioro de la confianza</li>
        </ul>
        
        <h2>3. ROLES FAMILIARES EN LA ADICCIÓN</h2>
        
        <h3>3.1 El Adicto</h3>
        <p>Centro del sistema familiar disfuncional, alrededor del cual gira la dinámica familiar.</p>
        
        <h3>3.2 El Facilitador/Codependiente</h3>
        <p>Usualmente la pareja o padre/madre que:</p>
        <ul>
          <li>Asume responsabilidades del adicto</li>
          <li>Minimiza las consecuencias del consumo</li>
          <li>Proporciona excusas y justificaciones</li>
          <li>Mantiene el secreto familiar</li>
        </ul>
        
        <h3>3.3 El Héroe Familiar</h3>
        <p>Generalmente el hijo mayor que:</p>
        <ul>
          <li>Asume responsabilidades de adulto prematuramente</li>
          <li>Busca la perfección para compensar el caos familiar</li>
          <li>Proporciona una imagen positiva de la familia</li>
          <li>Sacrifica sus propias necesidades</li>
        </ul>
        
        <h3>3.4 La Oveja Negra</h3>
        <p>Miembro que actúa de forma problemática:</p>
        <ul>
          <li>Desvía la atención del problema principal</li>
          <li>Expresa la ira familiar de forma indirecta</li>
          <li>Puede desarrollar sus propios problemas de conducta</li>
        </ul>
        
        <h3>3.5 El Niño Perdido</h3>
        <p>Se caracteriza por:</p>
        <ul>
          <li>Aislamiento y retraimiento</li>
          <li>Evita conflictos familiares</li>
          <li>Pasa desapercibido</li>
          <li>Puede desarrollar problemas de autoestima</li>
        </ul>
        
        <h3>3.6 La Mascota</h3>
        <p>Utiliza el humor para:</p>
        <ul>
          <li>Aliviar la tensión familiar</li>
          <li>Distraer de los problemas serios</li>
          <li>Mantener un ambiente "ligero"</li>
          <li>Evitar confrontaciones</li>
        </ul>
        
        <h2>4. INTERVENCIÓN FAMILIAR</h2>
        
        <h3>4.1 Evaluación Familiar</h3>
        <p>Proceso sistemático para entender:</p>
        <ul>
          <li>Historia familiar de adicciones</li>
          <li>Patrones de comunicación</li>
          <li>Roles y dinámicas familiares</li>
          <li>Recursos y fortalezas familiares</li>
          <li>Nivel de motivación para el cambio</li>
        </ul>
        
        <h3>4.2 Psicoeducación Familiar</h3>
        <p>Educación sobre:</p>
        <ul>
          <li>Naturaleza de la adicción como enfermedad</li>
          <li>Dinámicas familiares disfuncionales</li>
          <li>Codependencia y sus manifestaciones</li>
          <li>Proceso de recuperación</li>
          <li>Importancia del autocuidado</li>
        </ul>
        
        <h3>4.3 Terapia Familiar Sistémica</h3>
        <p>Enfoque que incluye:</p>
        <ul>
          <li>Identificación de patrones disfuncionales</li>
          <li>Reestructuración de la comunicación</li>
          <li>Establecimiento de límites saludables</li>
          <li>Desarrollo de nuevos roles familiares</li>
          <li>Fortalecimiento de la cohesión familiar</li>
        </ul>
        
        <h2>5. TRABAJO EN EQUIPO MULTIDISCIPLINARIO</h2>
        
        <h3>5.1 Composición del Equipo</h3>
        <ul>
          <li><strong>Médico Psiquiatra:</strong> Evaluación y tratamiento médico</li>
          <li><strong>Psicólogo Clínico:</strong> Terapia individual y familiar</li>
          <li><strong>Trabajador Social:</strong> Intervención familiar y comunitaria</li>
          <li><strong>Terapeuta Familiar:</strong> Especialista en dinámicas familiares</li>
          <li><strong>Consejero en Adicciones:</strong> Experiencia específica en adicciones</li>
          <li><strong>Enfermero Especializado:</strong> Cuidados de salud y seguimiento</li>
        </ul>
        
        <h3>5.2 Funciones del Equipo</h3>
        <ul>
          <li>Evaluación integral del caso</li>
          <li>Desarrollo de plan de tratamiento conjunto</li>
          <li>Coordinación de intervenciones</li>
          <li>Seguimiento y evaluación continua</li>
          <li>Apoyo mutuo entre profesionales</li>
        </ul>
        
        <h3>5.3 Comunicación Efectiva en el Equipo</h3>
        <ul>
          <li>Reuniones regulares de equipo</li>
          <li>Documentación compartida</li>
          <li>Protocolos de comunicación claros</li>
          <li>Respeto por las diferentes perspectivas profesionales</li>
          <li>Resolución constructiva de conflictos</li>
        </ul>
        
        <h2>6. ESTRATEGIAS DE INTERVENCIÓN FAMILIAR</h2>
        
        <h3>6.1 Técnicas de Comunicación</h3>
        <ul>
          <li><strong>Escucha activa:</strong> Prestar atención completa al mensaje</li>
          <li><strong>Comunicación asertiva:</strong> Expresar necesidades sin agresividad</li>
          <li><strong>Técnicas de "yo":</strong> Expresar sentimientos sin culpar</li>
          <li><strong>Validación emocional:</strong> Reconocer y aceptar emociones</li>
        </ul>
        
        <h3>6.2 Establecimiento de Límites</h3>
        <ul>
          <li>Identificar comportamientos inaceptables</li>
          <li>Establecer consecuencias claras</li>
          <li>Mantener consistencia en la aplicación</li>
          <li>Distinguir entre ayuda y facilitación</li>
        </ul>
        
        <h3>6.3 Desarrollo de Habilidades de Afrontamiento</h3>
        <ul>
          <li>Técnicas de manejo del estrés</li>
          <li>Estrategias de resolución de problemas</li>
          <li>Habilidades de regulación emocional</li>
          <li>Técnicas de relajación y mindfulness</li>
        </ul>
        
        <h2>7. GRUPOS DE APOYO FAMILIAR</h2>
        
        <h3>7.1 Al-Anon y Nar-Anon</h3>
        <p>Programas de 12 pasos para familiares que ofrecen:</p>
        <ul>
          <li>Apoyo emocional de pares</li>
          <li>Herramientas para el autocuidado</li>
          <li>Comprensión de la codependencia</li>
          <li>Estrategias de desapego amoroso</li>
        </ul>
        
        <h3>7.2 Grupos Psicoeducativos</h3>
        <ul>
          <li>Educación sobre adicciones</li>
          <li>Desarrollo de habilidades específicas</li>
          <li>Intercambio de experiencias</li>
          <li>Apoyo mutuo estructurado</li>
        </ul>
        
        <h2>8. CASOS CLÍNICOS</h2>
        
        <h3>Caso 1: Familia González</h3>
        <p><strong>Situación:</strong> Hijo de 25 años con adicción a la cocaína, madre codependiente, padre ausente emocionalmente</p>
        <p><strong>Intervención:</strong> Terapia familiar sistémica, grupo de apoyo para la madre, terapia individual para el padre</p>
        <p><strong>Resultado:</strong> Mejora en la comunicación familiar, establecimiento de límites saludables</p>
        
        <h3>Caso 2: Familia Martínez</h3>
        <p><strong>Situación:</strong> Padre alcohólico, esposa facilitadora, dos hijos adolescentes con problemas conductuales</p>
        <p><strong>Intervención:</strong> Intervención familiar, terapia de pareja, apoyo individual para los hijos</p>
        <p><strong>Resultado:</strong> Padre en tratamiento, mejora en la dinámica familiar</p>
        
        <h2>CONCLUSIONES</h2>
        <p>El trabajo con familias en el contexto de las adicciones requiere un enfoque integral que considere la complejidad de las dinámicas familiares. La colaboración multidisciplinaria y el trabajo en equipo son fundamentales para lograr resultados exitosos.</p>
        
        <p>La recuperación no es solo un proceso individual, sino familiar, que requiere el compromiso y la participación activa de todos los miembros del sistema familiar.</p>
      </div>
    `
  },
  4: {
    title: 'RECOVERY COACHING',
    content: `
      <div class="lesson-content">
        <h1>RECOVERY COACHING EN ADICCIONES</h1>
        
        <h2>1. INTRODUCCIÓN AL RECOVERY COACHING</h2>
        <p>El Recovery Coaching es un enfoque innovador en el tratamiento de adicciones que se centra en empoderar a las personas en su proceso de recuperación a través del apoyo, la motivación y el desarrollo de habilidades para la vida.</p>
        
        <h3>Definición:</h3>
        <p>Un Recovery Coach es un profesional capacitado que proporciona apoyo no clínico, orientación y recursos a personas que buscan recuperarse de trastornos por uso de sustancias.</p>
        
        <h3>Principios Fundamentales:</h3>
        <ul>
          <li><strong>Esperanza:</strong> Creer en la capacidad de recuperación de cada persona</li>
          <li><strong>Autodeterminación:</strong> Respetar la autonomía y las decisiones del cliente</li>
          <li><strong>Fortalezas:</strong> Enfocarse en las capacidades y recursos existentes</li>
          <li><strong>Inclusión:</strong> Crear un ambiente acogedor y sin juicios</li>
          <li><strong>Responsabilidad:</strong> Fomentar la responsabilidad personal</li>
        </ul>
        
        <h2>2. DIFERENCIAS CON OTROS ENFOQUES</h2>
        
        <h3>2.1 Recovery Coach vs. Terapeuta</h3>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Recovery Coach</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Terapeuta</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Enfoque en fortalezas y recursos</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Enfoque en patología y síntomas</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Apoyo práctico y cotidiano</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Tratamiento clínico especializado</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Relación horizontal</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Relación jerárquica</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Experiencia vivida valorada</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Formación académica especializada</td>
          </tr>
        </table>
        
        <h3>2.2 Recovery Coach vs. Consejero en Adicciones</h3>
        <ul>
          <li><strong>Duración:</strong> El coaching puede ser a largo plazo, el consejo suele ser más breve</li>
          <li><strong>Ubicación:</strong> El coaching puede ocurrir en la comunidad, no solo en oficinas</li>
          <li><strong>Enfoque:</strong> El coaching se centra más en objetivos de vida que en síntomas</li>
          <li><strong>Flexibilidad:</strong> El coaching es más flexible en horarios y métodos</li>
        </ul>
        
        <h2>3. COMPETENCIAS DEL RECOVERY COACH</h2>
        
        <h3>3.1 Competencias Básicas</h3>
        <ul>
          <li><strong>Escucha activa:</strong> Capacidad de escuchar sin juzgar</li>
          <li><strong>Empatía:</strong> Comprensión profunda de la experiencia del cliente</li>
          <li><strong>Comunicación efectiva:</strong> Habilidades verbales y no verbales</li>
          <li><strong>Motivación:</strong> Capacidad de inspirar y mantener la esperanza</li>
          <li><strong>Flexibilidad:</strong> Adaptación a diferentes necesidades y situaciones</li>
        </ul>
        
        <h3>3.2 Competencias Específicas</h3>
        <ul>
          <li><strong>Conocimiento de recursos:</strong> Familiaridad con servicios comunitarios</li>
          <li><strong>Planificación de objetivos:</strong> Ayudar a establecer metas realistas</li>
          <li><strong>Resolución de problemas:</strong> Asistir en la toma de decisiones</li>
          <li><strong>Manejo de crisis:</strong> Respuesta apropiada en situaciones difíciles</li>
          <li><strong>Advocacy:</strong> Defensa de los derechos del cliente</li>
        </ul>
        
        <h2>4. PROCESO DE RECOVERY COACHING</h2>
        
        <h3>4.1 Fase de Engagement (Compromiso)</h3>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Establecer rapport y confianza</li>
          <li>Evaluar necesidades y fortalezas</li>
          <li>Clarificar expectativas</li>
          <li>Desarrollar acuerdo de coaching</li>
        </ul>
        
        <p><strong>Actividades:</strong></p>
        <ul>
          <li>Entrevista inicial estructurada</li>
          <li>Evaluación de fortalezas y recursos</li>
          <li>Identificación de barreras</li>
          <li>Establecimiento de límites y expectativas</li>
        </ul>
        
        <h3>4.2 Fase de Planificación</h3>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Desarrollar plan de recuperación personalizado</li>
          <li>Establecer objetivos SMART</li>
          <li>Identificar recursos necesarios</li>
          <li>Crear estrategias de afrontamiento</li>
        </ul>
        
        <p><strong>Herramientas:</strong></p>
        <ul>
          <li>Plan de recuperación personalizado</li>
          <li>Matriz de objetivos y acciones</li>
          <li>Mapa de recursos comunitarios</li>
          <li>Plan de prevención de recaídas</li>
        </ul>
        
        <h3>4.3 Fase de Implementación</h3>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Ejecutar el plan de recuperación</li>
          <li>Proporcionar apoyo continuo</li>
          <li>Monitorear progreso</li>
          <li>Ajustar estrategias según necesidad</li>
        </ul>
        
        <p><strong>Actividades:</strong></p>
        <ul>
          <li>Reuniones regulares de seguimiento</li>
          <li>Acompañamiento a citas y servicios</li>
          <li>Práctica de habilidades</li>
          <li>Resolución de obstáculos</li>
        </ul>
        
        <h3>4.4 Fase de Mantenimiento</h3>
        <p><strong>Objetivos:</strong></p>
        <ul>
          <li>Consolidar logros obtenidos</li>
          <li>Desarrollar independencia</li>
          <li>Preparar para transición</li>
          <li>Establecer red de apoyo sostenible</li>
        </ul>
        
        <h2>5. HERRAMIENTAS Y TÉCNICAS</h2>
        
        <h3>5.1 Entrevista Motivacional</h3>
        <p>Técnicas para explorar y resolver ambivalencia:</p>
        <ul>
          <li><strong>Preguntas abiertas:</strong> Facilitar la reflexión</li>
          <li><strong>Escucha reflexiva:</strong> Demostrar comprensión</li>
          <li><strong>Afirmaciones:</strong> Reconocer fortalezas</li>
          <li><strong>Resúmenes:</strong> Consolidar información</li>
        </ul>
        
        <h3>5.2 Planificación de Objetivos SMART</h3>
        <ul>
          <li><strong>Específicos:</strong> Claramente definidos</li>
          <li><strong>Medibles:</strong> Cuantificables</li>
          <li><strong>Alcanzables:</strong> Realistas</li>
          <li><strong>Relevantes:</strong> Significativos para el cliente</li>
          <li><strong>Temporales:</strong> Con plazos definidos</li>
        </ul>
        
        <h3>5.3 Mapeo de Recursos</h3>
        <p>Identificación sistemática de:</p>
        <ul>
          <li>Recursos personales (fortalezas, habilidades)</li>
          <li>Recursos sociales (familia, amigos, comunidad)</li>
          <li>Recursos profesionales (servicios, tratamientos)</li>
          <li>Recursos comunitarios (grupos, organizaciones)</li>
        </ul>
        
        <h3>5.4 Plan de Prevención de Recaídas</h3>
        <ul>
          <li>Identificación de desencadenantes</li>
          <li>Desarrollo de estrategias de afrontamiento</li>
          <li>Creación de red de apoyo</li>
          <li>Plan de acción para situaciones de riesgo</li>
        </ul>
        
        <h2>6. ÁREAS DE INTERVENCIÓN</h2>
        
        <h3>6.1 Vivienda</h3>
        <ul>
          <li>Búsqueda de vivienda estable</li>
          <li>Desarrollo de habilidades domésticas</li>
          <li>Manejo de relaciones con compañeros de vivienda</li>
          <li>Mantenimiento del hogar</li>
        </ul>
        
        <h3>6.2 Empleo y Educación</h3>
        <ul>
          <li>Desarrollo de habilidades laborales</li>
          <li>Búsqueda de empleo</li>
          <li>Mantenimiento del trabajo</li>
          <li>Continuación de estudios</li>
        </ul>
        
        <h3>6.3 Relaciones Sociales</h3>
        <ul>
          <li>Desarrollo de habilidades sociales</li>
          <li>Construcción de relaciones saludables</li>
          <li>Manejo de conflictos</li>
          <li>Participación comunitaria</li>
        </ul>
        
        <h3>6.4 Salud y Bienestar</h3>
        <ul>
          <li>Acceso a servicios de salud</li>
          <li>Adherencia a tratamientos</li>
          <li>Desarrollo de hábitos saludables</li>
          <li>Manejo del estrés</li>
        </ul>
        
        <h2>7. MODELOS DE RECOVERY COACHING</h2>
        
        <h3>7.1 Modelo de Fortalezas</h3>
        <p>Se enfoca en:</p>
        <ul>
          <li>Identificar y desarrollar fortalezas existentes</li>
          <li>Utilizar recursos naturales del cliente</li>
          <li>Promover la autodeterminación</li>
          <li>Fomentar la esperanza y la motivación</li>
        </ul>
        
        <h3>7.2 Modelo de Recuperación</h3>
        <p>Principios clave:</p>
        <ul>
          <li>La recuperación es posible para todos</li>
          <li>Es un proceso personal y único</li>
          <li>Ocurre en el contexto de la vida real</li>
          <li>Requiere apoyo de pares y comunidad</li>
        </ul>
        
        <h3>7.3 Modelo Transteórico del Cambio</h3>
        <p>Etapas del cambio:</p>
        <ul>
          <li><strong>Precontemplación:</strong> No hay conciencia del problema</li>
          <li><strong>Contemplación:</strong> Conciencia pero ambivalencia</li>
          <li><strong>Preparación:</strong> Intención de cambiar</li>
          <li><strong>Acción:</strong> Modificación activa del comportamiento</li>
          <li><strong>Mantenimiento:</strong> Sostenimiento del cambio</li>
        </ul>
        
        <h2>8. CASOS PRÁCTICOS</h2>
        
        <h3>Caso 1: Ana, 32 años</h3>
        <p><strong>Situación:</strong> Recuperándose de adicción a opioides, sin hogar, desempleada</p>
        <p><strong>Objetivos:</strong> Vivienda estable, empleo, mantenimiento de la sobriedad</p>
        <p><strong>Intervenciones:</strong></p>
        <ul>
          <li>Búsqueda de vivienda transitoria</li>
          <li>Desarrollo de habilidades laborales</li>
          <li>Conexión con grupos de apoyo</li>
          <li>Plan de prevención de recaídas</li>
        </ul>
        <p><strong>Resultados:</strong> Vivienda estable obtenida, empleo de medio tiempo, 8 meses de sobriedad</p>
        
        <h3>Caso 2: Miguel, 45 años</h3>
        <p><strong>Situación:</strong> Alcoholismo, problemas familiares, riesgo de perder empleo</p>
        <p><strong>Objetivos:</strong> Mantener sobriedad, reparar relaciones familiares, conservar empleo</p>
        <p><strong>Intervenciones:</strong></p>
        <ul>
          <li>Participación en AA</li>
          <li>Terapia familiar</li>
          <li>Comunicación con empleador</li>
          <li>Desarrollo de estrategias de afrontamiento</li>
        </ul>
        <p><strong>Resultados:</strong> 6 meses de sobriedad, mejora en relaciones familiares, empleo conservado</p>
        
        <h2>9. EVALUACIÓN Y MEDICIÓN DE RESULTADOS</h2>
        
        <h3>9.1 Indicadores de Proceso</h3>
        <ul>
          <li>Número de sesiones completadas</li>
          <li>Nivel de engagement del cliente</li>
          <li>Cumplimiento de objetivos intermedios</li>
          <li>Utilización de recursos</li>
        </ul>
        
        <h3>9.2 Indicadores de Resultado</h3>
        <ul>
          <li>Tiempo de abstinencia mantenida</li>
          <li>Mejora en calidad de vida</li>
          <li>Estabilidad en vivienda y empleo</li>
          <li>Fortalecimiento de relaciones sociales</li>
          <li>Reducción de recaídas</li>
        </ul>
        
        <h3>9.3 Herramientas de Evaluación</h3>
        <ul>
          <li>Escala de Calidad de Vida</li>
          <li>Inventario de Fortalezas Personales</li>
          <li>Medida de Funcionamiento Social</li>
          <li>Evaluación de Satisfacción del Cliente</li>
        </ul>
        
        <h2>CONCLUSIONES</h2>
        <p>El Recovery Coaching representa un enfoque innovador y efectivo en el tratamiento de adicciones, complementando los servicios clínicos tradicionales con apoyo práctico y centrado en fortalezas.</p>
        
        <p>Su efectividad radica en la relación colaborativa, el enfoque en la persona completa y la creencia fundamental en la capacidad de recuperación de cada individuo.</p>
      </div>
    `
  }
};

async function expandLessonContent() {
  console.log('🚀 Iniciando expansión de contenido de lecciones...');
  
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
    
    // Procesar cada lección con contenido expandido
    for (const [lessonNumber, lessonData] of Object.entries(lessonContent)) {
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
    
    console.log('\n🎉 Expansión de contenido completada exitosamente!');
    
    // Verificar resultados
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('orden, titulo, contenido_html')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (!leccionesError && lecciones) {
      console.log('\n📊 RESUMEN FINAL:');
      lecciones.forEach(leccion => {
        const contentLength = leccion.contenido_html ? leccion.contenido_html.length : 0;
        const status = contentLength > 3000 ? '✅ CONTENIDO EXTENSO' : 
                      contentLength > 1000 ? '🟡 CONTENIDO MODERADO' : 
                      '⚠️ CONTENIDO INSUFICIENTE';
        console.log(`  Lección ${leccion.orden}: ${leccion.titulo}`);
        console.log(`    ${status} (${contentLength} caracteres)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error durante la expansión:', error.message);
    process.exit(1);
  }
}

expandLessonContent();