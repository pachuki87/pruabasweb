import fs from 'fs';
import path from 'path';

// Contenido de las lecciones de inteligencia emocional
const lecciones = {
  'leccion-1-introduccion-inteligencia-emocional': {
    titulo: 'Introducción a la Inteligencia Emocional',
    contenido: `
      <div class="lesson-content">
        <h1>Introducción a la Inteligencia Emocional</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Comprender qué es la inteligencia emocional</li>
            <li>Identificar los componentes principales de la IE</li>
            <li>Reconocer la importancia de la IE en el tratamiento de adicciones</li>
            <li>Desarrollar autoconciencia emocional básica</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>¿Qué es la Inteligencia Emocional?</h2>
          <p>La inteligencia emocional (IE) se define como la capacidad de reconocer, comprender y manejar nuestras propias emociones, así como las de los demás. En el contexto de las adicciones, la IE juega un papel crucial tanto en el desarrollo como en la recuperación.</p>
          
          <h3>Definición de Inteligencia Emocional</h3>
          <p>Según Daniel Goleman, la IE incluye cinco componentes principales:</p>
          <ul>
            <li><strong>Autoconciencia emocional:</strong> Reconocer las propias emociones</li>
            <li><strong>Autorregulación:</strong> Manejar las emociones de manera efectiva</li>
            <li><strong>Motivación:</strong> Utilizar las emociones para alcanzar objetivos</li>
            <li><strong>Empatía:</strong> Reconocer y comprender las emociones de otros</li>
            <li><strong>Habilidades sociales:</strong> Manejar las relaciones interpersonales</li>
          </ul>

          <h3>Importancia en el Tratamiento de Adicciones</h3>
          <p>La inteligencia emocional es fundamental en el tratamiento de adicciones porque:</p>
          <ul>
            <li>Ayuda a identificar triggers emocionales</li>
            <li>Proporciona herramientas para manejar emociones difíciles</li>
            <li>Mejora las relaciones interpersonales</li>
            <li>Reduce el riesgo de recaídas</li>
            <li>Aumenta la autoestima y autoconfianza</li>
          </ul>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Ejercicio de Autoconciencia Emocional</h3>
          <p>Durante los próximos días, lleva un diario emocional simple:</p>
          <ol>
            <li>Tres veces al día, pregúntate: "¿Cómo me siento ahora?"</li>
            <li>Nombra la emoción específica (no solo "bien" o "mal")</li>
            <li>Califica la intensidad del 1 al 10</li>
            <li>Identifica qué situación o pensamiento causó esa emoción</li>
          </ol>
        </div>

        <div class="reflexion">
          <h2>Reflexión</h2>
          <p>¿Cómo crees que el desarrollo de tu inteligencia emocional puede ayudarte en tu proceso de recuperación?</p>
        </div>
      </div>
    `
  },

  'leccion-2-autoconciencia-emocional': {
    titulo: 'Desarrollo de la Autoconciencia Emocional',
    contenido: `
      <div class="lesson-content">
        <h1>Desarrollo de la Autoconciencia Emocional</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Identificar y nombrar emociones básicas</li>
            <li>Reconocer señales físicas de las emociones</li>
            <li>Desarrollar vocabulario emocional</li>
            <li>Practicar mindfulness emocional</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>La Base de la Inteligencia Emocional</h2>
          <p>El autoconocimiento emocional es la base de la inteligencia emocional. Implica ser consciente de nuestras emociones en el momento que las experimentamos.</p>
          
          <h3>Emociones Básicas</h3>
          <p>Las emociones básicas universales incluyen:</p>
          <ul>
            <li><strong>Alegría:</strong> Sensación de bienestar y satisfacción</li>
            <li><strong>Tristeza:</strong> Respuesta a pérdidas o decepciones</li>
            <li><strong>Miedo:</strong> Reacción ante amenazas percibidas</li>
            <li><strong>Ira:</strong> Respuesta a frustraciones o injusticias</li>
            <li><strong>Sorpresa:</strong> Reacción ante lo inesperado</li>
            <li><strong>Asco:</strong> Rechazo hacia algo desagradable</li>
          </ul>

          <h3>Señales Físicas de las Emociones</h3>
          <p>Cada emoción se manifiesta en el cuerpo de manera específica:</p>
          <ul>
            <li><strong>Ansiedad:</strong> Tensión muscular, respiración acelerada, sudoración</li>
            <li><strong>Ira:</strong> Calor en el rostro, puños cerrados, mandíbula tensa</li>
            <li><strong>Tristeza:</strong> Pesadez en el pecho, lágrimas, fatiga</li>
            <li><strong>Alegría:</strong> Ligereza, sonrisa, energía</li>
          </ul>

          <h3>Técnica del Escaneo Corporal</h3>
          <p>Práctica diaria para desarrollar conciencia emocional:</p>
          <ol>
            <li>Siéntate cómodamente y cierra los ojos</li>
            <li>Respira profundamente tres veces</li>
            <li>Escanea tu cuerpo desde la cabeza hasta los pies</li>
            <li>Nota cualquier tensión, calor, frío o sensación</li>
            <li>Pregúntate: "¿Qué emoción podría estar relacionada con esta sensación?"</li>
          </ol>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Diario Emocional Estructurado</h3>
          <p>Durante una semana, completa este registro cada vez que sientas una emoción intensa:</p>
          <ul>
            <li><strong>Situación:</strong> ¿Qué pasó?</li>
            <li><strong>Emoción:</strong> ¿Qué sentí?</li>
            <li><strong>Intensidad:</strong> Del 1 al 10</li>
            <li><strong>Pensamientos:</strong> ¿Qué pensé?</li>
            <li><strong>Sensaciones físicas:</strong> ¿Qué sentí en el cuerpo?</li>
            <li><strong>Comportamiento:</strong> ¿Qué hice?</li>
          </ul>
        </div>
      </div>
    `
  },

  'leccion-3-regulacion-emocional': {
    titulo: 'Técnicas de Regulación Emocional',
    contenido: `
      <div class="lesson-content">
        <h1>Técnicas de Regulación Emocional</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Desarrollar estrategias de regulación saludables</li>
            <li>Practicar técnicas de manejo del estrés</li>
            <li>Aprender a tolerar emociones difíciles</li>
            <li>Reemplazar el consumo como estrategia de regulación</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>¿Qué es la Regulación Emocional?</h2>
          <p>La regulación emocional es la capacidad de manejar y modificar nuestras respuestas emocionales de manera adaptativa. No se trata de suprimir emociones, sino de gestionarlas de forma saludable.</p>
          
          <h3>Estrategias de Regulación Emocional</h3>
          
          <h4>1. Técnicas de Respiración</h4>
          <ul>
            <li><strong>Respiración 4-7-8:</strong> Inhala 4, mantén 7, exhala 8</li>
            <li><strong>Respiración diafragmática:</strong> Respiración profunda desde el abdomen</li>
            <li><strong>Respiración cuadrada:</strong> Inhala 4, mantén 4, exhala 4, mantén 4</li>
          </ul>

          <h4>2. Técnica STOP</h4>
          <ul>
            <li><strong>S</strong> - Stop (Parar)</li>
            <li><strong>T</strong> - Take a breath (Respirar)</li>
            <li><strong>O</strong> - Observe (Observar emociones y pensamientos)</li>
            <li><strong>P</strong> - Proceed (Proceder con conciencia)</li>
          </ul>

          <h4>3. Reestructuración Cognitiva</h4>
          <p>Cambiar pensamientos negativos por otros más equilibrados:</p>
          <ul>
            <li>Identifica el pensamiento automático</li>
            <li>Evalúa la evidencia a favor y en contra</li>
            <li>Genera pensamientos alternativos más realistas</li>
            <li>Practica el nuevo pensamiento</li>
          </ul>

          <h4>4. Técnicas de Distracción Saludable</h4>
          <ul>
            <li>Ejercicio físico</li>
            <li>Música relajante</li>
            <li>Actividades creativas</li>
            <li>Contacto social positivo</li>
            <li>Meditación o mindfulness</li>
          </ul>

          <h3>Tolerancia al Malestar</h3>
          <p>Aprender que las emociones son temporales y que podemos tolerarlas sin actuar impulsivamente:</p>
          <ul>
            <li>Las emociones son como olas: suben, alcanzan un pico y bajan</li>
            <li>Resistir la urgencia de actuar inmediatamente</li>
            <li>Usar técnicas de relajación durante el malestar</li>
            <li>Recordar experiencias pasadas donde el malestar pasó</li>
          </ul>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Plan Personal de Regulación Emocional</h3>
          <p>Crea tu kit de herramientas emocionales:</p>
          <ol>
            <li>Identifica tus emociones más desafiantes</li>
            <li>Selecciona 3-5 técnicas que más te funcionen</li>
            <li>Practica cada técnica cuando estés calmado</li>
            <li>Crea recordatorios visuales de tus técnicas</li>
            <li>Practica usar las técnicas en situaciones de bajo estrés primero</li>
          </ol>
        </div>
      </div>
    `
  },

  'leccion-4-empatia-habilidades-sociales': {
    titulo: 'Empatía y Habilidades Sociales',
    contenido: `
      <div class="lesson-content">
        <h1>Empatía y Habilidades Sociales</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Mejorar la comunicación emocional</li>
            <li>Desarrollar empatía hacia otros</li>
            <li>Practicar resolución de conflictos</li>
            <li>Fortalecer relaciones interpersonales</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>Desarrollando la Empatía</h2>
          <p>La empatía es la capacidad de comprender y compartir los sentimientos de otra persona. Es fundamental para mantener relaciones saludables y evitar el aislamiento social que puede llevar a recaídas.</p>
          
          <h3>Tipos de Empatía</h3>
          <ul>
            <li><strong>Empatía cognitiva:</strong> Entender intelectualmente lo que siente otra persona</li>
            <li><strong>Empatía emocional:</strong> Sentir lo que siente otra persona</li>
            <li><strong>Empatía compasiva:</strong> Ser movido a ayudar cuando alguien sufre</li>
          </ul>

          <h3>Técnicas para Desarrollar Empatía</h3>
          
          <h4>1. Escucha Activa</h4>
          <ul>
            <li>Presta atención completa a la persona</li>
            <li>No interrumpas ni juzgues</li>
            <li>Refleja lo que escuchas: "Entiendo que te sientes..."</li>
            <li>Haz preguntas abiertas para entender mejor</li>
          </ul>

          <h4>2. Perspectiva-Taking</h4>
          <ul>
            <li>Imagínate en la situación de la otra persona</li>
            <li>Considera su historia y contexto</li>
            <li>Pregúntate: "¿Cómo me sentiría yo en su lugar?"</li>
          </ul>

          <h3>Habilidades de Comunicación Emocional</h3>
          
          <h4>Comunicación Asertiva</h4>
          <p>Expresar tus emociones y necesidades de manera clara y respetuosa:</p>
          <ul>
            <li><strong>Usa "Yo" en lugar de "Tú":</strong> "Yo me siento..." en lugar de "Tú me haces sentir..."</li>
            <li><strong>Sé específico:</strong> Describe situaciones concretas</li>
            <li><strong>Expresa emociones, no juicios:</strong> "Me siento ignorado" en lugar de "Eres desconsiderado"</li>
            <li><strong>Propón soluciones:</strong> "¿Podríamos acordar...?"</li>
          </ul>

          <h4>Resolución de Conflictos</h4>
          <ol>
            <li><strong>Pausa:</strong> Toma tiempo para calmarte antes de responder</li>
            <li><strong>Escucha:</strong> Entiende el punto de vista del otro</li>
            <li><strong>Valida:</strong> Reconoce los sentimientos de la otra persona</li>
            <li><strong>Colabora:</strong> Busca soluciones que beneficien a ambos</li>
            <li><strong>Compromete:</strong> Encuentra un punto medio cuando sea necesario</li>
          </ol>

          <h3>Construyendo Relaciones Saludables</h3>
          <ul>
            <li>Mantén contacto regular con personas de apoyo</li>
            <li>Participa en actividades grupales positivas</li>
            <li>Ofrece apoyo a otros cuando sea apropiado</li>
            <li>Establece límites saludables</li>
            <li>Practica la gratitud hacia las personas importantes</li>
          </ul>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Ejercicio de Role-Playing</h3>
          <p>Practica estas situaciones sociales comunes:</p>
          <ol>
            <li><strong>Situación 1:</strong> Un amigo te critica constructivamente</li>
            <li><strong>Situación 2:</strong> Necesitas pedir ayuda a alguien</li>
            <li><strong>Situación 3:</strong> Alguien está pasando por un momento difícil</li>
            <li><strong>Situación 4:</strong> Tienes un desacuerdo con un familiar</li>
          </ol>
          <p>Para cada situación, practica:</p>
          <ul>
            <li>Escucha activa</li>
            <li>Comunicación asertiva</li>
            <li>Expresión empática</li>
            <li>Resolución colaborativa</li>
          </ul>
        </div>
      </div>
    `
  },

  'leccion-5-inteligencia-emocional-adicciones': {
    titulo: 'Inteligencia Emocional en el Tratamiento de Adicciones',
    contenido: `
      <div class="lesson-content">
        <h1>Inteligencia Emocional en el Tratamiento de Adicciones</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Comprender la relación entre emociones y adicciones</li>
            <li>Identificar déficits de IE en personas con adicciones</li>
            <li>Aplicar técnicas de IE en la prevención de recaídas</li>
            <li>Desarrollar estrategias específicas para el tratamiento</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>Relación entre Inteligencia Emocional y Adicciones</h2>
          
          <h3>Déficits de IE en Personas con Adicciones</h3>
          <p>Las investigaciones han demostrado que las personas con trastornos por uso de sustancias frecuentemente presentan:</p>
          <ul>
            <li><strong>Dificultades en el reconocimiento emocional:</strong> Problemas para identificar y nombrar emociones</li>
            <li><strong>Disregulación emocional:</strong> Incapacidad para manejar emociones intensas</li>
            <li><strong>Alexitimia:</strong> Dificultad para expresar emociones verbalmente</li>
            <li><strong>Impulsividad emocional:</strong> Reacciones automáticas sin reflexión</li>
            <li><strong>Déficits en empatía:</strong> Dificultad para comprender las emociones de otros</li>
          </ul>

          <h3>El Consumo como Estrategia de Regulación Emocional</h3>
          <p>Muchas personas utilizan sustancias como una forma disfuncional de:</p>
          <ul>
            <li>Evitar emociones dolorosas</li>
            <li>Intensificar emociones positivas</li>
            <li>Numerar el dolor emocional</li>
            <li>Manejar el estrés y la ansiedad</li>
            <li>Facilitar la interacción social</li>
          </ul>

          <h3>Aplicación de IE en Prevención de Recaídas</h3>
          
          <h4>Identificación de Triggers Emocionales</h4>
          <p>Los triggers emocionales más comunes incluyen:</p>
          <ul>
            <li>Estrés laboral o académico</li>
            <li>Conflictos interpersonales</li>
            <li>Sentimientos de soledad o aburrimiento</li>
            <li>Ansiedad social</li>
            <li>Depresión o tristeza profunda</li>
            <li>Celebraciones o eventos sociales</li>
          </ul>

          <h4>Plan de Manejo de Triggers</h4>
          <ol>
            <li><strong>Identificación temprana:</strong> Reconocer señales de alerta</li>
            <li><strong>Técnicas de regulación:</strong> Aplicar estrategias aprendidas</li>
            <li><strong>Red de apoyo:</strong> Contactar personas de confianza</li>
            <li><strong>Actividades alternativas:</strong> Tener opciones saludables preparadas</li>
            <li><strong>Evaluación posterior:</strong> Reflexionar sobre lo que funcionó</li>
          </ol>

          <h3>Técnicas Específicas para Adicciones</h3>
          
          <h4>Técnica HALT</h4>
          <p>Antes de tomar cualquier decisión importante, pregúntate si estás:</p>
          <ul>
            <li><strong>H</strong>ungry (Hambriento)</li>
            <li><strong>A</strong>ngry (Enojado)</li>
            <li><strong>L</strong>onely (Solo)</li>
            <li><strong>T</strong>ired (Cansado)</li>
          </ul>
          <p>Si la respuesta es sí a cualquiera, atiende esa necesidad primero.</p>

          <h4>Surfing the Urge (Surfear el Impulso)</h4>
          <p>Visualiza los impulsos de consumo como olas:</p>
          <ol>
            <li>Reconoce que el impulso está llegando</li>
            <li>No luches contra él, obsérvalo</li>
            <li>Nota cómo crece, alcanza un pico y disminuye</li>
            <li>Respira profundamente durante todo el proceso</li>
            <li>Celebra haber "surfeado" exitosamente el impulso</li>
          </ol>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Caso Clínico</h3>
          <p>Analiza el siguiente caso y propón estrategias de inteligencia emocional:</p>
          <div class="caso-clinico">
            <p><strong>Caso:</strong> "María lleva 6 meses sobria. Hoy tuvo una discusión fuerte con su jefe y se siente muy frustrada y enojada. Normalmente, en estas situaciones bebía alcohol para 'calmarse'. Está considerando parar en una tienda de licores de camino a casa."</p>
          </div>
          
          <h4>Preguntas para reflexionar:</h4>
          <ol>
            <li>¿Qué emociones está experimentando María?</li>
            <li>¿Cuáles son sus triggers emocionales en esta situación?</li>
            <li>¿Qué técnicas de regulación emocional podría usar?</li>
            <li>¿Cómo podría usar su red de apoyo?</li>
            <li>¿Qué actividades alternativas podría considerar?</li>
          </ol>
        </div>
      </div>
    `
  },

  'leccion-6-plan-personal-inteligencia-emocional': {
    titulo: 'Plan Personal de Inteligencia Emocional',
    contenido: `
      <div class="lesson-content">
        <h1>Plan Personal de Inteligencia Emocional</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Integrar todos los componentes de la inteligencia emocional</li>
            <li>Crear un plan personalizado de desarrollo</li>
            <li>Establecer metas específicas y medibles</li>
            <li>Desarrollar un sistema de seguimiento y evaluación</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>Síntesis de la Inteligencia Emocional</h2>
          <p>A lo largo de este curso hemos explorado los componentes fundamentales de la inteligencia emocional:</p>
          
          <h3>Componentes Integrados</h3>
          <ul>
            <li><strong>Autoconciencia:</strong> Reconocer y comprender nuestras emociones</li>
            <li><strong>Autorregulación:</strong> Manejar nuestras emociones de manera efectiva</li>
            <li><strong>Motivación:</strong> Usar emociones para alcanzar objetivos</li>
            <li><strong>Empatía:</strong> Comprender las emociones de otros</li>
            <li><strong>Habilidades sociales:</strong> Manejar relaciones interpersonales</li>
          </ul>

          <h2>Creando tu Plan Personal</h2>
          
          <h3>Paso 1: Autoevaluación</h3>
          <p>Evalúa tu nivel actual en cada componente (1-10):</p>
          <ul>
            <li>Autoconciencia emocional: ___/10</li>
            <li>Autorregulación emocional: ___/10</li>
            <li>Motivación intrínseca: ___/10</li>
            <li>Empatía hacia otros: ___/10</li>
            <li>Habilidades sociales: ___/10</li>
          </ul>

          <h3>Paso 2: Identificación de Fortalezas y Áreas de Mejora</h3>
          <h4>Mis Fortalezas:</h4>
          <ul>
            <li>_________________________</li>
            <li>_________________________</li>
            <li>_________________________</li>
          </ul>
          
          <h4>Áreas de Mejora:</h4>
          <ul>
            <li>_________________________</li>
            <li>_________________________</li>
            <li>_________________________</li>
          </ul>

          <h3>Paso 3: Establecimiento de Metas SMART</h3>
          <p>Para cada área de mejora, establece metas que sean:</p>
          <ul>
            <li><strong>S</strong>pecíficas (Específicas)</li>
            <li><strong>M</strong>easurable (Medibles)</li>
            <li><strong>A</strong>chievable (Alcanzables)</li>
            <li><strong>R</strong>elevant (Relevantes)</li>
            <li><strong>T</strong>ime-bound (Con tiempo límite)</li>
          </ul>

          <h4>Ejemplo de Meta SMART:</h4>
          <p>"Practicaré técnicas de respiración profunda durante 10 minutos cada mañana durante las próximas 4 semanas para mejorar mi autorregulación emocional."</p>

          <h3>Paso 4: Estrategias y Técnicas</h3>
          <p>Selecciona las técnicas que más te han funcionado:</p>
          
          <h4>Para Autoconciencia:</h4>
          <ul>
            <li>□ Diario emocional diario</li>
            <li>□ Escaneo corporal</li>
            <li>□ Meditación mindfulness</li>
            <li>□ Check-ins emocionales regulares</li>
          </ul>

          <h4>Para Autorregulación:</h4>
          <ul>
            <li>□ Técnicas de respiración</li>
            <li>□ Técnica STOP</li>
            <li>□ Ejercicio físico regular</li>
            <li>□ Reestructuración cognitiva</li>
          </ul>

          <h4>Para Habilidades Sociales:</h4>
          <ul>
            <li>□ Práctica de escucha activa</li>
            <li>□ Comunicación asertiva</li>
            <li>□ Participación en grupos de apoyo</li>
            <li>□ Actividades sociales saludables</li>
          </ul>

          <h3>Paso 5: Sistema de Apoyo</h3>
          <p>Identifica personas que pueden apoyarte en tu desarrollo:</p>
          <ul>
            <li><strong>Mentor/Terapeuta:</strong> _________________________</li>
            <li><strong>Familia de apoyo:</strong> _________________________</li>
            <li><strong>Amigos de confianza:</strong> _________________________</li>
            <li><strong>Grupo de apoyo:</strong> _________________________</li>
          </ul>

          <h3>Paso 6: Seguimiento y Evaluación</h3>
          <p>Programa revisiones regulares de tu progreso:</p>
          <ul>
            <li><strong>Revisión semanal:</strong> Evalúa el progreso en técnicas diarias</li>
            <li><strong>Revisión mensual:</strong> Evalúa el progreso hacia metas SMART</li>
            <li><strong>Revisión trimestral:</strong> Reevalúa y ajusta el plan completo</li>
          </ul>
        </div>

        <div class="actividad">
          <h2>Actividad Final</h2>
          <h3>Mi Compromiso Personal</h3>
          <p>Completa las siguientes declaraciones:</p>
          
          <div class="compromiso">
            <p><strong>Mi mayor fortaleza emocional es:</strong></p>
            <p>_________________________________________________</p>
            
            <p><strong>Mi mayor desafío emocional es:</strong></p>
            <p>_________________________________________________</p>
            
            <p><strong>Mi meta principal para los próximos 3 meses es:</strong></p>
            <p>_________________________________________________</p>
            
            <p><strong>Me comprometo a practicar estas técnicas diariamente:</strong></p>
            <p>_________________________________________________</p>
            
            <p><strong>Buscaré apoyo de estas personas cuando lo necesite:</strong></p>
            <p>_________________________________________________</p>
            
            <p><strong>Sabré que estoy progresando cuando:</strong></p>
            <p>_________________________________________________</p>
          </div>
        </div>

        <div class="recursos">
          <h2>Recursos Adicionales</h2>
          <h3>Para continuar tu desarrollo en inteligencia emocional:</h3>
          <ul>
            <li>Libros recomendados sobre inteligencia emocional</li>
            <li>Aplicaciones de mindfulness y meditación</li>
            <li>Grupos de apoyo locales</li>
            <li>Talleres y cursos adicionales</li>
            <li>Recursos en línea y podcasts</li>
          </ul>
        </div>
      </div>
    `
  },

  'leccion-7-aplicacion-practica-inteligencia-emocional': {
    titulo: 'Aplicación Práctica de la Inteligencia Emocional',
    contenido: `
      <div class="lesson-content">
        <h1>Aplicación Práctica de la Inteligencia Emocional</h1>
        
        <div class="objetivos">
          <h2>Objetivos de Aprendizaje</h2>
          <ul>
            <li>Aplicar técnicas de IE en situaciones reales</li>
            <li>Desarrollar estrategias para diferentes contextos</li>
            <li>Practicar la integración de habilidades emocionales</li>
            <li>Crear un plan de mantenimiento a largo plazo</li>
          </ul>
        </div>

        <div class="contenido-principal">
          <h2>Inteligencia Emocional en Diferentes Contextos</h2>
          
          <h3>En el Ámbito Laboral</h3>
          <p>Aplicación de IE en el trabajo:</p>
          <ul>
            <li><strong>Manejo del estrés laboral:</strong> Técnicas de respiración entre reuniones</li>
            <li><strong>Comunicación con colegas:</strong> Escucha activa y comunicación asertiva</li>
            <li><strong>Resolución de conflictos:</strong> Mediación empática</li>
            <li><strong>Liderazgo emocional:</strong> Inspirar y motivar a otros</li>
            <li><strong>Adaptación al cambio:</strong> Flexibilidad emocional</li>
          </ul>

          <h3>En Relaciones Familiares</h3>
          <p>IE en el contexto familiar:</p>
          <ul>
            <li><strong>Comunicación familiar:</strong> Expresión saludable de emociones</li>
            <li><strong>Resolución de conflictos familiares:</strong> Mediación y comprensión</li>
            <li><strong>Apoyo emocional:</strong> Estar presente para los seres queridos</li>
            <li><strong>Establecimiento de límites:</strong> Respeto mutuo y autocuidado</li>
            <li><strong>Modelado emocional:</strong> Ser ejemplo para otros miembros</li>
          </ul>

          <h3>En Situaciones Sociales</h3>
          <p>Navegando interacciones sociales:</p>
          <ul>
            <li><strong>Lectura de señales sociales:</strong> Interpretar emociones no verbales</li>
            <li><strong>Manejo de ansiedad social:</strong> Técnicas de relajación</li>
            <li><strong>Construcción de relaciones:</strong> Empatía y autenticidad</li>
            <li><strong>Manejo de críticas:</strong> Respuesta no defensiva</li>
            <li><strong>Celebraciones y eventos:</strong> Disfrute sin sustancias</li>
          </ul>

          <h2>Estrategias de Prevención de Recaídas</h2>
          
          <h3>Plan de Acción para Crisis Emocionales</h3>
          <ol>
            <li><strong>Reconocimiento temprano:</strong> Identificar señales de alerta</li>
            <li><strong>Técnicas inmediatas:</strong> Respiración, STOP, grounding</li>
            <li><strong>Contacto de apoyo:</strong> Llamar a persona de confianza</li>
            <li><strong>Actividad alternativa:</strong> Ejercicio, arte, música</li>
            <li><strong>Evaluación posterior:</strong> Reflexionar sobre la experiencia</li>
          </ol>

          <h3>Técnicas de Grounding (Conexión a Tierra)</h3>
          <p>Para momentos de intensa activación emocional:</p>
          
          <h4>Técnica 5-4-3-2-1:</h4>
          <ul>
            <li>5 cosas que puedes ver</li>
            <li>4 cosas que puedes tocar</li>
            <li>3 cosas que puedes escuchar</li>
            <li>2 cosas que puedes oler</li>
            <li>1 cosa que puedes saborear</li>
          </ul>

          <h3>Mantenimiento a Largo Plazo</h3>
          
          <h4>Rutinas Diarias de IE:</h4>
          <ul>
            <li><strong>Mañana:</strong> Check-in emocional y establecimiento de intenciones</li>
            <li><strong>Mediodía:</strong> Pausa mindful y evaluación del estado emocional</li>
            <li><strong>Tarde:</strong> Práctica de gratitud y reflexión</li>
            <li><strong>Noche:</strong> Revisión del día y relajación</li>
          </ul>

          <h4>Actividades Semanales:</h4>
          <ul>
            <li>Revisión del diario emocional</li>
            <li>Práctica de nuevas técnicas</li>
            <li>Conexión social significativa</li>
            <li>Actividad física regular</li>
            <li>Tiempo en la naturaleza</li>
          </ul>

          <h2>Inteligencia Emocional en Profesionales de la Salud</h2>
          <p>Para quienes trabajan en el campo de las adicciones:</p>
          
          <h3>Autocuidado Profesional:</h3>
          <ul>
            <li><strong>Prevención del burnout:</strong> Reconocer límites personales</li>
            <li><strong>Manejo de casos difíciles:</strong> Separación emocional saludable</li>
            <li><strong>Supervisión y apoyo:</strong> Buscar orientación regular</li>
            <li><strong>Desarrollo continuo:</strong> Formación en nuevas técnicas</li>
          </ul>

          <h3>Trabajo con Clientes:</h3>
          <ul>
            <li><strong>Empatía terapéutica:</strong> Conexión sin sobreidentificación</li>
            <li><strong>Modelado emocional:</strong> Demostrar regulación saludable</li>
            <li><strong>Facilitación del crecimiento:</strong> Guiar sin dirigir</li>
            <li><strong>Manejo de resistencia:</strong> Paciencia y comprensión</li>
          </ul>
        </div>

        <div class="actividad">
          <h2>Actividad Práctica</h2>
          <h3>Simulación de Situaciones Reales</h3>
          <p>Practica aplicar tus habilidades de IE en estos escenarios:</p>
          
          <h4>Escenario 1: Conflicto Laboral</h4>
          <p>Tu supervisor te critica tu trabajo frente a otros colegas. Te sientes humillado y enojado.</p>
          <p><strong>Aplica:</strong> Técnica STOP, comunicación asertiva, manejo de la ira</p>
          
          <h4>Escenario 2: Presión Social</h4>
          <p>Estás en una reunión familiar donde todos están bebiendo y te presionan para que "tomes solo una".</p>
          <p><strong>Aplica:</strong> Asertividad, manejo de presión, técnicas de rechazo</p>
          
          <h4>Escenario 3: Crisis Personal</h4>
          <p>Recibes noticias devastadoras sobre la salud de un ser querido.</p>
          <p><strong>Aplica:</strong> Tolerancia al malestar, búsqueda de apoyo, autocuidado</p>
          
          <h4>Escenario 4: Éxito y Celebración</h4>
          <p>Consigues un ascenso importante y quieres celebrar.</p>
          <p><strong>Aplica:</strong> Celebración saludable, manejo de emociones positivas, prevención</p>
        </div>

        <div class="reflexion-final">
          <h2>Reflexión Final</h2>
          <p>La inteligencia emocional es un viaje de por vida, no un destino. Cada día ofrece nuevas oportunidades para practicar y crecer. Recuerda que el progreso no siempre es lineal, y los retrocesos son parte normal del proceso de aprendizaje.</p>
          
          <h3>Principios para Recordar:</h3>
          <ul>
            <li>La práctica constante es más importante que la perfección</li>
            <li>Cada emoción tiene un propósito y un mensaje</li>
            <li>Las relaciones saludables son fundamentales para el bienestar</li>
            <li>El autocuidado no es egoísmo, es necesidad</li>
            <li>Siempre hay esperanza y posibilidad de crecimiento</li>
          </ul>
        </div>
      </div>
    `
  }
};

