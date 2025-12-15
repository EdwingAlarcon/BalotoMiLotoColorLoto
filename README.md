# 🎰 Generador de Combinaciones - Sistema Avanzado

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green.svg)](https://github.com/tu-usuario/generador-combinaciones)

Un generador de combinaciones para juegos de lotería colombianos con interfaz moderna, estadísticas avanzadas y almacenamiento local.

## 🚀 Características

### 🎯 Juegos Soportados (Reglas Colombianas)
- **Baloto**: 5 números del 1 al 43 + 1 Super Balota del 1 al 16
- **Mi Loto**: 5 números del 1 al 39
- **Color Loto**: 6 colores diferentes + número del 1-7 para cada color

### ✨ Funcionalidades Principales
- ✅ Generación de combinaciones únicas y aleatorias
- ✅ Sistema de puntuación inteligente
- ✅ Cálculo de probabilidades en tiempo real
- ✅ Histórico con almacenamiento local persistente
- ✅ Estadísticas detalladas y análisis de frecuencias
- ✅ Modo claro/oscuro con persistencia de preferencias
- ✅ Diseño responsive (móvil, tablet, escritorio)
- ✅ Exportación/importación de datos en JSON
- ✅ Selección de mejores combinaciones por puntuación
- ✅ Validación robusta de datos
- ✅ Sistema de notificaciones para feedback
- ✅ Accesibilidad completa (ARIA, navegación por teclado)

## 📁 Estructura del Proyecto

```
BalotoMiLotoColorLoto/
├── 📄 index.html                  # Página principal
├── 📄 README.md                   # Este archivo
├── 📄 LICENSE                     # Licencia MIT
├── 📄 CHANGELOG.md                # Historial de cambios
├── 📄 CONTRIBUTING.md             # Guía de contribución
├── 📄 SECURITY.md                 # Política de seguridad
├── 📄 package.json                # Configuración del proyecto
├── 📄 .gitignore                  # Archivos ignorados por Git
│
├── 📁 .github/                    # Configuración de GitHub
│   └── copilot-instructions.md
│
├── 📁 js/                         # Código JavaScript
│   ├── app.js                    # Inicialización y configuración
│   ├── constants.js              # Constantes del sistema
│   ├── utils.js                  # Utilidades comunes
│   ├── validators.js             # Sistema de validación
│   ├── generador.js              # Lógica de generación
│   ├── estadisticas.js           # Cálculos estadísticos
│   ├── storage.js                # Gestión de almacenamiento
│   └── ui.js                     # Interfaz de usuario
│
├── 📁 styles/                     # Hojas de estilo CSS
│   ├── main.css                  # Archivo principal
│   ├── base.css                  # Estilos base
│   ├── components.css            # Componentes
│   ├── layout.css                # Diseño y estructura
│   ├── themes.css                # Temas de color
│   └── animations.css            # Animaciones
│
├── 📁 assets/                     # Recursos estáticos
│   └── images/                   # Imágenes
│
├── 📁 docs/                       # Documentación
│   ├── ARCHITECTURE.md           # Arquitectura técnica
│   └── STYLE_GUIDE.md            # Guía de estilo
│
└── 📁 tests/                      # Pruebas
    ├── test-data.js              # Datos de prueba
    └── README.md                 # Guía de testing
```
