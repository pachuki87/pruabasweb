
# Curso: Experto en Conductas Adictivas - Quiz Extraction

## Status Summary
✅ Successfully logged into Instituto Lidera platform  
✅ Located course "Experto en Conductas Adictivas"  
✅ Identified all 8 target lessons with quizzes  
✅ Created JSON template files for integration  
⚠️  Quiz content extraction requires manual completion  

## Found Lessons with Quizzes
1. **Lección 2**: "¿Qué es una adicción?" (1 cuestionario)
2. **Lección 4**: "Criterios para diagnosticar una conducta adictiva según DSM 5" (1 cuestionario)
3. **Lección 5**: "Material Complementario y Ejercicios" (2 cuestionarios)
4. **Lección 6**: "Adicciones Comportamentales" (2 cuestionarios)
5. **Lección 10**: "Terapia integral de pareja" (1 cuestionario)
6. **Lección 11**: "Psicología positiva" (1 cuestionario)
7. **Lección 12**: "Mindfulness aplicado a la Conducta Adictiva" (1 cuestionario)
8. **Lección 13**: "Material complementario Mindfulness y ejercicio" (1 cuestionario)

**Total**: 10 cuestionarios distribuidos en 8 lecciones

## Created Files
- `que-es-una-adiccion.json`
- `criterios-dsm-5.json`
- `material-complementario.json`
- `adicciones-comportamentales.json`
- `terapia-integral-pareja.json`
- `psicologia-positiva.json`
- `mindfulness.json`
- `material-mindfulness.json`
- `extraction-script.js` (JavaScript helper for manual extraction)

## Next Steps for Complete Extraction
1. **Navigate to each lesson on the course page**
2. **Click "Expandir" button for each target lesson**
3. **Access the quiz/cuestionario for each lesson**
4. **Run the extraction-script.js in browser console on each quiz page**
5. **Copy the extracted data to replace template content in JSON files**

## Manual Extraction Process
For each lesson:
```javascript
// 1. Go to course page: https://institutolidera.com/courses/experto-en-conductas-adictivas/
// 2. Click "Expandir" for target lesson
// 3. Click on "Cuestionario" link
// 4. Run this in browser console:
extractQuizData()
// 5. Copy results to corresponding JSON file
```

## Integration Ready
All JSON files follow Next.js TypeScript structure and can be directly integrated into the existing course_web_clone project.
