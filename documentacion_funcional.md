# Documentación Funcional: CoffeeLoyalty MVP
**Versión:** 1.0  
**Estado:** Definición de MVP  
**Analista:** Senior AI Consultant  

---

## 1. Visión General del Producto
**CoffeeLoyalty** es una plataforma SaaS (Software as a Service) orientada a cafeterías de especialidad que busca digitalizar la experiencia de las tarjetas de fidelización físicas. Mediante una **PWA (Progressive Web App)**, los clientes acumulan sellos digitales por sus compras para obtener recompensas, mientras que los dueños acceden a métricas de retención y comportamiento de consumo.

### Objetivos Principales:
* Eliminar la fricción de instalar apps nativas (Uso de PWA).
* Garantizar un sistema de sellado seguro y ágil para el barista.
* Ofrecer personalización estética por marca (White-label UI).

---

## 2. Arquitectura de Usuarios y Roles
La plataforma es **Multi-tenant**. Los datos de clientes y sellos son compartidos entre sucursales de una misma marca (ej: Black Clover), pero aislados entre diferentes marcas.

| Rol | Acceso | Responsabilidades |
| :--- | :--- | :--- |
| **Cliente** | Web App (Mobile) | Login, sumar sellos, ver progreso, canjear premios. |
| **Barista** | Web App (Tablet/Mobile) | Validar sellos visualmente, "quemar" premios con palabras clave. |
| **Owner (Dueño)** | Dashboard Web (Desktop) | Configurar marca, gestionar sucursales, visualizar KPIs. |

---

## 3. Especificaciones Funcionales (MVP)

### 3.1. Onboarding y Autenticación
* **Método:** Únicamente a través de **Google Login** para garantizar identidad y facilitar la captura de emails para marketing.
* **Perfil:** El sistema debe extraer Foto y Nombre de Google, permitiendo al usuario definir un "Alias" opcional.

### 3.2. Mecanismo de Sellado (Anti-Fraude)
Para evitar el fraude sin ralentizar el servicio, se implementa el **"Token Dinámico de Mostrador"**:
1.  **Código Dinámico:** El local muestra un código de 3 caracteres (ej: `AK4`) que cambia cada 4 horas.
2.  **Validación GPS:** El cliente solo puede ingresar el código si su ubicación está dentro de un radio de ~50 metros del local.
3.  **Animación de Éxito:** Al validar, la app muestra una pantalla de éxito con un timer de 10 segundos para que el barista la vea.
4.  **Cooldown:** Un mismo usuario no puede cargar más de 1 sello cada **5 horas**.

### 3.3. Sistema de Recompensas (Lógica 5+1)
* **Progreso:** El tablero consta de 5 espacios de sellos.
* **Hito:** Al completar el 5to sello, se desbloquea automáticamente el "Premio" (6ta consumición gratis o beneficio definido).

### 3.4. Flujo de Canje (El "Quemado")
Inspirado en el sistema de seguridad de entrega de paquetes:
1.  El cliente activa el canje en su App.
2.  El sistema genera **dos palabras aleatorias** (ej: "LUNA CAFÉ").
3.  El cliente dicta las palabras al barista.
4.  El barista selecciona las palabras en su panel de "Premios Activos" para invalidar el cupón y entregar el producto.

---

## 4. Dashboard y KPIs (Módulo Owner)
El dueño de la marca podrá visualizar:
* **Fidelización:** Cantidad de usuarios con 1, 2, 3, 4 o 5 sellos.
* **Tasa de Retorno:** Tiempo promedio que tarda un cliente en volver.
* **Venta Proyectada:** Estimación de ingresos basada en sellos otorgados vs. ticket promedio.
* **Configuración UI:** Selector de colores (Primario/Secundario) y carga de Logo.

---