// CSS común para todas las lecciones
const cssComun = `
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  .lesson-content {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
  
  h1 {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 15px;
    margin-bottom: 30px;
    font-size: 2.5em;
    text-align: center;
  }
  
  h2 {
    color: #34495e;
    margin-top: 35px;
    margin-bottom: 20px;
    font-size: 1.8em;
    border-left: 4px solid #3498db;
    padding-left: 15px;
  }
  
  h3 {
    color: #2c3e50;
    margin-top: 25px;
    margin-bottom: 15px;
    font-size: 1.4em;
  }
  
  h4 {
    color: #34495e;
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  
  .objetivos {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 30px;
  }
  
  .objetivos h2 {
    color: white;
    border-left: 4px solid white;
    margin-top: 0;
  }
  
  .contenido-principal {
    margin-bottom: 30px;
  }
  
  .actividad {
    background: #e8f5e8;
    padding: 25px;
    border-radius: 10px;
    border-left: 5px solid #27ae60;
    margin: 30px 0;
  }
  
  .actividad h2 {
    color: #27ae60;
    margin-top: 0;
    border-left: 4px solid #27ae60;
  }
  
  .reflexion {
    background: #fff3cd;
    padding: 25px;
    border-radius: 10px;
    border-left: 5px solid #ffc107;
    margin: 30px 0;
  }
  
  .caso-clinico {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #6c757d;
    margin: 20px 0;
    font-style: italic;
  }
  
  .compromiso {
    background: #e3f2fd;
    padding: 25px;
    border-radius: 10px;
    border: 2px solid #2196f3;
    margin: 20px 0;
  }
  
  .recursos {
    background: #f3e5f5;
    padding: 25px;
    border-radius: 10px;
    border-left: 5px solid #9c27b0;
    margin: 30px 0;
  }
  
  .recursos h2 {
    color: #9c27b0;
    margin-top: 0;
    border-left: 4px solid #9c27b0;
  }
  
  .reflexion-final {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    margin-top: 40px;
  }
  
  .reflexion-final h2, .reflexion-final h3 {
    color: white;
  }
  
  ul, ol {
    margin-bottom: 20px;
  }
  
  li {
    margin-bottom: 8px;
    padding-left: 5px;
  }
  
  p {
    margin-bottom: 15px;
    text-align: justify;
  }
  
  strong {
    color: #2c3e50;
  }
  
  .highlight {
    background: #fff3cd;
    padding: 15px;
    border-radius: 5px;
    border-left: 4px solid #ffc107;
    margin: 15px 0;
  }
  
  @media (max-width: 768px) {
    body {
      padding: 10px;
    }
    
    .lesson-content {
      padding: 20px;
    }
    
    h1 {
      font-size: 2em;
    }
    
    h2 {
      font-size: 1.5em;
    }
  }
</style>
`;

