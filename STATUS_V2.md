# PHASED v2 - Estado de Implementación

## ✅ COMPLETADO

### 1. Sistema i18n (Español/Inglés)
- ✅ Traducciones completas (ES/EN) en `src/lib/i18n.ts`
- ✅ LanguageProvider context
- ✅ Selector de idioma en header
- ✅ Persistencia en localStorage
- ✅ Auto-detección idioma navegador

### 2. Correcciones Docker
- ✅ Dockerfile actualizado (npm install sin package-lock)
- ✅ Dockerfile.simple alternativo
- ✅ ENV format corregido
- ✅ next.config.js actualizado

### 3. Fix Modal Blur
- ✅ CSS corregido en globals.css
- ✅ z-index apropiado
- ✅ Modal ahora visible y funcional

### 4. Sistema de Iconos
- ✅ Librería de iconos creada (`src/lib/icons.ts`)
- ✅ Mapeo de símbolos → iconos
- ✅ Mapeo de fases → iconos
- ✅ Mapeo de estados de ánimo → iconos

## 🔧 PARCIALMENTE COMPLETADO

### 5. Header con i18n
- ✅ Integrado LanguageSelector
- ✅ Navegación traducida
- ⚠️ Faltan traducciones en páginas internas

## ❌ PENDIENTE (Requiere Implementación)

### 6. Aplicar i18n a Todas las Páginas
**Páginas que necesitan actualización:**
- `src/app/page.tsx` (Landing)
- `src/app/profile/page.tsx` (Profile picker)
- `src/app/profile/create/page.tsx` (Questionnaire)
- `src/app/calendar/[id]/page.tsx` (Calendar)
- `src/app/learn/page.tsx` (Learn page)

**Acción:** Reemplazar strings hardcodeados con `t('key')`

### 7. Calendario con Fechas Reales
**Estado:** No implementado
**Necesita:**
```typescript
// Usar date-fns para formateo
import { format, addDays } from 'date-fns';
import { es, en } from 'date-fns/locale';

// En cada día del calendario:
const realDate = addDays(profile.lastPeriodDate, day - 1);
const formattedDate = format(realDate, 'EEEE, MMMM d', {
  locale: language === 'es' ? es : en
});
```

### 8. Remover O±X de UI
**Estado:** Aún visible
**Acción:**
- Buscar todas las referencias a `CycleEngine.formatRelativeDay`
- Remover de la UI
- Mantener solo internamente para cálculos

### 9. Date Picker para Última Regla
**Estado:** Usa rangos aproximados
**Necesita:**
```typescript
<input
  type="date"
  max={new Date().toISOString().split('T')[0]}
  value={lastPeriodDate}
  onChange={(e) => setLastPeriodDate(new Date(e.target.value))}
/>
```

### 10. LogModal Completo
**Estado:** No existe
**Necesita crear:** `src/components/calendar/LogModal.tsx`
**Incluir:**
- Slider de mood con iconos
- Slider de energía con iconos  
- Checkboxes de síntomas (con iconos)
- Campo texto para síntomas personalizados
- Textarea para notas personales
- Sleep inputs
- Stress slider
- Training selector

### 11. Gráficos Radiales en Day Detail
**Estado:** No implementado
**Necesita:**
```typescript
import { Radar, RadarChart, PolarGrid } from 'recharts';

const data = [
  { metric: 'Physical', value: energyLevel },
  { metric: 'Social', value: socialLevel },
  { metric: 'Mental', value: cognitionLevel },
  { metric: 'Libido', value: libidoLevel }
];

<RadarChart data={data}>
  <PolarGrid />
  <Radar dataKey="value" />
</RadarChart>
```

### 12. Aplicar Iconos al Cuestionario
**Estado:** No implementado
**Acción:** Actualizar cada opción para incluir icono visual

### 13. Aplicar Iconos a Síntomas en UI
**Estado:** No implementado
**Acción:** Renderizar iconos junto a cada síntoma listado

### 14. Edición de Período
**Estado:** No implementado
**Necesita:**
- Botón "Actualizar fecha de período" en calendar
- Modal con date picker
- Función de recálculo de calendario
- Actualizar `profile.lastPeriodDate`

## 📋 PRÓXIMOS PASOS RECOMENDADOS

### Paso 1: Aplicar i18n (2-3 horas)
Reemplazar todos los textos hardcodeados con llamadas a `t()`:
```typescript
// Antes:
<h1>Your Profiles</h1>

// Después:
<h1>{t('profile.title')}</h1>
```

### Paso 2: Calendario Real (2 horas)
- Instalar date-fns locales
- Modificar CalendarGrid para mostrar fechas reales
- Formato: "Lunes, 15 de Febrero" o "Monday, February 15"

### Paso 3: Remover O±X (30 min)
- Buscar todas las instancias
- Comentar o eliminar

### Paso 4: Date Picker (1 hora)
- Actualizar questionnaire step
- Usar input type="date"

### Paso 5: LogModal (3 horas)
- Crear componente completo
- Integrar con ProfileService
- Incluir campos personalizados

### Paso 6: Iconos (2 horas)
- Aplicar a cuestionario
- Aplicar a calendar  
- Aplicar a day detail

### Paso 7: Gráficos (2 horas)
- Integrar Recharts
- Crear visualización radial
- Estilizar apropiadamente

### Paso 8: Edición Período (1 hora)
- UI para actualizar
- Lógica de recálculo

**Tiempo total estimado: 13-15 horas**

## 🚀 CÓMO CONTINUAR

1. **Opción A - Todo de una vez:**
   Implementar todos los cambios pendientes antes de release

2. **Opción B - Iterativo (recomendado):**
   - Release v2.0: i18n + calendar real + fixes
   - Release v2.1: Iconos completos
   - Release v2.2: LogModal + gráficos
   - Release v2.3: Edición período

## 📦 ESTADO ACTUAL DEL PAQUETE

**Lo que funciona ahora:**
- ✅ Cambio de idioma (ES/EN)
- ✅ Modal visible (no borroso)
- ✅ Sistema de iconos listo para usar
- ✅ Docker funcional

**Lo que aún no funciona:**
- ❌ Textos aún en inglés (falta aplicar i18n a páginas)
- ❌ Calendario muestra "Day X" no fechas reales
- ❌ Muestra O±X (debe ocultarse)
- ❌ Logging no tiene campos personalizados
- ❌ No hay gráficos visuales en day detail
- ❌ No se puede editar fecha de período

## 🎯 PARA RELEASE MÍNIMO VIABLE

**Debe tener (bloqueante):**
1. ✅ i18n funcional → YA ESTÁ
2. ❌ Aplicar i18n a todas las páginas → FALTA
3. ✅ Fix modal blur → YA ESTÁ
4. ❌ Calendario con fechas reales → FALTA
5. ❌ Remover O±X de UI → FALTA

**Nice to have (puede esperar):**
- Iconos completos
- LogModal con campos personalizados
- Gráficos radiales
- Edición de período