## 5. Reglas de Negocio Críticas (Resumen para Devs)
* **RN01:** Los sellos de "Black Clover Caballito" deben ser válidos en "Black Clover Villa Crespo".
* **RN02:** Si el GPS está desactivado, el usuario no puede sumar sellos (excepción manual por el barista requerida).
* **RN03:** El código dinámico es único por Marca/Sucursal.
* **RN04:** Soporte para notificaciones vía Web Push para recordatorios de "Sello Pendiente" si el usuario pasa cerca del local.

---

## 6. Stack Tecnológico Sugerido
* **Frontend:** React / Next.js (PWA capacitada).
* **Backend:** Node.js / Firebase (para Real-time en el panel del barista).
* **Auth:** Google Cloud Identity.
* **Geolocalización:** Browser Geolocation API.

# Especificación Técnica y UI/UX: CoffeeLoyalty MVP
**Versión:** 1.1 (Bajada a Tierra)  
**Estado:** Definición Técnica para Desarrollo  

---

## 1. Frontend: Definición de Pantallas (UI/UX)

La aplicación utilizará una arquitectura basada en componentes, adaptando los estilos (Colores, Logo) según el `tenant_id` (la marca de la cafetería) que se cargue en la URL o QR.

### 1.1. Módulo Cliente (PWA Mobile-First)
* **Pantalla 1: Login / Onboarding**
    * **UI:** Logo de la cafetería (ej. Black Clover), fondo con color primario de la marca.
    * **Acción:** Botón grande "Continuar con Google".
* **Pantalla 2: Home / Tarjeta de Sellos**
    * **UI:** Saludo ("Hola Gabo"), avatar del usuario.
    * **Componente Core:** Grilla visual de 5 espacios. Los sellos obtenidos se muestran opacos/coloreados.
    * **Acción:** Botón flotante "Cargar Sello".
* **Pantalla 3: Carga de Sello (Validación)**
    * **UI:** Input de texto grande para 3 caracteres alfanuméricos.
    * **Acción:** Al presionar "Validar", el navegador solicita permisos de Ubicación (GPS).
* **Pantalla 4: Pantalla de Éxito (Anti-Fraude)**
    * **UI:** Animación de éxito (ej. taza llenándose). 
    * **Componente Core:** Un temporizador de 10 segundos en reversa y el texto *"Mostrá esta pantalla al barista"*.
* **Pantalla 5: Canje de Premio**
    * **UI:** Se activa solo cuando el usuario tiene 5 sellos y presiona "Canjear".
    * **Componente Core:** Muestra en texto gigante dos palabras aleatorias (ej: **"NUBE CAFÉ"**) y el estado "Esperando validación en mostrador...".

### 1.2. Módulo Barista (Tablet/Web App)
* **Pantalla 1: Terminal de Mostrador**
    * **UI:** Pantalla dividida.
    * **Mitad Izquierda (Token):** Muestra el Código Dinámico actual (ej. `AK4`) en tamaño gigante y un reloj de cuenta regresiva indicando cuándo cambia (ciclo de 4 horas).
    * **Mitad Derecha (Canjes Activos):** Lista en tiempo real de los premios que los clientes están intentando canjear en ese momento (ej. un botón que dice "NUBE CAFÉ").
    * **Acción:** El barista toca "NUBE CAFÉ" para quemar el premio y entregarlo.

### 1.3. Módulo Owner (Desktop Dashboard)
* **Pantalla 1: Resumen (KPIs)**
    * **UI:** Tarjetas de métricas: Total Clientes, Sellos Hoy, Premios Entregados.
    * **Gráfico:** Embudo de retención (cuántos usuarios tienen 1 sello, cuántos llegan al 5).
* **Pantalla 2: Configuración de Marca**
    * **UI:** Inputs para subir Logo (PNG/SVG), selector de Color Primario (HEX) y Color Secundario (HEX). Gestión de sucursales (Nombre, Latitud, Longitud).

---

## 2. Backend: Modelo de Datos (Base de Datos)

Se recomienda una base de datos relacional (PostgreSQL) o NoSQL estructurada (Firestore) para manejar el Multi-tenant.

