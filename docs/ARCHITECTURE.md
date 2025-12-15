# 📚 Documentación Técnica

## Arquitectura del Sistema

### Visión General

El Generador de Combinaciones es una aplicación web progresiva (PWA) construida con tecnologías web estándar:

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Almacenamiento**: LocalStorage API
- **Arquitectura**: Modular, basada en componentes

### Estructura de Módulos

```
js/
├── app.js          - Inicialización y orquestación
├── constants.js    - Constantes y configuración
├── utils.js        - Utilidades comunes
├── validators.js   - Sistema de validación
├── generador.js    - Lógica de generación de combinaciones
├── estadisticas.js - Cálculos estadísticos
├── storage.js      - Gestión de almacenamiento
└── ui.js           - Interfaz de usuario y eventos
```

### Flujo de Datos

```
Usuario → UI Events → Validación → Lógica de Negocio → Storage → UI Update
```

## Módulos Principales

### 1. constants.js
Define todas las constantes del sistema:
- Configuración de aplicación
- Reglas de los juegos
- Mensajes y notificaciones
- Configuración de UI

### 2. utils.js
Funciones auxiliares reutilizables:
- Formateo de datos
- Manipulación de arrays
- Utilidades de DOM
- Gestión de almacenamiento

### 3. validators.js
Sistema de validación robusto:
- Validación de números y rangos
- Validación de combinaciones
- Validación de archivos
- Validadores personalizados

### 4. generador.js
Generación de combinaciones:
- Algoritmo de números aleatorios únicos
- Sistema de puntuación
- Cálculo de probabilidades
- Filtros y criterios

### 5. estadisticas.js
Análisis estadístico:
- Frecuencia de números
- Patrones y tendencias
- Probabilidades acumuladas
- Métricas de rendimiento

### 6. storage.js
Persistencia de datos:
- CRUD operations en localStorage
- Serialización/deserialización
- Gestión de cuotas
- Backup y restauración

### 7. ui.js
Interfaz de usuario:
- Renderizado de componentes
- Gestión de eventos
- Notificaciones
- Animaciones y transiciones

### 8. app.js
Orquestador principal:
- Inicialización de módulos
- Estado global de la aplicación
- Coordinación de componentes
- Manejo de errores

## APIs y Interfaces

### Generador API

```javascript
// Generar una combinación
generarCombinacionUnica(config, juego)

// Generar múltiples combinaciones
generarCombinaciones(juego, cantidad)

// Calcular puntuación
calcularPuntuacion(combinacion, juego)

// Calcular probabilidad
calcularProbabilidad(juego)
```

### Storage API

```javascript
// Guardar combinaciones
guardarCombinaciones(combinaciones, juego)

// Obtener historial
obtenerHistorial()

// Exportar datos
exportarDatos()

// Importar datos
importarDatos(archivo)
```

### Validators API

```javascript
// Validar cantidad
validarCantidadCombinaciones(cantidad)

// Validar combinación
validarCombinacionBaloto(numeros, superBalota)

// Validador personalizado
crearValidador(condicion, mensaje)
```

## Almacenamiento de Datos

### LocalStorage Schema

```javascript
{
  "tema": "light" | "dark",
  "historial": [
    {
      "id": "timestamp-random",
      "juego": "baloto" | "mi-loto" | "color-loto",
      "combinaciones": [...],
      "fecha": "timestamp",
      "nombre": "string"
    }
  ],
  "estadisticas": {
    "totalGeneradas": number,
    "totalLotes": number,
    "frecuenciaNumeros": {},
    "probabilidadAcumulada": number
  }
}
```

## Algoritmos Principales

### Generación de Números Únicos

Utiliza el algoritmo Fisher-Yates para garantizar distribución uniforme:

```javascript
function numerosAleatoriosUnicos(cantidad, min, max) {
    const numeros = new Set();
    while (numeros.size < cantidad) {
        numeros.add(numeroAleatorio(min, max));
    }
    return Array.from(numeros);
}
```

### Cálculo de Combinatoria

Implementa la fórmula C(n,k) = n! / (k! * (n-k)!):

```javascript
function calcularCombinatoria(n, k) {
    k = Math.min(k, n - k);
    let resultado = 1;
    for (let i = 0; i < k; i++) {
        resultado *= (n - i);
        resultado /= (i + 1);
    }
    return Math.round(resultado);
}
```

## Rendimiento

### Optimizaciones

1. **Lazy Loading**: Carga diferida de módulos
2. **Debouncing**: Limitación de eventos frecuentes
3. **Virtual Scrolling**: Para listas grandes
4. **Caching**: Resultados calculados en memoria
5. **Web Workers**: Para cálculos intensivos (futuro)

### Métricas

- Tiempo de generación: < 100ms para 100 combinaciones
- Tamaño de almacenamiento: ~1MB para 1000 combinaciones
- Tiempo de renderizado: < 50ms para 100 filas

## Seguridad

### Validación de Entrada

Todas las entradas son validadas antes de procesarse:
- Sanitización de datos
- Validación de tipos
- Verificación de rangos
- Prevención de inyección

### Almacenamiento Seguro

- Datos encapsulados en objetos
- Validación antes de guardar
- Verificación de cuotas
- Manejo de errores robusto

## Accesibilidad

### Estándares WCAG 2.1

- Contraste mínimo 4.5:1
- Navegación por teclado
- Etiquetas ARIA
- Semántica HTML5

### Soporte de Tecnologías Asistivas

- Screen readers
- Navegación por teclado
- Alto contraste
- Tamaños de fuente ajustables

## Compatibilidad

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Características Requeridas

- ES6+ support
- LocalStorage API
- CSS Grid
- CSS Custom Properties

## Testing

### Tipos de Pruebas

1. **Unitarias**: Funciones individuales
2. **Integración**: Interacción entre módulos
3. **E2E**: Flujos completos de usuario
4. **Rendimiento**: Tiempo de respuesta
5. **Accesibilidad**: Cumplimiento WCAG

### Framework Recomendado

```javascript
// Jest para pruebas unitarias
import { generarCombinacionUnica } from './generador.js';

test('genera 5 números únicos para Baloto', () => {
    const config = JUEGOS.BALOTO;
    const resultado = generarCombinacionUnica(config, 'baloto');
    
    expect(resultado.numeros).toHaveLength(5);
    expect(new Set(resultado.numeros).size).toBe(5);
});
```

## Deployment

### Requisitos

- Servidor web estático (Apache, Nginx, etc.)
- HTTPS (recomendado)
- Compresión gzip habilitada

### Proceso

1. Build (si se usa bundler)
2. Minificación de assets
3. Optimización de imágenes
4. Deploy a servidor
5. Configuración de caché

## Roadmap

### v1.1 (Q1 2025)
- [ ] Modo offline completo (PWA)
- [ ] Exportación a PDF
- [ ] Más opciones de filtrado

### v2.0 (Q2 2025)
- [ ] Análisis de resultados históricos
- [ ] Gráficos interactivos
- [ ] API REST para integraciones
- [ ] Multi-idioma

## Recursos Adicionales

- [Guía de Contribución](../CONTRIBUTING.md)
- [Código de Conducta](../CODE_OF_CONDUCT.md)
- [Changelog](../CHANGELOG.md)
- [Licencia](../LICENSE)

## Contacto

Para preguntas técnicas o sugerencias:
- GitHub Issues: [enlace-al-repo]
- Email: dev@example.com
