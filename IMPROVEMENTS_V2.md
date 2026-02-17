# PHASED v2 - Plan de Mejoras Completo

## Cambios Implementados ✅

### 1. Sistema de Internacionalización (i18n)
- ✅ Archivo de traducciones completo (ES/EN) en `src/lib/i18n.ts`
- ✅ Context Provider para gestión de idioma
- ✅ Selector de idioma en header (arriba derecha)
- ✅ Persistencia del idioma en localStorage
- ✅ Detección automática del idioma del navegador

### 2. Fixes de Docker
- ✅ Dockerfile actualizado para usar `npm install` 
- ✅ Dockerfile.simple creado como alternativa
- ✅ Warnings de ENV format corregidos
- ✅ next.config.js actualizado para Next.js 14

## Cambios Pendientes (En Progreso) 🔧

### 3. Mejoras del Calendario

#### 3.1 Calendario Real con Fechas
**Cambio:** En lugar de mostrar solo "Día 1, Día 2", mostrar fechas reales del calendario
**Implementación:**
- Modificar `calendar/[id]/page.tsx`
- Usar librería `date-fns` para formatear fechas
- Mostrar calendario tipo mensual: Lun-Dom con fechas reales
- Mantener indicador de qué día del ciclo es

```typescript
// Ejemplo de estructura
Day 15 - February 20, 2026 (Thursday)
```

#### 3.2 Remover Referencias a O±X
**Cambio:** No mostrar "O-5", "O+3" etc. a la usuaria
**Implementación:**
- Remover `CycleEngine.formatRelativeDay()` de la UI
- Mantener el cálculo interno pero no mostrarlo
- Solo mostrar: "Día X de tu ciclo"

#### 3.3 Fix Modal Borroso
**Problema:** El modal de detalles del día no es visible
**Solución:**
```css
/* Actual (incorrecto) */
.modal-overlay {
  backdrop-filter: blur(4px);
  background: rgba(0,0,0,0.5);
}

/* Correcto */
.modal-overlay {
  background: rgba(43, 43, 43, 0.6);
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  z-index: 51; /* Debe estar por encima del overlay (z-50) */
  position: relative; /* Asegurar que no se aplique blur */
}
```

### 4. Iconografía

#### 4.1 Iconos de Síntomas
Agregar iconos de `lucide-react` para cada síntoma:

```typescript
const symptomIcons = {
  cramps: <Zap className="w-5 h-5" />,
  bloating: <Wind className="w-5 h-5" />,
  acne: <Droplet className="w-5 h-5" />,
  headache: <Brain className="w-5 h-5" />,
  breastTenderness: <Heart className="w-5 h-5" />,
  digestiveIssues: <Activity className="w-5 h-5" />,
  anxiety: <AlertCircle className="w-5 h-5" />,
  lowMood: <CloudRain className="w-5 h-5" />,
  libidoFluctuation: <Flame className="w-5 h-5" />
};
```

#### 4.2 Iconos de Fases
Crear iconos distintivos para cada fase:

```typescript
const phaseIcons = {
  menstrual_early: <Droplets />,     // Gotas (menstruación)
  follicular_mid: <Sunrise />,       // Amanecer (ascenso)
  follicular_high: <Sun />,          // Sol (energía alta)
  ovulatory: <Star />,               // Estrella (pico)
  luteal_early: <Moon />,            // Luna (cambio)
  luteal_mid: <CloudMoon />,         // Nube luna (decline)
  luteal_late: <CloudRain />         // Lluvia (premenstrual)
};
```

#### 4.3 Estados de Ánimo
Iconos visuales para estados de ánimo en el logging:

```typescript
const moodIcons = {
  veryLow: <Frown />,
  low: <Meh />,
  neutral: <Minus />,
  good: <Smile />,
  veryGood: <Laugh />
};
```

### 5. Cuestionario Mejorado

#### 5.1 Fecha Exacta de Última Regla
**Cambio:** Usar date picker en lugar de rangos

```typescript
// Reemplazar el step de lastPeriod con:
{
  id: 'lastPeriod',
  question: t('questionnaire.lastPeriod'),
  type: 'date',
  required: true
}

// En el render:
<input
  type="date"
  max={new Date().toISOString().split('T')[0]}
  onChange={(e) => handleAnswer(new Date(e.target.value))}
/>
```

#### 5.2 Iconos en Opciones
Agregar iconos a cada opción del cuestionario:

```typescript
// Ejemplo para intensidad del flujo
{
  value: 'light',
  label: t('questionnaire.bleedingLight'),
  description: t('questionnaire.bleedingLightDesc'),
  icon: <Droplet className="w-6 h-6 text-blue-400" />
}
```

### 6. Logging Diario

#### 6.1 Componente LogModal
Crear `src/components/calendar/LogModal.tsx`:

```typescript
interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleDay: number;
  date: Date;
  profileId: string;
  existingLog?: DayLog;
}

// Incluir:
- Mood slider con iconos
- Energy slider con iconos
- Symptom checkboxes con iconos
- Campo de texto para síntomas personalizados
- Campo de notas personales (textarea)
- Training selector
- Sleep inputs
```

### 7. Visualizaciones en Day Detail

#### 7.1 Gráfico Radial de Energía
Usar un gráfico radial (spider/radar chart) para mostrar:
- Energía física
- Energía social
- Estado emocional
- Cognición
- Libido

