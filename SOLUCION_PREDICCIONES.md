# Solución para Predicciones Sin Traducir

## Problema
Todas las predicciones en `src/data/predictions.ts` están hardcoded en inglés.
Son CIENTOS de líneas de texto (emocional, cognición, entrenamiento, trabajo, relaciones para 7 fases).

## Soluciones Posibles

### Opción A: Traducción Manual Completa (RECOMENDADA PERO LARGA)
1. Crear `src/data/predictions_es.ts` con todas las predicciones traducidas
2. Crear `src/data/predictions_en.ts` con las actuales en inglés
3. En calendar page, importar según idioma:
```typescript
import predictions_es from '@/data/predictions_es';
import predictions_en from '@/data/predictions_en';

const predictions = language === 'es' ? predictions_es : predictions_en;
```

**Tiempo estimado:** 3-4 horas de traducción manual
**Ventaja:** Perfecto control sobre traducciones
**Desventaja:** Mucho trabajo manual

### Opción B: Traducción con AI Asistida (RÁPIDA)
Usa un LLM para traducir predictions.ts completo al español.

**Pasos:**
1. Copia todo el contenido de `src/data/predictions.ts`
2. Pídele a ChatGPT/Claude: "Traduce este archivo TypeScript al español, manteniendo la estructura exacta"
3. Guarda como `predictions_es.ts`
4. Aplica Opción A

**Tiempo estimado:** 30 minutos
**Ventaja:** Rápido
**Desventaja:** Necesitas revisar calidad de traducciones

### Opción C: Quick Fix Temporal (TEMPORAL)
Crear función de traducción automática SOLO para textos clave que se muestran:

```typescript
function translatePrediction(text: string, lang: 'es' | 'en'): string {
  if (lang === 'en') return text;
  
  const translations: Record<string, string> = {
    'Low to medium-low': 'Baja a media-baja',
    'Introspective and sensitive': 'Introspectiva y sensible',
    // Solo traducir los textos que aparecen en UI
  };
  
  return translations[text] || text;
}
```

**Tiempo estimado:** 1 hora
**Ventaja:** Rápido, funciona YA
**Desventaja:** No es elegante, no cubre todo

## Mi Recomendación

**Para YA (hoy):** Opción C - Quick fix temporal
**Para producción:** Opción B - Traducción con AI + revisión

## Archivo Listo para Ti

Te voy a preparar Opción C (quick fix) que puedes usar AHORA.
Luego tú decides si quieres hacer la traducción completa después.
