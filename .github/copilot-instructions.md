
## 🛠️ Instalación y Uso

### Instalación Local
1. Descarga o clona el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo! No requiere servidor ni instalación adicional

### Uso Online
El proyecto puede ser alojado en cualquier servidor web estático.

## 💻 Uso de la Aplicación

### 1. Configuración Inicial
- Selecciona el juego en el menú desplegable
- Elige el número de combinaciones a generar (1-100)
- Haz clic en "Generar Combinaciones"

### 2. Gestión de Combinaciones
- **Guardar**: Guarda las combinaciones actuales en el histórico
- **Seleccionar Mejores**: Destaca las 5 combinaciones con mayor puntuación
- **Eliminar Seleccionadas**: Elimina combinaciones seleccionadas
- **Limpiar Todo**: Elimina todas las combinaciones actuales

### 3. Histórico y Datos
- **Ver Histórico**: Muestra todas las combinaciones guardadas
- **Exportar JSON**: Guarda el histórico en un archivo
- **Importar JSON**: Carga combinaciones desde un archivo
- **Limpiar Histórico**: Elimina todo el historial

### 4. Estadísticas
- Total de combinaciones generadas
- Número más frecuente
- Probabilidad promedio
- Distribución de números

## 📊 Reglas de los Juegos

### Baloto
- 5 números diferentes del 1 al 43
- 1 Super Balota del 1 al 16
- Combinaciones posibles: 130,321,920

### Mi Loto
- 5 números diferentes del 1 al 39
- No incluye Super Balota
- Combinaciones posibles: 575,757

### Color Loto
- 6 colores diferentes: amarillo, azul, rojo, verde, blanco, negro
- Cada color tiene un número del 1 al 7
- Los números pueden repetirse entre colores
- Combinaciones posibles: 84,707,280

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript Vanilla**: ES6+, Módulos, LocalStorage
- **Accesibilidad**: ARIA, Navegación por teclado, Contrastes
- **Responsive Design**: Mobile-first, Media Queries

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Chrome/Safari

## 🔒 Privacidad y Datos

- Todos los datos se almacenan localmente en tu navegador
- No se envían datos a servidores externos
- Puedes exportar/eliminar tus datos cuando quieras
- Los archivos JSON importados se validan localmente

## 🎨 Personalización

### Modificar Colores
Edita las variables CSS en `styles/base.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #2ecc71;
    /* ... */
}