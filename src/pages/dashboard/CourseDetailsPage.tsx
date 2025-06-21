import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, FileText, FileQuestion, Share2, ThumbsUp, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Contenido HTML del temario del máster
const masterAdiccionesHtmlContent = `
    <h1>Máster en Adicciones e Intervención Psicosocial</h1>
    <p>Una formación orientada a la práctica, centrada en el diseño y la aplicación de intervenciones terapéuticas eficaces frente a las adicciones y conductas autodestructivas.</p>

    <div class="section">
        <h2>Consideraciones a la propuesta económica de Esvidas al Master</h2>
        <p>Como resumen de la última reunión del pasado jueves día 22 de mayo y después de un proceso de reflexión, exponemos nuestras reflexiones a la propuesta realizada.</p>
        <ol>
            <li>Entendemos perfectamente que el grupo EsVidas prefiera obtener una comisión por derivación del 25% en lugar de un hipotético beneficio del 25 %, pero lógicamente en cualquier proyecto empresarial existe el binomio riesgo-beneficio y por tanto es lógico que quien asuma más riesgo, asume mayor beneficio.</li>
            <li>No obstante en aras a obtener una mayor sinergia y crear vías de colaboración, proponemos una comisión del 20 % para el grupo Es Vidas reciba por cada alumno derivado, que opinamos que es más que generosa y sin la implicación en los riesgos que dicho proyecto comporta.</li>
            <li>Respecto a la realización de los talleres en las instalaciones de Reinservida en Jerez, al ser una partida presupuestaria considerable, necesitaríamos un mínimo de quince alumnos para poder desplazarnos a impartir los talleres presenciales al menos para poder cubrir los costes de dietas, desplazamientos y horas del profesor.</li>
            <li>En caso de no poder alcanzar dicha cantidad de alumnos, los talleres lo podríamos impartir en nuestras instalaciones en Valencia lo que no implicaría costes de dietas y desplazamientos.</li>
            <li>En resumen, estamos dispuestos a seguir con el proyecto del Máster si se tienen en cuenta estas consideraciones y seguimos contando con vuestra colaboración, que por otra parte es un requisito fundamental para el éxito del proyecto.</li>
        </ol>
    </div>

    <div class="section">
        <h2>METODOLOGÍA</h2>
        <p>El Master sigue una modalidad blended learning, que combina clases teóricas online con talleres prácticos presenciales. Esta metodología permite una mayor flexibilidad a los alumnos, quienes podrán organizar su tiempo de estudio y aplicar los conocimientos en entornos controlados durante los talleres.</p>
        <p>El comienzo del master será en Octubre de 2025 la primera edición y Febrero de 2026 la segunda edición.</p>
        <ul>
            <li><strong>Clases online:</strong> Los estudiantes tendrán acceso a una plataforma virtual donde se desarrollará la teoría.</li>
            <li><strong>Talleres presenciales:</strong> Se realizan en el centro Reinservida en Jerez, en jornadas intensivas de domingo intensivo desde las 09,00 h hasta las 15,00 h, combinando teoría con práctica. Se requiere un mínimo de 15 alumnos para la realización de estos talleres presenciales.</li>
            <li><strong>Prácticas online:</strong> Los alumnos podrán realizar prácticas sus practicas mediante sesiones de terapia de grupo online, previamente planificadas, donde podrán poner en práctica los conocimientos adquiridos a lo largo del programa.</li>
        </ul>
    </div>

    <div class="section">
        <h2>TALLERES PRESENCIALES</h2>
        <p>Los talleres presenciales se realizarán en formato de sábado y abordarán temas clave para la intervención terapéutica.</p>
        <ol>
            <li>El Perdón Interior</li>
            <li>Inteligencia Emocional</li>
            <li>Intervención Familiar</li>
        </ol>
        <p>Se informará con tiempo suficiente de antelación las fechas tanto de los talleres presenciales como de las sesiones grupales online.</p>
    </div>

    <div class="section">
        <h2>PROFESORADO</h2>
        <p>El curso cuenta con un equipo de expertos con amplia experiencia en el tratamiento de las adicciones y en la intervención terapéutica:</p>
        <ul>
            <li><strong>José Manuel Zaldua Mellado:</strong> Fundador del proyecto Reinservida y Director terapéutico. Psicólogo y Experto en Detección e Intervención en la adicción a las nuevas tecnologías.</li>
            <li><strong>Javier Carbonell Lledó:</strong> Psicoterapeuta con más de 25 años de experiencia, director del Instituto Lidera y conferenciante en el ámbito de las adicciones.</li>
            <li><strong>Lidia de Ramón:</strong> Terapeuta especializada en conductas adictivas y directora del área terapéutica de Síndrome-Adicciones. Intervencionista en adicciones y especialista en tratamientos de juego de azar.</li>
            <li><strong>Montserrat Pintado Gellida:</strong> Asesora terapéutica, responsable de la gestión comercial y de expansión. Experta en Intervención Familiar en Adiciones y profesora del Master.</li>
        </ul>
    </div>

    <div class="section">
        <h2>TITULACIÓN</h2>
        <p>Los participantes que completen el curso obtendrán el Diploma Master reconocido por la Asociación Nacional de Terapeutas en Adicciones y la Asociación Internacional de Coaching y Mentoring (AICM).</p>
    </div>

    <div class="section">
        <h2>PRÁCTICAS ONLINE</h2>
        <p>Además de la formación teórica y práctica, los alumnos podrán realizar las prácticas mediante tres sesiones online de Terapia Grupal dirigidas por un terapeuta especializado, aplicando así los conocimientos adquiridos durante el programa Máster, también tendrán la posibilidad de participar en talleres y seminarios que les permitirán actualizar sus conocimientos y crear redes de contacto profesional.</p>
    </div>

    <div class="section">
        <h2>ADMISIÓN Y MATRÍCULA</h2>
        <ul>
            <li><strong>Plazo de Admisión:</strong> El plazo para solicitar la admisión para el programa master, comienzan durante todo el mes de junio de 2025. La matrícula dará comienzo a principios de julio de 2025 y el comienzo del master será en Octubre de 2025.</li>
            <li>Ayudamos a gestionar las bonificaciones de la Fundación Tripartita en Fundae, que puede financiar una parte del coste del programa. (Preguntar en secretaria)</li>
            <li><strong>Número de plazas por edición:</strong> Mínimas: 20 Máximas: 80</li>
            <li><strong>Ubicación:</strong> Jerez de la Frontera</li>
            <li><strong>Fecha de impartición:</strong> Desde Octubre de 2025 hasta junio de 2026</li>
            <li><strong>Importe Matrícula Master:</strong> 1990 € antes del inicio del programa</li>
            <li>Nota: Consultar descuentos especiales para, familiares y personas vinculadas.</li>
        </ul>
    </div>

    <div class="section contact-info">
        <h2>Contacto:</h2>
        <p><strong>Teléfono:</strong> 691 29 83 17 - 622 25 86 15</p>
        <p><strong>Email:</strong> liderainstituto@gmail.com</p>
        <p><strong>Dirección:</strong> C/ Poeta Mas y Ros nº 41 bajo, 46022 Valencia</p>
    </div>

    <div class="section">
        <h2>Módulos del máster</h2>
        <h3>1. FUNDAMENTOS DEL PROGRAMA TERAPÉUTICO EN ADICCIONES</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Fases de un programa terapéutico</li>
                <li>Autonomía del paciente en entornos no supervisados</li>
                <li>Rol del entorno en el proceso de recuperación</li>
                <li>Farmacoterapia: uso de fármacos interdictores y de apoyo</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Se enseñan los elementos esenciales de un tratamiento integral, desde la desintoxicación hasta el mantenimiento de la abstinencia, incluyendo el abordaje en contextos abiertos. Este módulo prepara al profesional para diseñar y acompañar planes terapéuticos personalizados.</p>
        </div>

        <h3>2. TERAPIA COGNITIVA DE LAS DROGODEPENDENCIAS</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Fundamentos de la Terapia Cognitivo-Conductual (TCC)</li>
                <li>Principios de la Terapia de Aceptación y Compromiso (ACT)</li>
                <li>Introducción a Mindfulness como herramienta terapéutica</li>
                <li>Modelo transteórico del cambio (Prochaska y DiClemente)</li>
                <li>Aplicación práctica de los modelos en adicciones</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Este módulo brinda una base teórica y práctica sobre la terapia cognitiva utilizados en el tratamiento de las adicciones. Permite al estudiante comprender y aplicar distintas estrategias según el momento del proceso de cambio del paciente.</p>
        </div>

        <h3>3. FAMILIA Y TRABAJO EN EQUIPO</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Principios del enfoque sistémico</li>
                <li>Ciclos vitales familiares y crisis</li>
                <li>Roles, reglas y lealtades familiares</li>
                <li>Técnicas de intervención familiar desde la terapia sistémica</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Aquí se capacita al estudiante en el análisis y abordaje de las dinámicas familiares como sistema. Se explora el rol de la familia en el origen y mantenimiento de la adicción, así como su potencial sanador en la recuperación.</p>
        </div>

        <h3>4. RECOVERY COACHING EN ADICCIONES</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Recovery Coaching y confidencialidad</li>
                <li>Burnout y estrategias de prevención en el proceso de Recovery</li>
                <li>Supervisión clínica, Coaching y cuidado emocional</li>
                <li>Relación terapéutica y manejo de la contratransferencia</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Ofrece un espacio de reflexión y formación sobre la práctica profesional, con énfasis en el Recovery Coaching. Se promueve un ejercicio ético, saludable y consciente del rol clínico y de las relaciones interpersonales.</p>
        </div>

        <h3>5. PSICOLOGÍA APLICADA A LAS ADICCIONES</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Negación y ambivalencia frente al cambio</li>
                <li>Mecanismos de defensa y resistencia</li>
                <li>Psicoeducación para pacientes y familias</li>
                <li>Evaluación de comorbilidades psicológicas</li>
            </ul>
            <h4>Resumen:</h4>
            <p>El módulo profundiza en las dinámicas psicológicas de la persona adicta y su entorno. Ofrece herramientas para abordar la negación, facilitar el insight y trabajar con la familia como sistema de apoyo en el proceso terapéutico.</p>
        </div>

        <h3>6. INTERVENCIÓN FAMILIAR Y RECOVERY MENTORING</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Impacto de la adicción en la estructura familiar</li>
                <li>Comunicación no violenta y vínculos funcionales</li>
                <li>Rol del “mentor en recuperación”</li>
                <li>Dinámicas emocionales y autocuidado familiar</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Se capacita al estudiante para trabajar con la familia como parte del proceso de recuperación, promoviendo un enfoque colaborativo y emocionalmente consciente. Además, se introducen figuras clave como los mentores o pares en recuperación.</p>
        </div>

        <h3>7. NUEVOS MODELOS TERAPÉUTICOS APLICADOS A LAS ADICCIONES</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Técnica de los cinco pasos</li>
                <li>La ventana de Johari como herramienta de autoconocimiento</li>
                <li>Reencuentro con el “niño interior” y trabajo con el trauma</li>
                <li>Técnicas de integración emocional</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Este módulo ofrece enfoques contemporáneos e integradores para abordar las raíces emocionales de la adicción. Se explorarán nuevas herramientas terapéuticas centradas en el crecimiento personal, la conciencia y la reconstrucción de la identidad.</p>
        </div>

        <h3>8. GESTIÓN DE LAS ADICCIONES DESDE LA PERSPECTIVA DE GÉNERO</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Género y consumo de sustancias</li>
                <li>Violencias asociadas y consumo en mujeres</li>
                <li>Masculinidades y adicción</li>
                <li>Interseccionalidad y vulnerabilidades específicas</li>
            </ul>
            <h4>Resumen:</h4>
            <p>El módulo profundiza en cómo las cuestiones de género atraviesan la experiencia adictiva y su tratamiento. Favorece una mirada inclusiva, crítica y contextualizada, capaz de dar respuesta a necesidades específicas.</p>
        </div>

        <h3>9. INTELIGENCIA EMOCIONAL</h3>
        <div class="subsection">
            <h4>Subtemas:</h4>
            <ul>
                <li>Estructuras cerebrales implicadas en la adicción</li>
                <li>Circuitos de recompensa y dopamina</li>
                <li>Gestión de las emociones en la conducta</li>
                <li>Cambios en la personalidad y el aprendizaje</li>
                <li>Gestión de las emociones disfuncionales</li>
            </ul>
            <h4>Resumen:</h4>
            <p>Brinda fundamentos científicos para entender cómo las adicciones afectan a nuestras emociones. Esta comprensión permite fundamentar las intervenciones terapéuticas y explicar al paciente y su entorno el impacto real del consumo y como gestionar las emociones disfuncionales.</p>
        </div>

        <h3>10. TRABAJO FINAL DE MASTER</h3>
        <div class="subsection">
            <p>El trabajo final de master consiste en la elaboración de un proyecto inédito e innovador sobre cualquier aspecto metodológico relacionado con las adicciones. La finalidad es investigar y aportar conocimientos y nuevos enfoques que permitan avanzar en el desarrollo metodológico y la intervención psicosocial en el ámbito de las conductas adictivas.</p>
        </div>

        <h3>11. TEMAS COMPLEMENTARIOS</h3>
        <div class="subsection">
            <ul>
                <li>LA MOTIVACIÓN AL CAMBIO: LA ENTREVISTA</li>
                <li>LA SOBRIEDAD: LIBRO DE SOBRIEDAD</li>
                <li>TERAPIA FAMILIAR SISTÉMICA</li>
                <li>NUEVOS MODELOS TERAPÉUTICOS PARA LAS ADICCIONES</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Talleres Presenciales</h2>
        <h3>1. EL PERDÓN INTERIOR</h3>
        <div class="subsection">
            <p>El taller proporciona un espacio seguro y de apoyo donde los participantes pueden explorar sus emociones y avanzar hacia un estado de bienestar emocional más equilibrado.</p>
            <h4>Objetivos del Taller:</h4>
            <ul>
                <li>Comprensión del Perdón: Definir qué significa el perdón y cómo influye en nuestra salud emocional.</li>
                <li>Sanación Emocional: Explorar la relación entre el perdón y la sanación de heridas internas.</li>
                <li>Liberación del Rencor: Aprender a soltar resentimientos y emociones negativas que afectan la calidad de vida.</li>
            </ul>
            <h4>Temas Principales:</h4>
            <ul>
                <li>Concepto de Perdón</li>
                <li>Diferenciar entre perdonar y olvidar.</li>
                <li>Entender la importancia de perdonar como un acto personal y no necesariamente relacionado con reconciliación.</li>
                <li>Perdón hacia Uno Mismo</li>
                <li>Reflexionar sobre la autocrítica y las expectativas personales.</li>
                <li>Ejercicios para identificar y liberar culpas y emociones negativas sobre decisiones pasadas.</li>
                <li>Perdón hacia los Demás</li>
            </ul>
            <h4>Técnicas y Ejercicios Prácticos:</h4>
            <ul>
                <li>Ejercicios prácticos grupales (juegos de rol, debates).</li>
                <li>Espacios de reflexión y compartir experiencias en grupo.</li>
                <li>Prácticas de meditación y mindfulness para centrar la mente.</li>
            </ul>
            <p>Celebración: Domingo desde las 09,00 h hasta las 15,00 h</p>
        </div>

        <h3>2. INTELIGENCIA EMOCIONAL</h3>
        <div class="subsection">
            <p>Este taller busca empoderar a los participantes para que puedan utilizar la inteligencia emocional como una herramienta clave para mejorar su bienestar y sus relaciones en diversos ámbitos de la vida. Aquí tienes un resumen de los temas y actividades que se abordarán en este taller:</p>
            <h4>Objetivos del Taller:</h4>
            <ul>
                <li>Desarrollar la autoconciencia emocional.</li>
                <li>Aprender a gestionar las emociones propias y ajenas.</li>
                <li>Mejorar las habilidades interpersonales y la comunicación.</li>
                <li>Fomentar una toma de decisiones más consciente y efectiva.</li>
            </ul>
            <h4>Temas Principales:</h4>
            <ol>
                <li>Introducción a la Inteligencia Emocional:
                    <ul>
                        <li>Definición y relevancia de la IE en la vida personal y profesional.</li>
                        <li>Componentes clave según Daniel Goleman: autoconciencia, autorregulación, motivación, empatía y habilidades sociales.</li>
                    </ul>
                </li>
                <li>Conciencia de uno mismo:
                    <ul>
                        <li>Autoconocimiento</li>
                        <li>Autoestima</li>
                        <li>Autorrealización y reconocimiento de emociones básicas y técnicas para fomentar la reflexión</li>
                        <li>Patrones de respuesta emocional</li>
                        <li>Ejercicios como diarios emocionales</li>
                    </ul>
                </li>
                <li>Autorregulación:
                    <ul>
                        <li>Estrategias para gestionar las emociones intensas (mindfulness, respiración profunda)</li>
                        <li>¿Qué es y cómo manejar la carga emocional?.</li>
                        <li>Técnicas para transformar reacciones negativas en constructivas.</li>
                    </ul>
                </li>
                <li>Empatía:
                    <ul>
                        <li>Desarrollo de la capacidad de entender las emociones de los demás.</li>
                        <li>Actividades que fomentan la escucha activa y la comunicación no verbal.</li>
                    </ul>
                </li>
                <li>Habilidades Sociales:
                    <ul>
                        <li>Técnicas de comunicación efectiva y asertiva.</li>
                        <li>Práctica de resolución de conflictos mediante role-playing.</li>
                    </ul>
                </li>
                <li>Motivación Personal:
                    <ul>
                        <li>Reflexión sobre valores y metas personales.</li>
                        <li>Establecimiento de objetivos y estrategias para mantener la motivación.</li>
                    </ul>
                </li>
            </ol>
            <h4>Técnicas y Ejercicios Prácticos:</h4>
            <ul>
                <li>Ejercicios prácticos grupales (juegos de rol, debates).</li>
                <li>Espacios de reflexión y compartir experiencias en grupo.</li>
                <li>Prácticas de meditación y mindfulness para centrar la mente.</li>
            </ul>
            <p>Celebración: Domingo desde las 09,00 h hasta las 15,00 h</p>
        </div>

        <h3>3. INTERVENCIÓN FAMILIAR</h3>
        <div class="subsection">
            <p>Este taller busca capacitar a las familias para abordar desafíos comunes, mejorar la comunicación y construir un ambiente más saludable y solidario en el hogar.</p>
            <h4>Objetivos del Taller:</h4>
            <ul>
                <li>Proporcionar herramientas y estrategias para mejorar la comunicación y las relaciones familiares.</li>
                <li>Facilitar la identificación y resolución de conflictos familiares.</li>
                <li>Promover habilidades para el apoyo mutuo y la cohesión dentro del núcleo familiar.</li>
                <li>Fomentar la comprensión de dinámicas familiares y su impacto en el bienestar emocional.</li>
            </ul>
            <h4>Temas Principales:</h4>
            <ol>
                <li>Introducción a la Intervención Familiar:
                    <ul>
                        <li>Definición de intervención familiar y su importancia en el fortalecimiento de relaciones.</li>
                        <li>Rol de la intervención en contextos de crisis y cambios familiares.</li>
                    </ul>
                </li>
                <li>Dinámicas Familiares:
                    <ul>
                        <li>Identificación de roles y patrones de comportamiento en la familia.</li>
                        <li>Entender cómo las dinámicas familiares afectan las relaciones y la comunicación.</li>
                    </ul>
                </li>
                <li>Comunicación Efectiva:
                    <ul>
                        <li>Técnicas para mejorar la comunicación entre miembros de la familia.</li>
                        <li>Ejercicios prácticos que fomentan la escucha activa y la expresión asertiva.</li>
                    </ul>
                </li>
                <li>Resolución de Conflictos:
                    <ul>
                        <li>Estrategias para abordar y resolver conflictos familiares de manera constructiva.</li>
                        <li>Técnicas de negociación y mediación para facilitar el diálogo.</li>
                    </ul>
                </li>
                <li>Apoyo y Empatía:
                    <ul>
                        <li>Importancia del apoyo emocional y la empatía dentro de la familia.</li>
                        <li>Actividades que fomentan la comprensión y validación de las emociones de cada miembro.</li>
                    </ul>
                </li>
                <li>Planificación Familiar:
                    <ul>
                        <li>Herramientas para establecer objetivos familiares y crear planes de acción.</li>
                        <li>Reflexión sobre valores familiares y cómo estos guían las decisiones.</li>
                    </ul>
                </li>
            </ol>
            <h4>Técnicas y Ejercicios Prácticos:</h4>
            <ul>
                <li>Ejercicios prácticos grupales (juegos de rol, debates).</li>
                <li>Espacios de reflexión y compartir experiencias en grupo.</li>
                <li>Prácticas de meditación y mindfulness para centrar la mente.</li>
            </ul>
            <p>Celebración: Domingo desde las 09,00 h hasta las 15,00 h</p>
        </div>
    </div>
`;

