# CoffeeLoyalty MVP - Frontend Implementation Plan

Construir el frontend completo de CoffeeLoyalty como una PWA (Progressive Web App) usando **Next.js 14 (App Router)**. El MVP usará **mock data** para simular el backend, permitiendo demostrar todos los flujos de usuario sin necesidad de API real. El diseño será **premium/dark** con animaciones suaves y soporte white-label (colores del tenant inyectados como CSS variables).

## Stack Técnico
- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS con CSS Variables (white-label)
- **Fuente:** Google Fonts - Inter
- **Animaciones:** CSS Keyframes + Framer Motion (opcional)
- **Estado:** React Context API (mock backend)
- **PWA:** `next-pwa` para manifest y service worker básico

---

## Proposed Changes

### Scaffold del Proyecto

#### [NEW] Proyecto Next.js en `g:/proyectoss/cafe/`
Inicializar con `npx create-next-app@latest` en modo non-interactive.

---

### Design System

#### [NEW] `globals.css`
- CSS Variables para colores del tenant (`--color-primary`, `--color-secondary`)
- Variables base: dark mode, tipografía Inter, spacing tokens
- Clases utilitarias reutilizables (`.card`, `.btn-primary`, `.badge-stamp`)

#### [NEW] `tenant-mock.js`
Mock del tenant "Black Clover": `{ name, logo, colorPrimary: '#1a1a1a', colorSecondary: '#F3E5AB' }`

---

### Módulo Cliente (PWA Mobile-First)

#### [NEW] `app/page.tsx` → Login / Onboarding
- Logo del tenant (imagen generada con generate_image)
- Fondo con `color-primary` del tenant
- Botón "Continuar con Google" (mock: setea usuario en context y redirige al home)

#### [NEW] `app/home/page.tsx` → Tarjeta de Sellos
- Header: Avatar + "Hola, Gabo"
- **StampCard component:** grilla de 5 círculos (sellos obtenidos = con ícono de taza, vacíos = contorno)
- Botón flotante "Cargar Sello" → navega a `/stamp`
- Si `current_stamps === 5`: botón "Canjear Premio" → navega a `/redeem`

#### [NEW] `app/stamp/page.tsx` → Carga de Sello
- Input grande (3 caracteres, uppercase auto)
- Botón "Validar" → mock: llama a `navigator.geolocation.getCurrentPosition()`, simula éxito si el código = código mock del tenant
- Error states: fuera de rango GPS (mock), cooldown activo, código inválido

#### [NEW] `app/stamp/success/page.tsx` → Pantalla de Éxito
- Animación CSS de taza llenándose (keyframes)
- Countdown de 10 segundos con texto "Mostrá esta pantalla al barista"
- Al terminar: redirect a `/home`

#### [NEW] `app/redeem/page.tsx` → Canje de Premio
- Genera 2 palabras aleatorias de un array predefinido
- Las muestra en tipografía gigante (ej: **"NUBE CAFÉ"**)
- Estado "Esperando validación en mostrador..." (spinner)
- Mock: botón oculto "simular quemado por barista" para demo

---

### Módulo Barista

#### [NEW] `app/barista/page.tsx` → Terminal de Mostrador
- Layout 50/50 (flex)
- **Izquierda:** Código dinámico mock (ej: "AK4") en tipografía 8xl + countdown de 4h
- **Derecha:** Lista de canjes activos (mock con palabras) - botón por cada uno para "quemar"
- Al quemar: animación de éxito, el ítem desaparece de la lista

---

### Módulo Owner

#### [NEW] `app/owner/page.tsx` → Dashboard KPIs
- Cards métricas: Total Clientes, Sellos Hoy, Premios Entregados
- Gráfico de embudo (SVG puro o librería ligera) mostrando retención

#### [NEW] `app/owner/brand/page.tsx` → Configuración de Marca
- Input logo (URL o upload visual)
- Color pickers para Primario y Secundario
- Preview en tiempo real de cómo quedaría la PWA del cliente
- Botón "Guardar" → actualiza el context/mock

---

### Navegación y Layout

#### [NEW] `app/layout.tsx`
- Provee el `TenantContext` y `UserContext` a toda la app
- Inyecta CSS variables del tenant en `:root`
- Meta tags PWA básicos

#### [NEW] `components/BottomNav.tsx`
- Navegación inferior mobile-first para el módulo cliente
- Links: Home, Stamp, Rewards

---

## Verificación Plan

### Verificación en Browser (Manual)
Abrir `http://localhost:3000` con DevTools en modo mobile (iPhone 12):

1. **Login:** Ver pantalla con logo Black Clover y botón Google → click → redirige a `/home`
2. **Home:** Ver tarjeta con sellos (mock: 3/5) y botón "Cargar Sello"
3. **Stamp:** Ingresar código "AK4" → click Validar → ver pantalla de éxito con countdown de 10s
4. **Éxito:** Countdown llega a 0 → redirige a `/home` con el sello sumado
5. **Canje:** Desde home con 5 sellos → "Canjear Premio" → ver palabras gigantes
6. **Barista:** Navegar a `/barista` → ver código dinámico + lista de canjes → click en palabras para quemar
7. **Owner:** Navegar a `/owner` → ver KPIs → ir a `/owner/brand` → cambiar colores → ver preview

### Build Check
```bash
npm run build
```
Verificar que no hay errores de compilación.
