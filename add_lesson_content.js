import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CURSO_INTELIGENCIA_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Contenido educativo para cada lección
const contenidoLecciones = {
  'Fundamentos Proceso Terapéutico': {
    contenido_html: `
      <h2>Fundamentos del Proceso Terapéutico</h2>
      <p>Esta lección introduce los conceptos fundamentales del proceso terapéutico en el contexto del tratamiento de adicciones, estableciendo las bases para la aplicación de la inteligencia emocional.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Comprender los fundamentos del proceso terapéutico</li>
        <li>Identificar las etapas del tratamiento de adicciones</li>
        <li>Reconocer la importancia de la inteligencia emocional en terapia</li>
        <li>Aplicar técnicas básicas de evaluación emocional</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Bases del Proceso Terapéutico</h4>
      <p>El proceso terapéutico en adicciones requiere un enfoque integral que considere los aspectos emocionales, cognitivos y conductuales del paciente. La inteligencia emocional se convierte en una herramienta fundamental para:</p>
      <ul>
        <li>Establecer una relación terapéutica sólida</li>
        <li>Facilitar la autoconciencia del paciente</li>
        <li>Desarrollar estrategias de autorregulación</li>
        <li>Mejorar las habilidades sociales y de comunicación</li>
      </ul>
      
      <h4>2. Modelo MATRIX</h4>
      <p>El modelo MATRIX es un enfoque terapéutico intensivo que combina diferentes modalidades de tratamiento. Sus componentes principales incluyen:</p>
      <ol>
        <li><strong>Terapia individual:</strong> Sesiones personalizadas enfocadas en necesidades específicas</li>
        <li><strong>Terapia grupal:</strong> Desarrollo de habilidades sociales y apoyo mutuo</li>
        <li><strong>Educación sobre adicciones:</strong> Comprensión de la naturaleza de la adicción</li>
        <li><strong>Prevención de recaídas:</strong> Estrategias para mantener la sobriedad</li>
      </ol>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Autoevaluación Emocional</h4>
        <p>Realiza una evaluación de tu estado emocional actual utilizando la escala de emociones básicas. Identifica patrones y triggers emocionales.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Análisis de Caso</h4>
        <p>Analiza un caso clínico aplicando los principios del modelo MATRIX y la inteligencia emocional.</p>
      </div>
    `,
    duracion_estimada: 90
  },
  
  'Terapia Cognitiva en Drogodependencias': {
    contenido_html: `
      <h2>Terapia Cognitiva en Drogodependencias</h2>
      <p>La terapia cognitiva aplicada al tratamiento de drogodependencias se centra en identificar y modificar los patrones de pensamiento disfuncionales que contribuyen al consumo de sustancias.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Comprender los principios de la terapia cognitiva en adicciones</li>
        <li>Identificar pensamientos automáticos y distorsiones cognitivas</li>
        <li>Aplicar técnicas de reestructuración cognitiva</li>
        <li>Integrar la inteligencia emocional en el proceso cognitivo</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Fundamentos de la Terapia Cognitiva</h4>
      <p>La terapia cognitiva se basa en la premisa de que nuestros pensamientos influyen directamente en nuestras emociones y comportamientos. En el contexto de las adicciones:</p>
      <ul>
        <li>Los pensamientos automáticos negativos pueden desencadenar el consumo</li>
        <li>Las distorsiones cognitivas mantienen el ciclo adictivo</li>
        <li>La reestructuración cognitiva puede romper estos patrones</li>
      </ul>
      
      <h4>2. Distorsiones Cognitivas Comunes en Adicciones</h4>
      <ol>
        <li><strong>Pensamiento todo o nada:</strong> "Si consumo una vez, ya fracasé completamente"</li>
        <li><strong>Catastrofización:</strong> "No podré soportar la ansiedad sin consumir"</li>
        <li><strong>Minimización:</strong> "Solo fue una vez, no es tan grave"</li>
        <li><strong>Personalización:</strong> "Es mi culpa que mi familia esté sufriendo"</li>
      </ol>
      
      <h4>3. Técnicas de Intervención</h4>
      <ul>
        <li><strong>Registro de pensamientos:</strong> Identificación de patrones cognitivos</li>
        <li><strong>Cuestionamiento socrático:</strong> Desafío de pensamientos irracionales</li>
        <li><strong>Experimentos conductuales:</strong> Prueba de creencias disfuncionales</li>
        <li><strong>Reestructuración cognitiva:</strong> Desarrollo de pensamientos alternativos</li>
      </ul>
      
      <h3>Integración con Inteligencia Emocional:</h3>
      <p>La combinación de terapia cognitiva e inteligencia emocional potencia los resultados terapéuticos:</p>
      <ul>
        <li>Mayor autoconciencia de pensamientos y emociones</li>
        <li>Mejor regulación emocional durante el proceso de cambio</li>
        <li>Desarrollo de empatía hacia uno mismo y otros</li>
        <li>Mejores habilidades sociales para el apoyo en recuperación</li>
      </ul>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Registro de Pensamientos Automáticos</h4>
        <p>Durante una semana, registra situaciones desencadenantes, pensamientos automáticos, emociones y comportamientos resultantes.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Reestructuración Cognitiva</h4>
        <p>Toma tres pensamientos automáticos negativos identificados y desarrolla pensamientos alternativos más equilibrados y realistas.</p>
      </div>
    `,
    duracion_estimada: 120
  },
  
  'Familia y Trabajo en Equipo': {
    contenido_html: `
      <h2>Familia y Trabajo en Equipo</h2>
      <p>La familia juega un papel crucial en el proceso de recuperación de adicciones. Esta lección explora cómo integrar a la familia en el tratamiento y desarrollar habilidades de trabajo en equipo.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Comprender el impacto de las adicciones en el sistema familiar</li>
        <li>Desarrollar habilidades de comunicación familiar efectiva</li>
        <li>Aplicar técnicas de trabajo en equipo en el contexto terapéutico</li>
        <li>Utilizar la inteligencia emocional para mejorar las relaciones familiares</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. La Familia como Sistema</h4>
      <p>Las adicciones afectan no solo al individuo, sino a todo el sistema familiar:</p>
      <ul>
        <li><strong>Codependencia:</strong> Patrones de comportamiento que mantienen la adicción</li>
        <li><strong>Roles familiares disfuncionales:</strong> Adaptaciones no saludables al problema</li>
        <li><strong>Comunicación deteriorada:</strong> Pérdida de confianza y diálogo efectivo</li>
        <li><strong>Estrés familiar:</strong> Impacto emocional en todos los miembros</li>
      </ul>
      
      <h4>2. Intervención Familiar</h4>
      <p>Estrategias para involucrar a la familia en el proceso de recuperación:</p>
      <ol>
        <li><strong>Evaluación familiar:</strong> Identificación de dinámicas y patrones</li>
        <li><strong>Psicoeducación:</strong> Información sobre adicciones y recuperación</li>
        <li><strong>Terapia familiar:</strong> Sesiones conjuntas para mejorar la comunicación</li>
        <li><strong>Grupos de apoyo:</strong> Conexión con otras familias en situaciones similares</li>
      </ol>
      
      <h4>3. Trabajo en Equipo Terapéutico</h4>
      <p>La recuperación requiere un enfoque de equipo que incluya:</p>
      <ul>
        <li>Profesionales de la salud mental</li>
        <li>Médicos y personal sanitario</li>
        <li>Trabajadores sociales</li>
        <li>Familia y seres queridos</li>
        <li>Grupos de apoyo y pares en recuperación</li>
      </ul>
      
      <h3>Habilidades de Inteligencia Emocional Familiar:</h3>
      <h4>1. Autoconciencia Familiar</h4>
      <ul>
        <li>Reconocimiento de emociones propias y familiares</li>
        <li>Identificación de patrones emocionales disfuncionales</li>
        <li>Comprensión del impacto emocional de la adicción</li>
      </ul>
      
      <h4>2. Regulación Emocional Familiar</h4>
      <ul>
        <li>Técnicas de manejo del estrés familiar</li>
        <li>Estrategias de comunicación asertiva</li>
        <li>Establecimiento de límites saludables</li>
      </ul>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Genograma Emocional</h4>
        <p>Crea un genograma familiar identificando patrones emocionales y de comunicación a través de las generaciones.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Plan de Comunicación Familiar</h4>
        <p>Desarrolla un plan de comunicación familiar que incluya reglas, tiempos y técnicas para mejorar el diálogo.</p>
      </div>
    `,
    duracion_estimada: 105
  },
  
  'Recovery Coaching': {
    contenido_html: `
      <h2>Recovery Coaching</h2>
      <p>El Recovery Coaching es un enfoque centrado en la persona que apoya a individuos en su proceso de recuperación de adicciones, utilizando principios de inteligencia emocional y empoderamiento personal.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Comprender los principios fundamentales del Recovery Coaching</li>
        <li>Desarrollar habilidades de coaching aplicadas a la recuperación</li>
        <li>Integrar la inteligencia emocional en el proceso de coaching</li>
        <li>Aplicar técnicas de motivación y empoderamiento</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Fundamentos del Recovery Coaching</h4>
      <p>El Recovery Coaching se diferencia de la terapia tradicional en varios aspectos:</p>
      <ul>
        <li><strong>Enfoque en fortalezas:</strong> Se centra en las capacidades y recursos del cliente</li>
        <li><strong>Orientación al futuro:</strong> Foco en objetivos y aspiraciones</li>
        <li><strong>Relación colaborativa:</strong> El coach y el cliente trabajan como socios</li>
        <li><strong>Empoderamiento:</strong> Desarrollo de la autonomía y autoeficacia</li>
      </ul>
      
      <h4>2. Competencias del Recovery Coach</h4>
      <ol>
        <li><strong>Escucha activa:</strong> Habilidad para escuchar con atención plena</li>
        <li><strong>Preguntas poderosas:</strong> Formulación de preguntas que generen reflexión</li>
        <li><strong>Feedback constructivo:</strong> Retroalimentación que promueva el crecimiento</li>
        <li><strong>Establecimiento de objetivos:</strong> Ayuda en la definición de metas claras</li>
        <li><strong>Planificación de acciones:</strong> Desarrollo de planes concretos y realizables</li>
      </ol>
      
      <h4>3. Proceso de Coaching en Recuperación</h4>
      <p>El proceso típico incluye las siguientes fases:</p>
      <ol>
        <li><strong>Establecimiento de la relación:</strong> Construcción de confianza y rapport</li>
        <li><strong>Evaluación de la situación actual:</strong> Comprensión del punto de partida</li>
        <li><strong>Definición de objetivos:</strong> Establecimiento de metas específicas</li>
        <li><strong>Desarrollo del plan de acción:</strong> Creación de estrategias concretas</li>
        <li><strong>Implementación y seguimiento:</strong> Apoyo en la ejecución del plan</li>
        <li><strong>Evaluación y ajuste:</strong> Revisión y modificación según sea necesario</li>
      </ol>
      
      <h3>Inteligencia Emocional en Recovery Coaching:</h3>
      <h4>1. Autoconciencia del Coach</h4>
      <ul>
        <li>Reconocimiento de propias emociones y reacciones</li>
        <li>Comprensión de sesgos y limitaciones personales</li>
        <li>Manejo de la contratransferencia</li>
      </ul>
      
      <h4>2. Desarrollo de la IE en el Cliente</h4>
      <ul>
        <li>Facilitación del autoconocimiento emocional</li>
        <li>Enseñanza de técnicas de regulación emocional</li>
        <li>Desarrollo de habilidades sociales y empáticas</li>
      </ul>
      
      <h3>Herramientas y Técnicas:</h3>
      <ul>
        <li><strong>Rueda de la vida:</strong> Evaluación de diferentes áreas vitales</li>
        <li><strong>Escala de valores:</strong> Identificación de valores fundamentales</li>
        <li><strong>Mapa de recursos:</strong> Identificación de fortalezas y apoyos</li>
        <li><strong>Plan de prevención de recaídas:</strong> Estrategias específicas de mantenimiento</li>
      </ul>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Práctica de Escucha Activa</h4>
        <p>En parejas, practica técnicas de escucha activa utilizando casos de estudio de recuperación.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Desarrollo de Plan de Coaching</h4>
        <p>Crea un plan de coaching personalizado para un caso específico, incluyendo objetivos, estrategias y métricas de seguimiento.</p>
      </div>
    `,
    duracion_estimada: 135
  },
  
  'Intervención Familiar y Recovery Mentoring': {
    contenido_html: `
      <h2>Intervención Familiar y Recovery Mentoring</h2>
      <p>Esta lección profundiza en las estrategias avanzadas de intervención familiar y el modelo de mentoring en recuperación, integrando principios de inteligencia emocional para maximizar la efectividad del tratamiento.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Dominar técnicas avanzadas de intervención familiar</li>
        <li>Comprender el modelo de Recovery Mentoring</li>
        <li>Desarrollar habilidades de comunicación terapéutica</li>
        <li>Aplicar la inteligencia emocional en contextos familiares complejos</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Intervención Familiar Especializada</h4>
      <p>La intervención familiar en adicciones requiere un enfoque especializado que considere:</p>
      <ul>
        <li><strong>Dinámicas familiares complejas:</strong> Patrones multigeneracionales</li>
        <li><strong>Trauma familiar:</strong> Impacto del trauma en el sistema familiar</li>
        <li><strong>Resistencia al cambio:</strong> Manejo de la ambivalencia familiar</li>
        <li><strong>Diversidad cultural:</strong> Adaptación a diferentes contextos culturales</li>
      </ul>
      
      <h4>2. Modelos de Intervención Familiar</h4>
      <ol>
        <li><strong>Terapia Familiar Sistémica:</strong>
          <ul>
            <li>Enfoque en patrones de interacción</li>
            <li>Identificación de roles familiares</li>
            <li>Reestructuración de dinámicas disfuncionales</li>
          </ul>
        </li>
        <li><strong>Terapia Familiar Multidimensional:</strong>
          <ul>
            <li>Intervención en múltiples sistemas</li>
            <li>Trabajo con adolescentes y familias</li>
            <li>Integración de servicios comunitarios</li>
          </ul>
        </li>
        <li><strong>Terapia de Red Familiar:</strong>
          <ul>
            <li>Movilización de recursos familiares extendidos</li>
            <li>Creación de redes de apoyo</li>
            <li>Fortalecimiento de vínculos comunitarios</li>
          </ul>
        </li>
      </ol>
      
      <h4>3. Recovery Mentoring</h4>
      <p>El mentoring en recuperación es un proceso de apoyo mutuo donde:</p>
      <ul>
        <li>Personas con experiencia en recuperación guían a otros</li>
        <li>Se comparten experiencias y estrategias de afrontamiento</li>
        <li>Se proporciona apoyo emocional y práctico</li>
        <li>Se modela un estilo de vida en recuperación</li>
      </ul>
      
      <h4>4. Técnicas Comunicativas Especializadas</h4>
      <p>Desarrollo de habilidades comunicativas avanzadas:</p>
      <ul>
        <li><strong>Comunicación no violenta:</strong> Expresión de necesidades sin agresión</li>
        <li><strong>Escucha empática:</strong> Comprensión profunda de perspectivas</li>
        <li><strong>Manejo de conflictos:</strong> Resolución constructiva de desacuerdos</li>
        <li><strong>Comunicación asertiva:</strong> Expresión clara de límites y necesidades</li>
      </ul>
      
      <h3>Inteligencia Emocional en Intervención Familiar:</h3>
      <h4>1. Evaluación Emocional Familiar</h4>
      <ul>
        <li>Identificación de patrones emocionales familiares</li>
        <li>Evaluación de la regulación emocional de cada miembro</li>
        <li>Análisis de la comunicación emocional</li>
      </ul>
      
      <h4>2. Desarrollo de Competencias Emocionales</h4>
      <ul>
        <li>Entrenamiento en reconocimiento emocional</li>
        <li>Técnicas de regulación emocional familiar</li>
        <li>Desarrollo de empatía intrafamiliar</li>
      </ul>
      
      <h3>Herramientas Prácticas:</h3>
      <ul>
        <li><strong>Genograma emocional:</strong> Mapeo de patrones emocionales familiares</li>
        <li><strong>Escultura familiar:</strong> Representación física de dinámicas</li>
        <li><strong>Cartas terapéuticas:</strong> Expresión escrita de emociones</li>
        <li><strong>Rituales de sanación:</strong> Ceremonias de perdón y reconciliación</li>
      </ul>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Role-Playing de Intervención</h4>
        <p>Simula una sesión de intervención familiar utilizando técnicas de comunicación no violenta y manejo emocional.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Plan de Mentoring</h4>
        <p>Desarrolla un programa de mentoring personalizado que incluya objetivos, actividades y métricas de evaluación.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 3: Análisis de Video</h4>
        <p>Analiza el cortometraje "La Familia" identificando dinámicas emocionales y oportunidades de intervención.</p>
      </div>
    `,
    duracion_estimada: 150
  },
  
  'Nuevos Modelos Terapéuticos': {
    contenido_html: `
      <h2>Nuevos Modelos Terapéuticos</h2>
      <p>Esta lección explora enfoques terapéuticos innovadores que integran la inteligencia emocional con técnicas de tercera generación, psicología positiva y modelos holísticos de tratamiento.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Conocer las terapias de tercera generación y su aplicación en adicciones</li>
        <li>Comprender los principios de la psicología positiva en recuperación</li>
        <li>Aplicar técnicas de mindfulness y manejo del estrés</li>
        <li>Integrar modelos holísticos con inteligencia emocional</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Terapias de Tercera Generación</h4>
      <p>Las terapias de tercera generación representan un cambio paradigmático en el tratamiento:</p>
      
      <h5>Terapia de Aceptación y Compromiso (ACT)</h5>
      <ul>
        <li><strong>Flexibilidad psicológica:</strong> Capacidad de adaptarse a situaciones cambiantes</li>
        <li><strong>Aceptación:</strong> Reconocimiento sin juicio de experiencias internas</li>
        <li><strong>Valores personales:</strong> Identificación y compromiso con lo que es importante</li>
        <li><strong>Acción comprometida:</strong> Comportamientos alineados con valores</li>
      </ul>
      
      <h5>Terapia Dialéctica Conductual (DBT)</h5>
      <ul>
        <li><strong>Regulación emocional:</strong> Habilidades para manejar emociones intensas</li>
        <li><strong>Tolerancia al malestar:</strong> Capacidad de soportar crisis sin empeorarlas</li>
        <li><strong>Mindfulness:</strong> Atención plena al momento presente</li>
        <li><strong>Efectividad interpersonal:</strong> Habilidades para relaciones saludables</li>
      </ul>
      
      <h4>2. Psicología Positiva en Recuperación</h4>
      <p>La psicología positiva se centra en las fortalezas y aspectos positivos de la experiencia humana:</p>
      <ul>
        <li><strong>Fortalezas de carácter:</strong> Identificación y desarrollo de virtudes personales</li>
        <li><strong>Bienestar subjetivo:</strong> Promoción de emociones positivas y satisfacción vital</li>
        <li><strong>Flujo (Flow):</strong> Estados de compromiso total y disfrute</li>
        <li><strong>Sentido y propósito:</strong> Conexión con significado personal y trascendente</li>
      </ul>
      
      <h4>3. Mindfulness y Manejo del Estrés</h4>
      <p>La práctica de mindfulness ofrece herramientas poderosas para la recuperación:</p>
      
      <h5>Técnicas de Mindfulness</h5>
      <ul>
        <li><strong>Meditación de atención plena:</strong> Observación sin juicio de pensamientos y sensaciones</li>
        <li><strong>Escaneo corporal:</strong> Conciencia sistemática de sensaciones físicas</li>
        <li><strong>Respiración consciente:</strong> Uso de la respiración como ancla de atención</li>
        <li><strong>Mindfulness en actividades diarias:</strong> Presencia plena en tareas cotidianas</li>
      </ul>
      
      <h5>Manejo del Estrés y Ansiedad</h5>
      <ul>
        <li><strong>Técnicas de relajación progresiva:</strong> Reducción sistemática de tensión muscular</li>
        <li><strong>Visualización guiada:</strong> Uso de imágenes mentales para la calma</li>
        <li><strong>Técnicas de respiración:</strong> Regulación del sistema nervioso</li>
        <li><strong>Reestructuración cognitiva:</strong> Cambio de patrones de pensamiento estresantes</li>
      </ul>
      
      <h4>4. Trabajo con el Niño Interior</h4>
      <p>El concepto del niño interior en terapia de adicciones:</p>
      <ul>
        <li><strong>Sanación de heridas tempranas:</strong> Trabajo con traumas de la infancia</li>
        <li><strong>Reparentalización:</strong> Desarrollo de una voz interna nutritiva</li>
        <li><strong>Integración de aspectos rechazados:</strong> Aceptación de partes vulnerables</li>
        <li><strong>Desarrollo de autocompasión:</strong> Tratamiento amable hacia uno mismo</li>
      </ul>
      
      <h4>5. La Ventana de Johari en Terapia</h4>
      <p>Modelo para el desarrollo del autoconocimiento:</p>
      <ul>
        <li><strong>Área pública:</strong> Lo que yo sé y otros saben de mí</li>
        <li><strong>Área ciega:</strong> Lo que otros ven pero yo no</li>
        <li><strong>Área privada:</strong> Lo que yo sé pero otros no</li>
        <li><strong>Área desconocida:</strong> Potencial no explorado</li>
      </ul>
      
      <h3>Integración con Inteligencia Emocional:</h3>
      <p>Los nuevos modelos terapéuticos potencian la inteligencia emocional:</p>
      <ul>
        <li><strong>Mayor autoconciencia:</strong> Reconocimiento profundo de estados internos</li>
        <li><strong>Regulación emocional avanzada:</strong> Técnicas sofisticadas de manejo emocional</li>
        <li><strong>Empatía expandida:</strong> Comprensión compasiva de otros y de uno mismo</li>
        <li><strong>Habilidades sociales mejoradas:</strong> Comunicación más auténtica y efectiva</li>
      </ul>
      
      <h3>Actividades Prácticas:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Práctica de Mindfulness</h4>
        <p>Realiza una sesión de meditación de 20 minutos utilizando técnicas de atención plena. Registra tu experiencia y observaciones.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Identificación de Fortalezas</h4>
        <p>Completa el cuestionario de fortalezas de carácter VIA y desarrolla un plan para utilizar tus fortalezas principales en tu proceso de recuperación.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 3: Trabajo con el Niño Interior</h4>
        <p>Escribe una carta a tu niño interior, expresando comprensión, perdón y compromiso de cuidado.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 4: Ventana de Johari Personal</h4>
        <p>Crea tu propia ventana de Johari, identificando aspectos en cada cuadrante y desarrollando estrategias para expandir tu área pública.</p>
      </div>
    `,
    duracion_estimada: 180
  },
  
  'Inteligencia Emocional Aplicada': {
    contenido_html: `
      <h2>Inteligencia Emocional Aplicada</h2>
      <p>Esta lección final integra todos los conceptos aprendidos, proporcionando herramientas prácticas para la aplicación de la inteligencia emocional en el tratamiento y prevención de conductas adictivas.</p>
      
      <h3>Objetivos de Aprendizaje:</h3>
      <ul>
        <li>Integrar todos los componentes de la inteligencia emocional</li>
        <li>Desarrollar un plan personal de aplicación</li>
        <li>Crear estrategias de prevención de recaídas basadas en IE</li>
        <li>Establecer un sistema de seguimiento y evaluación continua</li>
      </ul>
      
      <h3>Contenido Principal:</h3>
      <h4>1. Síntesis de la Inteligencia Emocional</h4>
      <p>Revisión integrativa de los cinco componentes principales:</p>
      
      <h5>Autoconciencia Emocional</h5>
      <ul>
        <li>Reconocimiento inmediato de emociones</li>
        <li>Comprensión de triggers emocionales</li>
        <li>Identificación de patrones emocionales personales</li>
        <li>Conciencia del impacto emocional en otros</li>
      </ul>
      
      <h5>Autorregulación Emocional</h5>
      <ul>
        <li>Técnicas de manejo de impulsos</li>
        <li>Estrategias de regulación del estado de ánimo</li>
        <li>Habilidades de adaptación al cambio</li>
        <li>Manejo constructivo de la frustración</li>
      </ul>
      
      <h5>Motivación Intrínseca</h5>
      <ul>
        <li>Conexión con valores personales profundos</li>
        <li>Establecimiento de objetivos significativos</li>
        <li>Mantenimiento de la esperanza y optimismo</li>
        <li>Perseverancia ante las dificultades</li>
      </ul>
      
      <h5>Empatía</h5>
      <ul>
        <li>Comprensión de perspectivas ajenas</li>
        <li>Sensibilidad a las necesidades de otros</li>
        <li>Reconocimiento de dinámicas grupales</li>
        <li>Desarrollo de compasión genuina</li>
      </ul>
      
      <h5>Habilidades Sociales</h5>
      <ul>
        <li>Comunicación efectiva y asertiva</li>
        <li>Liderazgo emocional</li>
        <li>Manejo de conflictos</li>
        <li>Construcción de relaciones saludables</li>
      </ul>
      
      <h4>2. Aplicación en Prevención de Recaídas</h4>
      <p>La inteligencia emocional como herramienta central en la prevención:</p>
      
      <h5>Identificación de Situaciones de Alto Riesgo</h5>
      <ul>
        <li><strong>Triggers emocionales:</strong> Emociones que históricamente han llevado al consumo</li>
        <li><strong>Situaciones sociales:</strong> Contextos interpersonales desafiantes</li>
        <li><strong>Estados internos:</strong> Condiciones físicas y mentales vulnerables</li>
        <li><strong>Pensamientos automáticos:</strong> Cogniciones que preceden al consumo</li>
      </ul>
      
      <h5>Estrategias de Afrontamiento Emocional</h5>
      <ul>
        <li><strong>Técnicas de regulación inmediata:</strong> Herramientas para crisis emocionales</li>
        <li><strong>Estrategias de distracción saludable:</strong> Actividades alternativas constructivas</li>
        <li><strong>Red de apoyo emocional:</strong> Personas y recursos para momentos difíciles</li>
        <li><strong>Rituales de autocuidado:</strong> Prácticas regulares de bienestar emocional</li>
      </ul>
      
      <h4>3. Plan Personal de Inteligencia Emocional</h4>
      <p>Desarrollo de un plan individualizado que incluya:</p>
      
      <h5>Autoevaluación Inicial</h5>
      <ul>
        <li>Evaluación de fortalezas y áreas de mejora en cada componente de IE</li>
        <li>Identificación de patrones emocionales problemáticos</li>
        <li>Análisis de situaciones desafiantes recurrentes</li>
      </ul>
      
      <h5>Objetivos SMART</h5>
      <ul>
        <li><strong>Específicos:</strong> Claramente definidos y concretos</li>
        <li><strong>Medibles:</strong> Con criterios de evaluación objetivos</li>
        <li><strong>Alcanzables:</strong> Realistas y factibles</li>
        <li><strong>Relevantes:</strong> Significativos para la recuperación personal</li>
        <li><strong>Temporales:</strong> Con plazos definidos</li>
      </ul>
      
      <h5>Estrategias Personalizadas</h5>
      <ul>
        <li>Técnicas específicas para cada componente de IE</li>
        <li>Adaptación a estilo de vida y preferencias personales</li>
        <li>Integración con otras herramientas de recuperación</li>
      </ul>
      
      <h4>4. Sistema de Seguimiento y Evaluación</h4>
      <p>Herramientas para monitorear el progreso:</p>
      
      <h5>Indicadores de Progreso</h5>
      <ul>
        <li><strong>Autoregistros emocionales:</strong> Diario de estados emocionales y respuestas</li>
        <li><strong>Feedback de otros:</strong> Perspectivas de familiares y profesionales</li>
        <li><strong>Evaluaciones periódicas:</strong> Tests y cuestionarios de IE</li>
        <li><strong>Logros conductuales:</strong> Cambios observables en comportamiento</li>
      </ul>
      
      <h5>Ajustes y Refinamientos</h5>
      <ul>
        <li>Revisión regular del plan (mensual/trimestral)</li>
        <li>Modificación de estrategias según resultados</li>
        <li>Incorporación de nuevas técnicas y aprendizajes</li>
        <li>Celebración de logros y aprendizaje de dificultades</li>
      </ul>
      
      <h3>Herramientas Prácticas Finales:</h3>
      <ul>
        <li><strong>Kit de emergencia emocional:</strong> Recursos para crisis</li>
        <li><strong>Mapa de recursos de IE:</strong> Personas, lugares y actividades de apoyo</li>
        <li><strong>Ritual diario de IE:</strong> Práctica cotidiana de desarrollo emocional</li>
        <li><strong>Plan de mantenimiento a largo plazo:</strong> Estrategias para sostener el crecimiento</li>
      </ul>
      
      <h3>Actividades Prácticas Finales:</h3>
      <div class="ejercicio">
        <h4>Ejercicio 1: Plan Personal Completo</h4>
        <p>Desarrolla tu plan personal de inteligencia emocional completo, incluyendo autoevaluación, objetivos, estrategias y sistema de seguimiento.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 2: Kit de Emergencia Emocional</h4>
        <p>Crea tu kit personalizado de herramientas para situaciones de crisis emocional, incluyendo técnicas, contactos y recursos.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 3: Carta al Futuro</h4>
        <p>Escribe una carta a ti mismo/a para leer en 6 meses, incluyendo tus compromisos, esperanzas y recordatorios importantes.</p>
      </div>
      
      <div class="ejercicio">
        <h4>Ejercicio 4: Presentación de Integración</h4>
        <p>Prepara una presentación de 10 minutos sobre cómo aplicarás la inteligencia emocional en tu contexto personal o profesional.</p>
      </div>
      
      <h3>Recursos Adicionales:</h3>
      <p>Para continuar tu desarrollo en inteligencia emocional, consulta:</p>
      <ul>
        <li>El informe técnico sobre educación emocional en conductas adictivas</li>
        <li>La presentación completa de inteligencia emocional</li>
        <li>Literatura especializada en IE y adicciones</li>
        <li>Grupos de apoyo y comunidades de práctica</li>
        <li>Formación continua y supervisión profesional</li>
      </ul>
    `,
    duracion_estimada: 120
  }
};