type CourseDetailsProps = {
  role: string;
};

type Course = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  profesor_nombre: string;
  created_at: string;
  tecnologias: string[];
  capitulos_count: number;
  materiales_count: number;
  estudiantes_count: number;
};

type Chapter = {
  id: string;
  titulo: string;
  descripcion: string | null;
  video_url: string | null;
};

type Material = {
  name: string;
  url: string;
};

const CourseDetailsPage: React.FC<CourseDetailsProps> = ({ role }) => {
  const { id: courseId } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLoading, setIsLoading] = useState(true);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    if (activeTab === 'materials' && courseId) {
      fetchMaterials();
    }
  }, [activeTab, courseId]);

  const fetchCourseDetails = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockCourse: Course = {
          id: courseId || 'c563c497-5583-451a-a625-a3c07d6cb6b4',
          titulo: 'Master en Adicciones',
          descripcion: 'Programa especializado en el estudio y tratamiento de las adicciones. Este curso proporciona una formación integral en el campo de las adicciones comportamentales y químicas.',
          imagen_url: null,
          profesor_nombre: 'pablocardonafeliu',
          created_at: '2023-06-15',
          tecnologias: ['Psicología', 'Neurociencia', 'Terapia', 'Rehabilitación'],
          capitulos_count: 12,
          materiales_count: 5, // This count should reflect actual materials
          estudiantes_count: 24,
        };
        
        const mockChapters: Chapter[] = [
          {
            id: '1',
            titulo: 'Introducción a las Adicciones',
            descripcion: 'Fundamentos y conceptos básicos sobre adicciones',
            video_url: null,
          },
          {
            id: '2',
            titulo: 'Neurobiología de las Adicciones',
            descripcion: 'Estudio de los mecanismos cerebrales en las adicciones',
            video_url: null,
          },
          {
            id: '3',
            titulo: 'Tratamiento y Rehabilitación',
            descripcion: 'Estrategias y métodos de intervención terapéutica',
            video_url: null,
          },
        ];
        
        setCourse(mockCourse);
        setChapters(mockChapters);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setIsLoading(false);
    }
  };

  const fetchMaterials = async () => {
    if (!courseId) return;
    setIsMaterialsLoading(true);
    try {
      // Usar el bucket 'cursomasteradicciones' que existe en Supabase
      const { data, error } = await supabase.storage
        .from('cursomasteradicciones')
        .list('', { // List from the root of the bucket
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      console.log('Supabase Storage list response:', { data, error });

      if (error) {
        console.error('Error al obtener materiales de Supabase Storage:', error);
        setMaterials([]);
        return;
      }

      // Filter files by courseId if necessary, or assume all files in this bucket are for this course
      // Based on the user's screenshot, the file is directly in the bucket.
      // We'll assume for now all files in 'cursomasteradicciones' are relevant,
      // but a more robust solution would involve metadata or a different storage structure.
      
      // Generate signed URLs for each file to ensure proper access
      const fetchedMaterials: Material[] = [];
      
      for (const file of data) {
        try {
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('cursomasteradicciones')
            .createSignedUrl(file.name, 3600); // 1 hour expiry
          
          if (urlError) {
            console.error('Error creating signed URL for', file.name, ':', urlError);
            continue;
          }
          
          fetchedMaterials.push({
            name: file.name,
            url: signedUrlData.signedUrl,
          });
        } catch (error) {
          console.error('Error processing file', file.name, ':', error);
        }
      }
      setMaterials(fetchedMaterials);
      // Update materials_count in course state
      setCourse(prevCourse => prevCourse ? { ...prevCourse, materiales_count: fetchedMaterials.length } : null);
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      setMaterials([]);
    } finally {
      setIsMaterialsLoading(false);
    }
  };

  const getImageUrl = () => {
    if (course?.imagen_url) {
      return course.imagen_url;
    }
    
    // Default image based on course title
    // Removed specific images for PHP, Python, and Flask
    return 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  if (!courseId) {
    return <div>Se requiere el ID del curso</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-100 h-64 rounded-lg"></div>
          <div className="bg-gray-100 h-12 rounded-lg"></div>
          <div className="bg-gray-100 h-48 rounded-lg"></div>
        </div>
      ) : course ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
                <img
                  src={getImageUrl()}
                  alt={course.titulo}
                  className="max-h-48 object-contain"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h1 className="text-2xl font-bold mb-2">{course.titulo}</h1>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">Instructor: {course.profesor_nombre}</span>
                </div>
                
                <p className="text-gray-700 mb-4">{course.descripcion}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tecnologias.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{course.capitulos_count}</div>
                    <div className="text-sm text-gray-500">Capítulos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{course.materiales_count}</div>
                    <div className="text-sm text-gray-500">Materiales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{course.estudiantes_count}</div>
                    <div className="text-sm text-gray-500">Estudiantes</div>
                  </div>
                </div>
                
                {role === 'student' && (
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Inscribirse en el Curso
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('resumen')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'resumen'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'chapters'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Capítulos
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'quizzes'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <FileQuestion className="w-4 h-4 inline mr-1" />
                  Cuestionarios
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'materials'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Materiales
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'resumen' && (
                <div dangerouslySetInnerHTML={{ __html: masterAdiccionesHtmlContent }} />
              )}
              
              {activeTab === 'chapters' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Capítulos del Curso</h2>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/courses/${courseId}/chapters/add`}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Añadir Capítulo
                      </Link>
                    )}
                  </div>
                  
                  {chapters.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay capítulos disponibles para este curso todavía.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <div key={chapter.id} className="border rounded-md p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium">
                              <span className="text-blue-600 mr-2">{index + 1}.</span>
                              {chapter.titulo}
                            </h3>
                            
                            {role === 'teacher' && (
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  Editar
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {chapter.descripcion && (
                            <p className="text-gray-600 text-sm mt-1">{chapter.descripcion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'quizzes' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Cuestionarios del Curso</h2>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/quizzes/add`}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Añadir Cuestionario
                      </Link>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-center py-4">
                    No hay cuestionarios disponibles para este curso todavía.
                  </p>
                </div>
              )}

              {activeTab === 'materials' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Materiales del Curso</h2>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/courses/edit/${courseId}`} // Link to edit page to upload materials
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Añadir Material
                      </Link>
                    )}
                  </div>
                  
                  {isMaterialsLoading ? (
                    <p className="text-gray-500 text-center py-4">
                      Cargando materiales...
                    </p>
                  ) : materials.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay materiales disponibles para este curso todavía.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {materials.map((material, index) => (
                        <div key={index} className="border rounded-md p-4 hover:bg-gray-50 flex items-center justify-between">
                          <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-red-600 hover:underline flex items-center"
                          >
                            <FileText className="w-5 h-5 mr-2" />
                            {material.name}
                          </a>
                          {/* Add download/delete options if needed for teacher role */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Curso no encontrado</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
