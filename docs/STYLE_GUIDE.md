# 📖 Guía de Estilo de Código

## Tabla de Contenidos
- [Principios Generales](#principios-generales)
- [JavaScript](#javascript)
- [HTML](#html)
- [CSS](#css)
- [Comentarios](#comentarios)
- [Nombres](#nombres)

## Principios Generales

### 1. Legibilidad sobre Brevedad
El código debe ser claro y fácil de entender, incluso si esto significa escribir más líneas.

```javascript
// ✅ BUENO: Claro y legible
const esUsuarioValido = usuario.edad >= 18 && usuario.email && usuario.verificado;

// ❌ MALO: Demasiado compacto
const v = u.a >= 18 && u.e && u.v;
```

### 2. Consistencia
Mantén un estilo consistente en todo el proyecto.

### 3. DRY (Don't Repeat Yourself)
Evita duplicación de código. Extrae funcionalidades comunes.

### 4. KISS (Keep It Simple, Stupid)
Busca la solución más simple que funcione.

## JavaScript

### Declaración de Variables

```javascript
// ✅ BUENO: Usar const por defecto, let cuando sea necesario
const MAX_INTENTOS = 3;
let contador = 0;

// ❌ MALO: Usar var (evitar)
var x = 10;
```

### Nombres de Variables

```javascript
// ✅ BUENO: camelCase para variables y funciones
const nombreUsuario = 'Juan';
function calcularTotal() { }

// ❌ MALO: snake_case o PascalCase para variables
const nombre_usuario = 'Juan';
const NombreUsuario = 'Juan';
```

### Nombres de Constantes

```javascript
// ✅ BUENO: UPPER_SNAKE_CASE para constantes
const MAX_COMBINACIONES = 100;
const API_BASE_URL = 'https://api.example.com';

// ❌ MALO: camelCase para constantes globales
const maxCombinaciones = 100;
```

### Funciones

```javascript
// ✅ BUENO: Funciones declarativas con JSDoc
/**
 * Calcula el total de una lista de números
 * @param {number[]} numeros - Array de números
 * @returns {number} Suma total
 */
function calcularTotal(numeros) {
    return numeros.reduce((sum, num) => sum + num, 0);
}

// ✅ BUENO: Arrow functions para callbacks
const numeros = [1, 2, 3, 4, 5];
const dobles = numeros.map(n => n * 2);

// ❌ MALO: Sin documentación, nombres poco claros
function calc(arr) {
    let t = 0;
    for (let i = 0; i < arr.length; i++) {
        t += arr[i];
    }
    return t;
}
```

### Objetos

```javascript
// ✅ BUENO: Shorthand properties
const nombre = 'Juan';
const edad = 30;
const usuario = { nombre, edad };

// ✅ BUENO: Destructuring
const { nombre, edad } = usuario;
const [primero, segundo] = array;

// ❌ MALO: Sin shorthand
const usuario = {
    nombre: nombre,
    edad: edad
};
```

### Arrays

```javascript
// ✅ BUENO: Métodos de array modernos
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(n => n % 2 === 0);
const dobles = numeros.map(n => n * 2);
const suma = numeros.reduce((acc, n) => acc + n, 0);

// ❌ MALO: Bucles tradicionales innecesarios
const pares = [];
for (let i = 0; i < numeros.length; i++) {
    if (numeros[i] % 2 === 0) {
        pares.push(numeros[i]);
    }
}
```

### Promesas y Async/Await

```javascript
// ✅ BUENO: async/await para código asíncrono
async function cargarDatos() {
    try {
        const response = await fetch('/api/datos');
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// ❌ MALO: Callback hell
cargarDatos(function(error, datos) {
    if (error) {
        handleError(error, function(err) {
            // ...
        });
    } else {
        procesarDatos(datos, function(err, resultado) {
            // ...
        });
    }
});
```

### Manejo de Errores

```javascript
// ✅ BUENO: Try-catch con mensajes descriptivos
try {
    const resultado = operacionRiesgosa();
    return resultado;
} catch (error) {
    console.error('Error en operacionRiesgosa:', error);
    mostrarNotificacion('Ocurrió un error', 'error');
    return null;
}

// ❌ MALO: Sin manejo de errores
const resultado = operacionRiesgosa();
```

### Comparaciones

```javascript
// ✅ BUENO: Usar === y !==
if (valor === 10) { }
if (texto !== '') { }

// ❌ MALO: Usar == y !=
if (valor == 10) { }
if (texto != '') { }
```

## HTML

### Estructura

```html
<!-- ✅ BUENO: Semántico, atributos ordenados -->
<article class="card" id="card-1" role="article" aria-labelledby="card-title">
    <header class="card-header">
        <h2 id="card-title" class="card-title">Título</h2>
    </header>
    <section class="card-body">
        <p>Contenido del artículo.</p>
    </section>
</article>

<!-- ❌ MALO: No semántico, sin estructura -->
<div class="card" id="card-1">
    <div>
        <div>Título</div>
    </div>
    <div>
        <div>Contenido del artículo.</div>
    </div>
</div>
```

### Accesibilidad

```html
<!-- ✅ BUENO: Accesible -->
<button 
    type="button"
    class="btn-primary" 
    aria-label="Generar combinaciones"
    title="Generar nuevas combinaciones">
    <span aria-hidden="true">🎲</span>
    Generar
</button>

<!-- ❌ MALO: No accesible -->
<div onclick="generar()">
    🎲 Click
</div>
```

### Formularios

```html
<!-- ✅ BUENO: Labels asociados, validación -->
<div class="form-group">
    <label for="cantidad" class="form-label">
        Cantidad de combinaciones
    </label>
    <input 
        type="number" 
        id="cantidad" 
        name="cantidad"
        class="form-input"
        min="1" 
        max="100" 
        required
        aria-describedby="cantidad-desc">
    <small id="cantidad-desc" class="form-description">
        Ingrese un número entre 1 y 100
    </small>
</div>

<!-- ❌ MALO: Sin labels, sin validación -->
<input type="text" placeholder="Cantidad">
```

## CSS

### Organización

```css
/* ✅ BUENO: Organizado por secciones */

/* ===== VARIABLES ===== */
:root {
    --primary-color: #2c3e50;
    --spacing-md: 16px;
}

/* ===== BASE ===== */
body {
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-color);
}

/* ===== COMPONENTES ===== */
.card {
    background: var(--bg-card);
    padding: var(--spacing-md);
}

.card__header {
    font-size: 1.2rem;
}
```

### Nomenclatura BEM

```css
/* ✅ BUENO: BEM (Block Element Modifier) */
.card { }
.card__header { }
.card__title { }
.card--highlighted { }
.card__button--disabled { }

/* ❌ MALO: Sin estructura */
.cardHeader { }
.card-title-big { }
.disabled-button { }
```

### Variables CSS

```css
/* ✅ BUENO: Usar variables CSS */
:root {
    --primary-color: #2c3e50;
    --border-radius: 8px;
}

.button {
    background: var(--primary-color);
    border-radius: var(--border-radius);
}

/* ❌ MALO: Valores hardcodeados */
.button {
    background: #2c3e50;
    border-radius: 8px;
}
```

### Responsive

```css
/* ✅ BUENO: Mobile-first con media queries */
.container {
    padding: 16px;
}

@media (min-width: 768px) {
    .container {
        padding: 24px;
    }
}

@media (min-width: 1024px) {
    .container {
        padding: 32px;
        max-width: 1200px;
    }
}
```

## Comentarios

### JavaScript

```javascript
// ✅ BUENO: JSDoc para funciones públicas
/**
 * Valida una combinación de números
 * @param {number[]} numeros - Array de números a validar
 * @param {number} min - Valor mínimo permitido
 * @param {number} max - Valor máximo permitido
 * @returns {boolean} True si la combinación es válida
 * @throws {Error} Si los parámetros son inválidos
 */
function validarCombinacion(numeros, min, max) {
    // Validar que sea un array
    if (!Array.isArray(numeros)) {
        throw new Error('numeros debe ser un array');
    }
    
    // Verificar cada número en el rango
    return numeros.every(n => n >= min && n <= max);
}

// ✅ BUENO: Comentarios explicativos para lógica compleja
// Usamos Fisher-Yates shuffle para garantizar distribución uniforme
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}

// ❌ MALO: Comentarios obvios
// Incrementar contador
contador++;

// ❌ MALO: Código comentado (eliminarlo)
// const viejoMetodo = () => { ... };
```

### CSS

```css
/* ===== SECCIÓN PRINCIPAL ===== */

/* Estilos base del componente card */
.card {
    background: white;
}

/* Hover effect - aumenta elevación */
.card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* ❌ MALO: Comentarios redundantes */
/* Color rojo */
.error {
    color: red;
}
```

## Nombres

### Archivos

```
✅ BUENO:
- kebab-case.js
- mi-componente.css
- imagen-logo.png

❌ MALO:
- MyFile.js
- my_file.css
- ImagenLogo.PNG
```

### Variables Booleanas

```javascript
// ✅ BUENO: Prefijos is, has, should, can
const isValid = true;
const hasPermission = false;
const shouldRender = true;
const canEdit = false;

// ❌ MALO: Sin prefijo
const valid = true;
const permission = false;
```

### Funciones

```javascript
// ✅ BUENO: Verbos descriptivos
function calcularTotal() { }
function obtenerUsuario() { }
function validarEmail() { }
function renderizarTabla() { }

// ❌ MALO: Nombres ambiguos
function total() { }
function usuario() { }
function email() { }
```

## Formateo

### Indentación

```javascript
// ✅ BUENO: 4 espacios (o 2, pero consistente)
function ejemplo() {
    if (condicion) {
        hacerAlgo();
    }
}

// ❌ MALO: Inconsistente
function ejemplo() {
  if (condicion) {
      hacerAlgo();
  }
}
```

### Líneas en Blanco

```javascript
// ✅ BUENO: Separar bloques lógicos
function procesarDatos() {
    const datos = obtenerDatos();
    
    const datosFiltrados = filtrarDatos(datos);
    const datosOrdenados = ordenarDatos(datosFiltrados);
    
    return datosOrdenados;
}
```

### Longitud de Línea

```javascript
// ✅ BUENO: Máximo 100 caracteres, quebrar líneas largas
const configuracion = {
    nombre: 'Mi Aplicación',
    version: '1.0.0',
    descripcion: 'Una descripción muy larga que necesita ' +
                 'ser dividida en múltiples líneas'
};

// ❌ MALO: Línea muy larga
const configuracion = { nombre: 'Mi Aplicación', version: '1.0.0', descripcion: 'Una descripción extremadamente larga que hace difícil la lectura' };
```

## Herramientas Recomendadas

### Linters
- **ESLint** para JavaScript
- **Stylelint** para CSS
- **HTMLHint** para HTML

### Formatters
- **Prettier** para formateo automático

### Configuración ESLint

```json
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es2021": true
  },
  "rules": {
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error"
  }
}
```

---

**Última actualización**: Diciembre 15, 2024
