# 🤝 Guía para Contribuir

¡Gracias por tu interés en contribuir al Generador de Combinaciones! Esta guía te ayudará a participar en el proyecto.

## 📋 Tabla de Contenidos
- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Proceso de Pull Request](#proceso-de-pull-request)

## 📜 Código de Conducta

Este proyecto adhiere a un Código de Conducta de Colaboración. Al participar, se espera que respetes este código. Por favor:

- Usa lenguaje acogedor e inclusivo
- Respeta los diferentes puntos de vista y experiencias
- Acepta críticas constructivas con gracia
- Enfócate en lo mejor para la comunidad
- Muestra empatía hacia otros miembros

## 🎯 ¿Cómo puedo contribuir?

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. **Título descriptivo** - Resumen claro del problema
2. **Descripción detallada** - Pasos para reproducir el error
3. **Comportamiento esperado** - Qué debería ocurrir
4. **Comportamiento actual** - Qué ocurre realmente
5. **Capturas de pantalla** - Si es posible
6. **Entorno** - Navegador, versión, OS, etc.

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que no exista ya una sugerencia similar
2. Crea un issue detallando:
   - Problema que resuelve
   - Solución propuesta
   - Alternativas consideradas
   - Impacto en usuarios

### Contribuir con Código

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Crea** una rama para tu feature: `git checkout -b feature/mi-caracteristica`
4. **Desarrolla** siguiendo nuestros estándares
5. **Commit** tus cambios: `git commit -m 'feat: añadir nueva característica'`
6. **Push** a tu fork: `git push origin feature/mi-caracteristica`
7. **Crea** un Pull Request

## 🛠️ Configuración del Entorno

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Git
- Node.js (opcional, para herramientas de desarrollo)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/generador-combinaciones.git

# Entrar al directorio
cd generador-combinaciones

# Instalar dependencias de desarrollo (opcional)
npm install

# Iniciar servidor local
npm start
# O simplemente abrir index.html en tu navegador
```

## 💻 Proceso de Desarrollo

### Estructura del Proyecto

```
BalotoMiLotoColorLoto/
├── index.html           # Página principal
├── js/                  # Scripts JavaScript
│   ├── app.js          # Inicialización y configuración
│   ├── generador.js    # Lógica de generación
│   ├── estadisticas.js # Cálculos estadísticos
│   ├── storage.js      # Almacenamiento local
│   ├── ui.js           # Interfaz de usuario
│   ├── constants.js    # Constantes del sistema
│   ├── utils.js        # Utilidades comunes
│   └── validators.js   # Validaciones
├── styles/             # Hojas de estilo
│   ├── base.css       # Estilos base
│   ├── components.css # Componentes
│   ├── layout.css     # Diseño y estructura
│   ├── themes.css     # Temas de color
│   └── animations.css # Animaciones
├── assets/            # Recursos estáticos
│   └── images/        # Imágenes
├── docs/              # Documentación
└── tests/             # Pruebas
```

### Flujo de Trabajo

1. **Asigna** un issue o crea uno nuevo
2. **Desarrolla** en una rama específica
3. **Prueba** localmente todos los cambios
4. **Documenta** nuevas funcionalidades
5. **Commit** con mensajes descriptivos
6. **Push** y crea un Pull Request

## 📝 Estándares de Código

### JavaScript

```javascript
// ✅ BUENO: Nombres descriptivos, JSDoc, const/let
/**
 * Genera una combinación aleatoria de números
 * @param {number} cantidad - Cantidad de números
 * @param {number} max - Número máximo
 * @returns {number[]} Array de números únicos
 */
function generarNumeros(cantidad, max) {
    const numeros = [];
    // ... implementación
    return numeros;
}

// ❌ MALO: Sin documentación, var, nombres poco claros
function gen(n, m) {
    var x = [];
    // ...
    return x;
}
```

### CSS

```css
/* ✅ BUENO: BEM, variables CSS, comentarios */
.card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
}

.card__header {
    padding: var(--spacing-md);
}

.card__header--highlighted {
    background: var(--accent-color);
}

/* ❌ MALO: Sin estructura, valores fijos */
.c {
    background: #fff;
    border-radius: 8px;
}
```

### HTML

```html
<!-- ✅ BUENO: Semántico, accesible, ARIA -->
<button 
    id="generar" 
    class="btn-primary" 
    aria-label="Generar nuevas combinaciones"
    type="button">
    <span aria-hidden="true">🎲</span>
    Generar
</button>

<!-- ❌ MALO: No semántico, sin accesibilidad -->
<div onclick="generate()">
    Click
</div>
```

### Convenciones de Nombres

- **Archivos**: kebab-case (`mi-archivo.js`)
- **Variables/Funciones**: camelCase (`miVariable`, `miFuncion()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_COMBINACIONES`)
- **Clases CSS**: kebab-case con BEM (`.card-header`)
- **IDs HTML**: kebab-case (`#tabla-resultados`)

### Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añadir validación de entrada
fix: corregir cálculo de probabilidades
docs: actualizar README con ejemplos
style: mejorar espaciado en botones
refactor: reorganizar lógica de generación
test: añadir pruebas para estadísticas
chore: actualizar dependencias
```

## 🧪 Pruebas

Antes de enviar un PR, verifica:

- [ ] La aplicación funciona en Chrome, Firefox y Safari
- [ ] La interfaz es responsive (móvil, tablet, desktop)
- [ ] No hay errores en la consola del navegador
- [ ] Los datos se guardan correctamente en localStorage
- [ ] El modo oscuro funciona correctamente
- [ ] La accesibilidad está preservada (navegación por teclado, ARIA)
- [ ] Los cálculos estadísticos son correctos
- [ ] El código está formateado y sin errores de linting

## 📤 Proceso de Pull Request

### Checklist del PR

- [ ] El código sigue nuestros estándares
- [ ] He probado los cambios localmente
- [ ] He actualizado la documentación si es necesario
- [ ] He añadido comentarios en código complejo
- [ ] El título del PR es descriptivo
- [ ] He vinculado el issue relacionado

### Plantilla del PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Mejora de código
- [ ] Actualización de documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas

## Capturas de pantalla (si aplica)
Añade imágenes si hay cambios visuales

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He probado en múltiples navegadores
```

## 📚 Recursos Adicionales

- [Documentación de la API](./docs/API.md)
- [Guía de Estilo](./docs/STYLE_GUIDE.md)
- [Arquitectura del Proyecto](./docs/ARCHITECTURE.md)

## 💬 ¿Preguntas?

Si tienes preguntas, puedes:

1. Buscar en [issues existentes](https://github.com/tu-usuario/generador-combinaciones/issues)
2. Crear un [nuevo issue](https://github.com/tu-usuario/generador-combinaciones/issues/new)
3. Contactar a los mantenedores

## 🙏 Agradecimientos

Gracias por contribuir al proyecto. Cada contribución, por pequeña que sea, es valiosa y apreciada.

---

¡Feliz codificación! 🚀
