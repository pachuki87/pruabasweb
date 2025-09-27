-- Insertar el curso principal 'Experto en Conductas Adictivas'
INSERT INTO public.cursos (titulo, descripcion, imagen_url) VALUES (
    'Experto en Conductas Adictivas',
    'Curso completo sobre el tratamiento y comprensión de las conductas adictivas. Incluye fundamentos teóricos, criterios diagnósticos según DSM-5, terapias psicológicas innovadoras, mindfulness aplicado, terapia integral de pareja, psicología positiva y manejo de recaídas. Dirigido a profesionales de la salud mental que deseen especializarse en el campo de las adicciones.',
    'https://institutolidera.com/wp-content/uploads/2022/10/que-es-adiccion.jpg'
);

-- Obtener el ID del curso recién creado para usarlo en las lecciones
-- (Este ID se usará en el siguiente script para insertar las lecciones)