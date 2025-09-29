-- Agregar columnas de navegación a la tabla lecciones
ALTER TABLE lecciones 
ADD COLUMN leccion_anterior_id UUID,
ADD COLUMN leccion_siguiente_id UUID;

-- Agregar las referencias como foreign keys
ALTER TABLE lecciones 
ADD CONSTRAINT fk_leccion_anterior 
FOREIGN KEY (leccion_anterior_id) REFERENCES lecciones(id);

ALTER TABLE lecciones 
ADD CONSTRAINT fk_leccion_siguiente 
FOREIGN KEY (leccion_siguiente_id) REFERENCES lecciones(id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_lecciones_anterior ON lecciones(leccion_anterior_id);
CREATE INDEX idx_lecciones_siguiente ON lecciones(leccion_siguiente_id);