async function actualizarContenidoLecciones() {
  try {
    console.log('Iniciando actualización de contenido de lecciones...');
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', CURSO_INTELIGENCIA_ID)
      .order('orden');
    
    if (leccionesError) {
      throw leccionesError;
    }
    
    console.log(`Encontradas ${lecciones.length} lecciones para actualizar`);
    
    // Actualizar cada lección con su contenido correspondiente
    for (const leccion of lecciones) {
      const contenido = contenidoLecciones[leccion.titulo];
      
      if (contenido) {
        console.log(`Actualizando lección: ${leccion.titulo}`);
        
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({
            contenido_html: contenido.contenido_html,
            duracion_estimada: contenido.duracion_estimada
          })
          .eq('id', leccion.id);
        
        if (updateError) {
          console.error(`Error actualizando lección ${leccion.titulo}:`, updateError);
        } else {
          console.log(`✓ Lección "${leccion.titulo}" actualizada exitosamente`);
        }
      } else {
        console.log(`⚠ No se encontró contenido para la lección: ${leccion.titulo}`);
      }
    }
    
    console.log('\n=== ACTUALIZACIÓN COMPLETADA ===');
    console.log('Todas las lecciones han sido actualizadas con contenido educativo completo.');
    
  } catch (error) {
    console.error('Error en la actualización:', error);
  }
}

// Ejecutar la función
actualizarContenidoLecciones();