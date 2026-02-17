// NOT USED: Helper - más info en SOLUCION_PREDICCIONES.md

export function translatePrediction(text: string, language: 'es' | 'en'): string {
  if (language === 'en' || !text) return text;
  
  // Mapeo de traducciones comunes
  const translations: Record<string, string> = {
    // Energy levels
    'Very low': 'Muy baja',
    'Low': 'Baja',
    'Low to medium-low': 'Baja a media-baja',
    'Medium-low': 'Media-baja',
    'Medium': 'Media',
    'Medium to medium-high': 'Media a media-alta',
    'Medium-high': 'Media-alta',
    'High': 'Alta',
    'Very high': 'Muy alta',
    
    // Common phrases
    'preference for solitude or close circle': 'preferencia por soledad o círculo íntimo',
    'growing': 'creciente',
    'in ascent': 'en ascenso',
    'rising': 'en aumento',
    'increasing': 'aumentando',
    'peak': 'pico',
    'declining': 'en declive',
    'decreasing': 'disminuyendo',
    
    // Emotional states - primeras palabras
    'Introspective and sensitive': 'Introspectiva y sensible',
    'Growing optimism and motivation': 'Optimismo y motivación crecientes',
    'Confident and proactive': 'Segura y proactiva',
    'Energetic and outgoing': 'Enérgica y extrovertida',
    'Stable and grounded': 'Estable y centrada',
    'Increasingly sensitive': 'Cada vez más sensible',
    'Irritable and emotionally volatile': 'Irritable y emocionalmente volátil',
    
    // Work/Training common terms
    'Light cardio': 'Cardio ligero',
    'Gentle yoga': 'Yoga suave',
    'Walking': 'Caminar',
    'Swimming': 'Natación',
    'Stretching': 'Estiramientos',
    'Meditation': 'Meditación',
    'Rest': 'Descanso',
    'High-intensity interval training': 'Entrenamiento de intervalos de alta intensidad',
    'Strength training': 'Entrenamiento de fuerza',
    'Endurance work': 'Trabajo de resistencia',
    
    // Work
    'Planning and organization': 'Planificación y organización',
    'Individual focused work': 'Trabajo individual concentrado',
    'Review and debugging': 'Revisión y depuración',
    'Administrative tasks': 'Tareas administrativas',
    'Learning new skills': 'Aprender nuevas habilidades',
    'Creative brainstorming': 'Lluvia de ideas creativas',
    'Strategic planning': 'Planificación estratégica',
    'Leadership and delegation': 'Liderazgo y delegación',
    'Networking': 'Networking',
    'Presentations': 'Presentaciones',
    'Collaboration': 'Colaboración',
    'Team building': 'Construcción de equipo',
    'Execution of existing plans': 'Ejecución de planes existentes',
    'Detail-oriented work': 'Trabajo orientado al detalle',
    'High-pressure meetings': 'Reuniones de alta presión',
    'Major decisions without prior analysis': 'Decisiones importantes sin análisis previo',
    'Intense multitasking': 'Multitarea intensa',
    
    // Relationships
    'Personal space': 'Espacio personal',
    'Less social interaction': 'Menos interacción social',
    'Support without pressure': 'Apoyo sin presión',
    'Quality time with close ones': 'Tiempo de calidad con personas cercanas',
    'Social engagement': 'Compromiso social',
    'New connections': 'Nuevas conexiones',
    'Deep conversations': 'Conversaciones profundas',
    'Affection and intimacy': 'Afecto e intimidad',
    'Stability': 'Estabilidad',
    'Reassurance': 'Tranquilidad',
    'Patience from others': 'Paciencia de otros',
    'Clear communication': 'Comunicación clara',
    
    // Communication styles
    'Direct but may be curt if pressured': 'Directa pero puede ser cortante si presionada',
    'Warm and engaged': 'Cálida y comprometida',
    'Enthusiastic and expressive': 'Entusiasta y expresiva',
    'Clear and collaborative': 'Clara y colaborativa',
    'May be defensive or short': 'Puede ponerse a la defensiva o ser cortante',
    'Needs boundaries respected': 'Necesita que respeten sus límites',
    
    // Common sentence patterns
    'More prone to': 'Más propensa a',
    'May feel': 'Puede sentirse',
    'Tendency to': 'Tendencia a',
    'Likely to': 'Probablemente',
    'Less capacity for': 'Menos capacidad para',
    'Better at': 'Mejor en',
    'Optimal for': 'Óptimo para',
    'Avoid': 'Evitar',
    'Risk of': 'Riesgo de',
    'Be aware of': 'Ten en cuenta'
  };
  
  // Intentar traducción directa
  if (translations[text]) {
    return translations[text];
  }
  
  // Intentar traducción parcial (buscar fragmentos)
  let translated = text;
  for (const [en, es] of Object.entries(translations)) {
    if (text.includes(en)) {
      translated = translated.replace(en, es);
    }
  }
  
  return translated;
}

// También exportar versión para arrays
export function translateArray(arr: string[], language: 'es' | 'en'): string[] {
  return arr.map(item => translatePrediction(item, language));
}