### Entidades Principales:

**1. Tabla `Tenant` (La Marca)**
* `id` (UUID)
* `name` (String, ej: "Black Clover")
* `logo_url` (String)
* `color_primary` (String, HEX)
* `color_secondary` (String, HEX)

**2. Tabla `Branch` (Las Sucursales)**
* `id` (UUID)
* `tenant_id` (Relación con Tenant)
* `name` (String, ej: "Villa Crespo")
* `latitude` (Decimal)
* `longitude` (Decimal)
* `allowed_radius_meters` (Int, ej: 50)

**3. Tabla `User` (Los Clientes)**
* `id` (UUID)
* `google_id` (String)
* `email` (String)
* `alias` (String)
* `avatar_url` (String)

**4. Tabla `User_Progress` (El estado del cliente por marca)**
* `user_id` (Relación con User)
* `tenant_id` (Relación con Tenant)
* `current_stamps` (Int, default 0, max 5)
* `total_rewards_earned` (Int)
* `last_stamp_timestamp` (DateTime) -> *Crucial para la regla de Cooldown de 5hs.*

**5. Tabla `Dynamic_Tokens` (El código de mostrador)**
* `branch_id` (Relación con Branch)
* `token_code` (String, 3 chars, ej: "BN3")
* `expires_at` (DateTime)

**6. Tabla `Active_Rewards` (El pool de palabras para el barista)**
* `id` (UUID)
* `user_id` (Relación con User)
* `branch_id` (Relación con Branch)
* `random_words` (String, ej: "LUNA CAFE")
* `status` (Enum: 'PENDING', 'BURNED')
* `created_at` (DateTime)

---

## 3. Backend: Endpoints Core (API REST)

Para que Antygabity programe la lógica, estos son los servicios críticos a exponer:

* **`POST /api/auth/google`**
    * Recibe el token de Google, crea o actualiza el `User` y devuelve un JWT de sesión.
* **`GET /api/tenant/{tenant_id}/progress`**
    * Devuelve la configuración de UI (colores/logo) y el estado actual de sellos del usuario logueado.
* **`POST /api/stamps/claim`**
    * **Payload:** `{ token_code: "AK4", user_lat: -34.59, user_lng: -58.44 }`
    * **Lógica de Negocio (El motor):**
        1.  Verifica si pasaron 5 horas desde `last_stamp_timestamp`. Si no, lanza error HTTP 429.
        2.  Calcula distancia entre `(user_lat, user_lng)` y las coordenadas del `Branch` asociado al código. Si es > `allowed_radius_meters`, lanza error HTTP 403.
        3.  Verifica si el `token_code` es válido y no expiró.
        4.  Suma +1 a `current_stamps`.
    * **Respuesta:** HTTP 200 OK (Dispara la pantalla de éxito).
* **`POST /api/rewards/initiate`**
    * Genera las dos palabras aleatorias, las guarda en `Active_Rewards` con estado 'PENDING' y notifica a la vista del Barista vía WebSockets/SSE.
* **`POST /api/rewards/burn`** (Uso exclusivo Barista)
    * **Payload:** `{ reward_id: "uuid" }`
    * Cambia el estado a 'BURNED', resetea `current_stamps` del usuario a 0 y suma +1 a `total_rewards_earned`.

    # Historias de Usuario (Backlog MVP): CoffeeLoyalty

---

## Épica 1: Experiencia del Cliente (Módulo PWA)

### US-01: Carga de Sello mediante Código Dinámico
**Como** cliente de la cafetería,
**Quiero** ingresar el código dinámico del mostrador en mi Web App,
**Para** sumar un sello en mi tarjeta virtual de forma rápida y sin contacto.

**Criterios de Aceptación:**