// Función para generar HTML completo
function generarHTML(leccion, contenido) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contenido.titulo}</title>
    ${cssComun}
</head>
<body>
    ${contenido.contenido}
</body>
</html>`;
}

// Crear directorio de lecciones si no existe
const lessonsDir = './public/lessons';
if (!fs.existsSync(lessonsDir)) {
  fs.mkdirSync(lessonsDir, { recursive: true });
}

// Generar archivos HTML
console.log('🚀 Generando archivos HTML de Inteligencia Emocional...');

Object.entries(lecciones).forEach(([nombreArchivo, contenido]) => {
  const htmlCompleto = generarHTML(nombreArchivo, contenido);
  const rutaArchivo = path.join(lessonsDir, `${nombreArchivo}.html`);
  
  fs.writeFileSync(rutaArchivo, htmlCompleto, 'utf8');
  console.log(`✅ Generado: ${nombreArchivo}.html`);
});

console.log('\n🎉 ¡Todos los archivos HTML de Inteligencia Emocional han sido generados exitosamente!');
console.log(`📁 Ubicación: ${path.resolve(lessonsDir)}`);
console.log('\n📋 Archivos generados:');
Object.keys(lecciones).forEach(nombre => {
  console.log(`   • ${nombre}.html`);
});

console.log('\n💡 Los archivos están listos para ser utilizados en el sistema de lecciones.');