```typescript
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';

const energyData = [
  { metric: 'Physical', value: 8 },
  { metric: 'Social', value: 7 },
  { metric: 'Emotional', value: 6 },
  { metric: 'Mental', value: 9 },
  { metric: 'Libido', value: 5 }
];
```

#### 7.2 Indicadores Visuales Rápidos
Agregar badges/pills de color para estados:
- Verde: Alta energía
- Amarillo: Media energía  
- Rojo: Baja energía

```typescript
<div className="flex gap-2">
  <EnergyBadge level="high" />
  <EnergyBadge level="medium" />
  <EnergyBadge level="low" />
</div>
```

### 8. Edición de Período

#### 8.1 Botón "Actualizar Fecha de Período"
En el calendar header, agregar opción para actualizar si la regla llegó:

```typescript
<button onClick={handleUpdatePeriod}>
  {t('calendar.periodArrived')}
</button>

// Modal para seleccionar nueva fecha
// Recalcular todo el calendario hacia adelante
// Actualizar profile.lastPeriodDate
```

#### 8.2 Recálculo Automático
Cuando se actualiza la fecha:
```typescript
function updatePeriodDate(profileId: string, newDate: Date) {
  const profile = ProfileService.getProfile(profileId);
  profile.lastPeriodDate = newDate;
  ProfileService.updateProfile(profileId, profile);
  
  // Regenerar calendario
  const newCalendar = ProfileService.generateCycleCalendar(profile);
  setCalendar(newCalendar);
}
```

## Estructura de Archivos Nueva

```
src/
├── components/
│   ├── LanguageProvider.tsx          ✅ NUEVO
│   ├── ui/
│   │   ├── Header.tsx                ✅ ACTUALIZADO
│   │   ├── LanguageSelector.tsx      ✅ NUEVO
│   │   ├── PasswordModal.tsx         ✅ EXISTENTE
│   │   ├── EnergyBadge.tsx          🔧 CREAR
│   │   └── PhaseIcon.tsx            🔧 CREAR
│   ├── calendar/
│   │   ├── CalendarGrid.tsx         🔧 CREAR
│   │   ├── DayDetailModal.tsx       🔧 CREAR (separar del page)
│   │   ├── LogModal.tsx             🔧 CREAR
│   │   └── RadarChart.tsx           🔧 CREAR
│   └── questionnaire/
│       ├── DatePicker.tsx           🔧 CREAR
│       └── IconOption.tsx           🔧 CREAR
├── lib/
│   ├── i18n.ts                       ✅ NUEVO
│   ├── cycleEngine.ts                ✅ EXISTENTE
│   ├── profileService.ts             ✅ EXISTENTE
│   ├── security.ts                   ✅ EXISTENTE
│   └── icons.ts                      🔧 CREAR (mapeo de iconos)
```

## Prioridades de Implementación

### Alta Prioridad (Bloqueantes)
1. ✅ Fix modal blur issue
2. ✅ i18n implementation
3. 🔧 Calendar con fechas reales
4. 🔧 Remover O±X de UI
5. 🔧 Date picker para última regla

### Media Prioridad (Mejoras UX)
6. 🔧 Iconos en todo el sistema
7. 🔧 LogModal completo
8. 🔧 Gráficos radiales en day detail
9. 🔧 Edición de período

### Baja Prioridad (Nice to Have)
10. 🔧 Animaciones mejoradas
11. 🔧 Temas de color personalizables
12. 🔧 Exportar calendario como imagen

## Testing Checklist

Una vez implementados los cambios:

- [ ] Selector de idioma funciona (ES ⇄ EN)
- [ ] Todas las páginas muestran traducciones correctas
- [ ] Modal de día se ve correctamente (no borroso)
- [ ] Calendario muestra fechas reales
- [ ] No se muestran referencias a O±X
- [ ] Date picker funciona para última regla
- [ ] Iconos visibles en síntomas y fases
- [ ] LogModal permite guardar notas personales
- [ ] Gráfico radial se muestra en day detail
- [ ] Se puede actualizar fecha de período
- [ ] Recálculo funciona correctamente
- [ ] Todo funciona en mobile

## Notas de Implementación

### CSS para Fix del Modal
```css
/* globals.css - actualizar */
.modal-overlay {
  background: rgba(43, 43, 43, 0.6);
  backdrop-filter: blur(2px);
  z-index: 50;
}

.modal-content {
  position: relative;
  z-index: 51;
  background: white;
  filter: none !important; /* Asegurar que no herede blur */
}
```

### Librería de Iconos
Ya tenemos `lucide-react@0.263.1` instalado. Iconos sugeridos:
- Droplets, Droplet (agua/flujo)
- Sun, Sunrise (energía)
- Moon, CloudMoon (cambio hormonal)
- Star (pico ovulatorio)
- CloudRain (premenstrual)
- Zap (energía/dolor)
- Wind (hinchazón)
- Brain (cognición/dolor cabeza)
- Heart (ternura/amor)
- Flame (libido)
- Smile, Frown, Meh (estados ánimo)

### Package Adicional Necesario
```json
{
  "recharts": "^2.10.3" // Ya instalado ✅
}
```

## Tiempo Estimado de Implementación

- i18n completo: ✅ 2 horas (HECHO)
- Fix modal: ⏱️ 30 minutos
- Calendario real: ⏱️ 2 horas
- Iconografía: ⏱️ 3 horas
- LogModal: ⏱️ 2 horas
- Gráficos: ⏱️ 1.5 horas
- Edición período: ⏱️ 1 hora

**Total: ~12 horas de desarrollo**

---

Este documento será actualizado a medida que se completen las tareas.