* **Escenario 1: Carga exitosa (Happy Path).**
    * **Dado** que el usuario "Gabo" tiene la sesión iniciada y su GPS activado.
    * **Y** se encuentra a menos de 50 metros de la sucursal "Black Clover Villa Crespo".
    * **Y** han pasado más de 5 horas desde su último sello.
    * **Cuando** ingresa el código dinámico válido "AK4" y presiona "Validar".
    * **Entonces** el sistema suma +1 a sus `current_stamps`.
    * **Y** muestra la pantalla de éxito con la animación y el temporizador de 10 segundos.

* **Escenario 2: Validación GPS fallida (Fuera de rango).**
    * **Dado** que el usuario "Gabo" intenta ingresar el código "AK4".
    * **Cuando** el sistema detecta que sus coordenadas GPS están a más de 50 metros del local.
    * **Entonces** el sistema rechaza la carga y muestra el mensaje de error: "Debes estar en el local para sumar un sello."

* **Escenario 3: Regla de Cooldown activa (Anti-fraude).**
    * **Dado** que el usuario "Gabo" sumó un sello hace 2 horas.
    * **Cuando** intenta ingresar un código válido nuevamente.
    * **Entonces** el sistema rechaza la carga y muestra: "Ya sumaste un sello recientemente. Vuelve a intentarlo en 3 horas."

### US-02: Generación de Código de Canje (Premio)
**Como** cliente que ha completado su tarjeta de sellos,
**Quiero** generar un código de canje basado en palabras aleatorias,
**Para** solicitar mi premio al barista de forma sencilla.

**Criterios de Aceptación:**

* **Escenario 1: Habilitación del botón de canje.**
    * **Dado** que el usuario llega a 5 sellos acumulados (`current_stamps` = 5).
    * **Entonces** la UI de la tarjeta de sellos cambia y habilita el botón principal "Canjear Premio".

* **Escenario 2: Generación de las palabras mágicas.**
    * **Dado** que el usuario presiona "Canjear Premio".
    * **Cuando** el backend procesa la solicitud.
    * **Entonces** se generan dos palabras aleatorias (ej: "NUBE CAFÉ").
    * **Y** se muestran en pantalla gigante con el estado "Esperando validación en mostrador".
    * **Y** el registro se guarda en la tabla `Active_Rewards` con estado `PENDING`.

---

## Épica 2: Operación en Tienda (Módulo Barista)

### US-03: Validación visual y "Quemado" del Premio
**Como** barista de la sucursal,
**Quiero** ver en mi panel las palabras secretas que me dictan los clientes,
**Para** marcar el premio como entregado y reiniciar la tarjeta del cliente.

**Criterios de Aceptación:**

* **Escenario 1: Quema de premio exitosa.**
    * **Dado** que el barista tiene abierto el panel de "Canjes Activos".
    * **Y** el cliente dictó las palabras "NUBE CAFÉ".
    * **Cuando** el barista presiona el botón "NUBE CAFÉ" en su pantalla.
    * **Entonces** el estado en `Active_Rewards` cambia a `BURNED`.
    * **Y** los sellos del cliente vuelven a 0.
    * **Y** la pantalla del cliente se actualiza en tiempo real mostrando "¡Premio entregado, a seguir sumando!".

---

## Épica 3: Gestión del Negocio (Módulo Owner)

### US-04: Personalización de Marca (White-label UI)
**Como** dueño de la franquicia,
**Quiero** configurar mi logo y colores corporativos desde el panel de administración,
**Para** que mis clientes identifiquen la Web App con la estética de mi cafetería.

**Criterios de Aceptación:**

* **Escenario 1: Actualización de UI.**
    * **Dado** que el dueño accede a "Configuración de Marca".
    * **Cuando** sube el logo de "Black Clover" y selecciona los colores HEX `#000000` (Primario) y `#F3E5AB` (Secundario).
    * **Y** presiona "Guardar Cambios".
    * **Entonces** la tabla `Tenant` se actualiza con los nuevos valores.
    * **Y** la PWA consumida por los clientes refleja inmediatamente esos colores y logo al recargar.