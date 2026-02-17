# Guía de Solución de Problemas - PHASED

## Problema: Docker build falla con "npm ci"

### Solución 1: Usar Dockerfile Simplificado (Recomendado)

```bash
# Usar el Dockerfile simplificado
docker build -f Dockerfile.simple -t phased-app .
docker run -p 3000:3000 phased-app
```

### Solución 2: Ejecutar sin Docker (Más Fácil)

```bash
cd phased-app
npm install
npm run dev
# Abre http://localhost:3000
```

Esto es lo más recomendado para desarrollo y pruebas locales.

---

## Instalación Paso a Paso (Sin Docker)

### 1. Descomprimir el archivo

```bash
tar -xzf phased-app.tar.gz
cd phased-app
```

### 2. Instalar Node.js (si no lo tienes)

**Windows/Mac:**
- Descarga desde https://nodejs.org (versión 18 o superior)

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Instalar dependencias

```bash
npm install
```

**Si hay errores de dependencias:**
```bash
npm install --legacy-peer-deps
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 5. Abrir en navegador

Navega a: `http://localhost:3000`

---

## Problemas Comunes

### Error: "Cannot find module 'next'"

**Solución:**
```bash
rm -rf node_modules
npm install
```

### Error: Port 3000 already in use

**Solución 1 - Cambiar puerto:**
```bash
PORT=3001 npm run dev
```

**Solución 2 - Detener proceso:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [NUMERO] /F
```

### Error: "EACCES: permission denied"

**Solución:**
```bash
sudo chown -R $USER:$USER .
npm install
```

### Error al construir: "Module not found"

**Solución:**
```bash
# Borrar caché y reinstalar
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## Build de Producción (Sin Docker)

### 1. Construir

```bash
npm run build
```

### 2. Ejecutar en producción

```bash
npm start
```

### 3. Acceder

La app estará en `http://localhost:3000`

---

## Despliegue en Vercel (Más Fácil)

### Opción 1: Via Interfaz Web

1. Crea cuenta en https://vercel.com
2. Click "New Project"
3. Importa el repositorio (o sube carpeta)
4. Vercel detectará Next.js automáticamente
5. Click "Deploy"

### Opción 2: Via CLI

```bash
npm install -g vercel
vercel
# Sigue las instrucciones
```

---

## Despliegue en Netlify

### 1. Build settings

- Build command: `npm run build`
- Publish directory: `.next`

### 2. Deploy

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Docker con Docker Compose (Alternativa)

Crea `docker-compose.yml`:

```yaml
version: '3.8'
services:
  phased:
    build:
      context: .
      dockerfile: Dockerfile.simple
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Ejecuta:
```bash
docker-compose up
```

---

## Verificar que Todo Funciona

### Checklist Post-Instalación

- [ ] `npm run dev` inicia sin errores
- [ ] Puedes acceder a http://localhost:3000
- [ ] La landing page se carga correctamente
- [ ] Puedes hacer click en "Create Profile"
- [ ] El cuestionario se muestra correctamente

Si todos los puntos están OK, ¡estás listo! 🎉

---

## Configuración de Base de Datos (Opcional - Supabase)

### Solo si quieres sincronización en la nube

1. Crea proyecto en https://supabase.com
2. Copia URL y API Key
3. Crea archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

4. Reinicia el servidor

**Nota:** La app funciona perfectamente sin Supabase (solo local).

---

## Obtener Ayuda

1. **Revisar logs:**
   ```bash
   npm run dev
   # Copia los mensajes de error
   ```

2. **Limpiar todo y empezar de nuevo:**
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

3. **Verificar versión de Node:**
   ```bash
   node --version
   # Debe ser 18.x o superior
   ```

---

## Configuración Recomendada para Desarrollo

### VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### package.json Scripts Disponibles

```bash
npm run dev      # Desarrollo (hot reload)
npm run build    # Build de producción
npm start        # Ejecutar build
npm run lint     # Verificar código
```

---

## Performance Tips

### 1. Borrar datos de prueba

Abre DevTools (F12) → Application → Local Storage → Borrar todo

### 2. Habilitar React DevTools

Instala: https://chrome.google.com/webstore/detail/react-developer-tools

### 3. Monitorear rendimiento

En DevTools → Lighthouse → Run audit

---

## ¿Necesitas Más Ayuda?

- README.md tiene documentación completa
- QUICKSTART.md tiene guía rápida
- IMPLEMENTATION_NOTES.md tiene detalles técnicos
- Revisa el código en `src/` - está bien comentado

¡Todo debería funcionar ahora! 🚀
