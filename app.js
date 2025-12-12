// Variables globales
let combinacionesActuales = [];
let historico = JSON.parse(localStorage.getItem('historicoCombinaciones')) || [];
let estadisticas = JSON.parse(localStorage.getItem('estadisticasCombinaciones')) || {
    totalGeneradas: 0,
    totalGuardadas: 0,
    frecuenciaNumeros: {},
    lotesGuardados: 0
};

// Elementos DOM
const elementos = {
    juego: document.getElementById('juego'),
    combinaciones: document.getElementById('combinaciones'),
    generar: document.getElementById('generar'),
    guardar: document.getElementById('guardar'),
    limpiar: document.getElementById('limpiar'),
    seleccionarMejores: document.getElementById('seleccionar-mejores'),
    eliminarSeleccionados: document.getElementById('eliminar-seleccionados'),
    verHistorial: document.getElementById('ver-historial'),
    cerrarHistorico: document.getElementById('cerrar-historico'),
    limpiarHistorico: document.getElementById('limpiar-historico'),
    limpiarEstadisticas: document.getElementById('limpiar-estadisticas'),
    seleccionarTodas: document.getElementById('seleccionar-todas'),
    cuerpoTabla: document.getElementById('cuerpo-tabla'),
    seccionHistorico: document.getElementById('seccion-historico'),
    contenidoHistorico: document.getElementById('contenido-historico'),
    notification: document.getElementById('notification'),
    reglasJuego: document.getElementById('reglas-juego'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    probabilityPanel: document.getElementById('probabilityPanel'),
    probabilityContent: document.getElementById('probabilityContent'),
    totalCombinaciones: document.getElementById('total-combinaciones'),
    totalLotes: document.getElementById('total-lotes'),
    mejorFrecuencia: document.getElementById('mejor-frecuencia'),
    probabilidadPromedio: document.getElementById('probabilidad-promedio'),
    exportHistorico: document.getElementById('export-historico'),
    importHistorico: document.getElementById('import-historico'),
    importFile: document.getElementById('import-file')
};

// Nota: usar el objeto `elementos` para acceder a nodos relacionados a UI/estadísticas

// Colores para Color Loto
const coloresLoto = ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    
    // Configurar tema
    cargarTema();
    
    // Configurar reglas iniciales
    actualizarReglasJuego(elementos.juego.value);
    actualizarProbabilidades(elementos.juego.value);
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Inicializar visibilidad y estadísticas
    actualizarVisibilidadColumnas();
    actualizarEstadisticas();
    
    mostrarNotificacion('Sistema avanzado listo', 'success');
});

// Configurar todos los event listeners
function configurarEventListeners() {
    if (elementos.generar) elementos.generar.addEventListener('click', generarCombinaciones);
    if (elementos.guardar) elementos.guardar.addEventListener('click', guardarEnHistorico);
    if (elementos.limpiar) elementos.limpiar.addEventListener('click', limpiarCombinacionesActuales);
    if (elementos.seleccionarMejores) elementos.seleccionarMejores.addEventListener('click', seleccionarMejoresCombinaciones);
    if (elementos.eliminarSeleccionados) elementos.eliminarSeleccionados.addEventListener('click', eliminarCombinacionesSeleccionadas);
    if (elementos.verHistorial) elementos.verHistorial.addEventListener('click', mostrarHistorico);
    if (elementos.exportHistorico) elementos.exportHistorico.addEventListener('click', exportarHistorico);
    if (elementos.importHistorico) elementos.importHistorico.addEventListener('click', () => elementos.importFile.click());
    if (elementos.importFile) elementos.importFile.addEventListener('change', manejarImportFile);
    if (elementos.cerrarHistorico) elementos.cerrarHistorico.addEventListener('click', () => elementos.seccionHistorico.classList.add('hidden'));
    if (elementos.limpiarHistorico) elementos.limpiarHistorico.addEventListener('click', limpiarHistoricoCompleto);
    if (elementos.limpiarEstadisticas) elementos.limpiarEstadisticas.addEventListener('click', limpiarEstadisticas);
    if (elementos.seleccionarTodas) elementos.seleccionarTodas.addEventListener('change', seleccionarTodasCombinaciones);
    if (elementos.themeToggle) elementos.themeToggle.addEventListener('click', toggleTema);
    
    if (elementos.juego) {
        elementos.juego.addEventListener('change', function() {
            actualizarReglasJuego(this.value);
            actualizarProbabilidades(this.value);
            actualizarVisibilidadColumnas();
        });
    }
    
    console.log('Event listeners configurados', elementos);
}

// Función para el modo oscuro/claro
function toggleTema() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        elementos.themeIcon.textContent = '🌙';
        elementos.themeToggle.innerHTML = '<span id="themeIcon">🌙</span> Modo Oscuro';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        elementos.themeIcon.textContent = '☀️';
        elementos.themeToggle.innerHTML = '<span id="themeIcon">☀️</span> Modo Claro';
        localStorage.setItem('theme', 'dark');
    }
}

function cargarTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        elementos.themeIcon.textContent = '☀️';
        elementos.themeToggle.innerHTML = '<span id="themeIcon">☀️</span> Modo Claro';
    }
}

// Función para obtener el nombre legible del juego
function obtenerNombreJuego(juego) {
    const nombres = {
        'baloto': 'Baloto',
        'mi-loto': 'Mi Loto',
        'color-loto': 'Color Loto'
    };
    return nombres[juego] || juego;
}

// Función para actualizar probabilidades
function actualizarProbabilidades(juego) {
    let probabilidadesHTML = '';
    
    switch(juego) {
        case 'baloto':
            probabilidadesHTML = `
                <div class="probability-item">
                    <div class="probability-value">1 en 6.7M</div>
                    <div class="probability-label">Ganar el premio mayor</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">1 en 24.2K</div>
                    <div class="probability-label">Ganar cualquier premio</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">8.15%</div>
                    <div class="probability-label">Probabilidad por combinación</div>
                </div>
            `;
            break;
            
        case 'mi-loto':
            probabilidadesHTML = `
                <div class="probability-item">
                    <div class="probability-value">1 en 575K</div>
                    <div class="probability-label">Ganar el premio mayor</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">1 en 18.5K</div>
                    <div class="probability-label">Ganar cualquier premio</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">12.45%</div>
                    <div class="probability-label">Probabilidad por combinación</div>
                </div>
            `;
            break;
            
        case 'color-loto':
            probabilidadesHTML = `
                <div class="probability-item">
                    <div class="probability-value">1 en 117K</div>
                    <div class="probability-label">Ganar el premio mayor</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">1 en 8.2K</div>
                    <div class="probability-label">Ganar cualquier premio</div>
                </div>
                <div class="probability-item">
                    <div class="probability-value">15.67%</div>
                    <div class="probability-label">Probabilidad por combinación</div>
                </div>
            `;
            break;
    }
    
    elementos.probabilityContent.innerHTML = probabilidadesHTML;
}

// Función para calcular probabilidad individual
function calcularProbabilidadIndividual(combinacion) {
    let baseProb = 0;
    
    try {
        switch(combinacion.juego) {
            case 'baloto':
                // Basado en distribución de números y paridad
                if (Array.isArray(combinacion.numeros) && combinacion.numeros.length > 0) {
                    const paresBaloto = combinacion.numeros.filter(n => n % 2 === 0).length;
                    baseProb = 8.15 + (Math.abs(paresBaloto - 2.5) * 0.5);
                } else {
                    baseProb = 8.15;
                }
                break;
                
            case 'mi-loto':
                if (Array.isArray(combinacion.numeros) && combinacion.numeros.length > 0) {
                    const paresMiLoto = combinacion.numeros.filter(n => n % 2 === 0).length;
                    baseProb = 12.45 + (Math.abs(paresMiLoto - 2.5) * 0.8);
                } else {
                    baseProb = 12.45;
                }
                break;
                
            case 'color-loto':
                if (Array.isArray(combinacion.combinaciones) && combinacion.combinaciones.length > 0) {
                    const coloresUnicos = new Set(combinacion.combinaciones.map(c => c.color));
                    const numerosUnicos = new Set(combinacion.combinaciones.map(c => c.numero));
                    baseProb = 15.67 + (coloresUnicos.size * 0.8) + (numerosUnicos.size * 0.6);
                } else {
                    baseProb = 15.67;
                }
                break;
            default:
                baseProb = 10;
        }
    } catch (e) {
        console.error('Error calculando probabilidad:', e);
        baseProb = 10;
    }
    
    return Math.min(baseProb, 25).toFixed(2);
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    elementos.totalCombinaciones.textContent = estadisticas.totalGeneradas;
    elementos.totalLotes.textContent = estadisticas.lotesGuardados;
    
    // Calcular número más frecuente
    let mejorNum = '-';
    let maxFreq = 0;
    for (const [num, freq] of Object.entries(estadisticas.frecuenciaNumeros)) {
        if (freq > maxFreq) {
            maxFreq = freq;
            mejorNum = num;
        }
    }
    elementos.mejorFrecuencia.textContent = mejorNum;
    
    // Calcular probabilidad promedio de combinaciones actuales
    if (combinacionesActuales.length > 0) {
        const probTotal = combinacionesActuales.reduce((sum, comb) => 
            sum + parseFloat(calcularProbabilidadIndividual(comb)), 0);
        const probPromedio = (probTotal / combinacionesActuales.length).toFixed(2);
        elementos.probabilidadPromedio.textContent = probPromedio + '%';
    } else {
        elementos.probabilidadPromedio.textContent = '0%';
    }
}

// Función para actualizar las reglas del juego
function actualizarReglasJuego(juego) {
    let reglasHTML = '';
    
    switch(juego) {
        case 'baloto':
            reglasHTML = `
                <h4>🏆 Reglas del Baloto:</h4>
                <ul>
                    <li>Elige <strong>5 números del 1 al 43</strong> sin repetir</li>
                    <li>Elige <strong>1 Super Balota del 1 al 16</strong></li>
                    <li><strong>Formato:</strong> Fondo amarillo para números, fondo rojo para Super Balota</li>
                    <li><strong>Probabilidad Premio Mayor:</strong> 1 en 6.7 millones</li>
                </ul>
            `;
            break;
            
        case 'mi-loto':
            reglasHTML = `
                <h4>🎯 Reglas del Mi Loto:</h4>
                <ul>
                    <li>Elige <strong>5 números del 1 al 39</strong> sin repetir</li>
                    <li>No incluye Super Balota</li>
                    <li><strong>Formato:</strong> Fondo azul claro para números con texto blanco</li>
                    <li><strong>Probabilidad Premio Mayor:</strong> 1 en 575,757</li>
                </ul>
            `;
            break;
            
        case 'color-loto':
            reglasHTML = `
                <h4>🎨 Reglas del Color Loto:</h4>
                <ul>
                    <li>Elige <strong>6 colores</strong> entre: Amarillo, Azul, Rojo, Verde, Blanco, Negro</li>
                    <li>A cada color asígnale un <strong>número del 1 al 7</strong></li>
                    <li><strong>Puedes:</strong> Jugar con colores repetidos pero no con el mismo número</li>
                    <li><strong>O puedes:</strong> Jugar con números repetidos pero no con el mismo color</li>
                    <li><strong>No puedes:</strong> Repetir combinaciones iguales de número y color</li>
                    <li><strong>Probabilidad Premio Mayor:</strong> 1 en 117,649</li>
                </ul>
            `;
            break;
    }
    
    elementos.reglasJuego.innerHTML = reglasHTML;
}

// Función para actualizar visibilidad de columnas
function actualizarVisibilidadColumnas() {
    const juego = elementos.juego.value;
    const balotoHeaders = document.querySelectorAll('.baloto-only');
    const colorLotoHeaders = document.querySelectorAll('.color-loto-only');
    
    // Limpiar combinaciones al cambiar de juego
    if (combinacionesActuales.length > 0) {
        combinacionesActuales = [];
        renderizarTablaCombinaciones();
        mostrarNotificacion('Combinaciones limpiadas - Juego cambiado', 'info');
    }
    
    // Actualizar visibilidad
    balotoHeaders.forEach(h => h.style.display = juego === 'baloto' ? 'table-cell' : 'none');
    colorLotoHeaders.forEach(h => h.style.display = juego === 'color-loto' ? 'table-cell' : 'none');
}

// Función para generar combinaciones con animación
function generarCombinaciones() {
    try {
        const boton = elementos.generar;
        if (!boton) return;
        boton.classList.add('loading');

        setTimeout(() => {
            try {
                const juego = elementos.juego.value;
                // Validar y normalizar el input del número de combinaciones
                const raw = parseInt(elementos.combinaciones.value);
                const minAllowed = parseInt(elementos.combinaciones.min) || 1;
                const maxAllowed = parseInt(elementos.combinaciones.max) || 100;
                let numCombinaciones = Number.isFinite(raw) ? raw : 5;
                if (numCombinaciones < minAllowed) {
                    numCombinaciones = minAllowed;
                    mostrarNotificacion(`Número mínimo permitido: ${minAllowed}. Ajustado.`, 'warning');
                }
                if (numCombinaciones > maxAllowed) {
                    numCombinaciones = maxAllowed;
                    mostrarNotificacion(`Número máximo permitido: ${maxAllowed}. Ajustado.`, 'warning');
                }

                combinacionesActuales = [];
                let generadas = 0;

                for (let i = 0; i < numCombinaciones; i++) {
                    const combinacion = {
                        juego: juego,
                        id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + i),
                        seleccionada: false
                    };

                    switch (juego) {
                        case 'baloto':
                            combinacion.numeros = generarNumerosAleatorios(5, 1, 43);
                            combinacion.superBalota = Math.floor(Math.random() * 16) + 1;
                            break;
                        case 'mi-loto':
                            combinacion.numeros = generarNumerosAleatorios(5, 1, 39);
                            break;
                        case 'color-loto':
                            combinacion.combinaciones = generarCombinacionesColorLoto();
                            break;
                    }

                    // Solo contar/comitar la combinación si se generó correctamente
                    if (combinacion) {
                        combinacionesActuales.push(combinacion);
                        generadas++;

                        // Actualizar estadísticas de frecuencia
                        if (juego !== 'color-loto' && Array.isArray(combinacion.numeros)) {
                            combinacion.numeros.forEach(num => {
                                estadisticas.frecuenciaNumeros[num] = (estadisticas.frecuenciaNumeros[num] || 0) + 1;
                            });
                        }
                    }
                }

                estadisticas.totalGeneradas += generadas;
                localStorage.setItem('estadisticasCombinaciones', JSON.stringify(estadisticas));

                renderizarTablaCombinaciones();
                actualizarVisibilidadColumnas();
                actualizarEstadisticas();
                boton.classList.remove('loading');
                mostrarNotificacion(`${generadas} combinaciones generadas con éxito`, 'success');
            } catch (e) {
                console.error('Error:', e);
                if (boton) boton.classList.remove('loading');
            }
        }, 800);
    } catch (e) {
        console.error('Error general:', e);
    }
}

// Función auxiliar para generar números aleatorios
function generarNumerosAleatorios(cantidad, min, max) {
    const numeros = [];
    while (numeros.length < cantidad) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numeros.includes(num)) numeros.push(num);
    }
    return numeros.sort((a, b) => a - b);
}

// Función para Color Loto
function generarCombinacionesColorLoto() {
    const combinaciones = [];
    const usadas = new Set();
    
    while (combinaciones.length < 6) {
        const color = coloresLoto[Math.floor(Math.random() * coloresLoto.length)];
        const numero = Math.floor(Math.random() * 7) + 1;
        const clave = `${color}-${numero}`;
        
        if (!usadas.has(clave)) {
            usadas.add(clave);
            combinaciones.push({ color, numero });
        }
    }
    
    return combinaciones;
}

// Función para renderizar la tabla con probabilidades
function renderizarTablaCombinaciones() {
    elementos.cuerpoTabla.innerHTML = '';
    
    if (combinacionesActuales.length === 0) {
        elementos.cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                    No hay combinaciones generadas
                </td>
            </tr>
        `;
        return;
    }
    
    combinacionesActuales.forEach((combinacion, index) => {
        const fila = document.createElement('tr');
        if (combinacion.seleccionada) fila.classList.add('selected');

        // 1) Checkbox
        const tdCheck = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!combinacion.seleccionada;
        checkbox.addEventListener('change', () => {
            combinacion.seleccionada = checkbox.checked;
            fila.classList.toggle('selected', checkbox.checked);
            actualizarCheckboxSeleccionarTodas();
        });
        tdCheck.appendChild(checkbox);
        fila.appendChild(tdCheck);

        // 2) Índice
        const tdIdx = document.createElement('td');
        tdIdx.textContent = String(index + 1);
        fila.appendChild(tdIdx);

        // 3) Combinación (números o referencia a color-loto)
        const tdComb = document.createElement('td');
        if (combinacion.juego === 'color-loto') {
            combinacion.combinaciones.forEach(c => {
                const span = document.createElement('span');
                span.className = `color-loto-cell color-${c.color}`;
                span.textContent = String(c.numero);
                tdComb.appendChild(span);
            });
        } else if (Array.isArray(combinacion.numeros)) {
            combinacion.numeros.forEach(num => {
                const span = document.createElement('span');
                span.className = combinacion.juego === 'baloto' ? 'baloto-number' : 'mi-loto-number';
                span.textContent = String(num);
                tdComb.appendChild(span);
            });
        } else {
            tdComb.textContent = '-';
        }
        fila.appendChild(tdComb);

        // 4) Super Balota (baloto-only)
        const tdSuper = document.createElement('td');
        tdSuper.className = 'baloto-only';
        if (combinacion.juego === 'baloto' && combinacion.superBalota) {
            const spanSuper = document.createElement('span');
            spanSuper.className = 'super-balota';
            spanSuper.textContent = String(combinacion.superBalota);
            tdSuper.appendChild(spanSuper);
        } else {
            tdSuper.textContent = '-';
        }
        fila.appendChild(tdSuper);

        // 5) Color Loto column (color-loto-only)
        const tdColor = document.createElement('td');
        tdColor.className = 'color-loto-only';
        if (combinacion.juego === 'color-loto') {
            const colorLotoText = combinacion.combinaciones.map(c => `${c.color}:${c.numero}`).join(' ');
            tdColor.textContent = colorLotoText;
        } else {
            tdColor.textContent = '-';
        }
        fila.appendChild(tdColor);

        // 6) Puntuación
        const tdPunt = document.createElement('td');
        const puntuacion = calcularPuntuacion(combinacion);
        tdPunt.textContent = String(puntuacion >= 0 ? puntuacion : '-');
        tdPunt.style.fontWeight = 'bold';
        fila.appendChild(tdPunt);

        // 7) Probabilidad
        const tdProb = document.createElement('td');
        const probabilidad = parseFloat(calcularProbabilidadIndividual(combinacion));
        if (!isNaN(probabilidad)) {
            tdProb.textContent = probabilidad.toFixed(2) + '%';
            tdProb.style.color = probabilidad > 15 ? '#2ecc71' : probabilidad > 10 ? '#f39c12' : '#e74c3c';
        } else {
            tdProb.textContent = '-';
        }
        tdProb.style.fontWeight = 'bold';
        fila.appendChild(tdProb);

        elementos.cuerpoTabla.appendChild(fila);
    });
    
    actualizarCheckboxSeleccionarTodas();
}

// Función para calcular puntuación
// Función para calcular puntuación
function calcularPuntuacion(combinacion) {
    try {
        if (combinacion.juego === 'color-loto') {
            if (Array.isArray(combinacion.combinaciones) && combinacion.combinaciones.length > 0) {
                const colores = new Set(combinacion.combinaciones.map(c => c.color));
                const numeros = new Set(combinacion.combinaciones.map(c => c.numero));
                return colores.size + numeros.size;
            }
            return 0;
        } else {
            if (Array.isArray(combinacion.numeros) && combinacion.numeros.length > 0) {
                const pares = combinacion.numeros.filter(n => n % 2 === 0).length;
                const impares = combinacion.numeros.length - pares;
                return Math.min(pares, impares) * 2;
            }
            return 0;
        }
    } catch (e) {
        console.error('Error calculando puntuación:', e, combinacion);
        return 0;
    }
}

// Función para seleccionar mejores combinaciones
function seleccionarMejoresCombinaciones() {
    if (combinacionesActuales.length === 0) {
        mostrarNotificacion('No hay combinaciones', 'warning');
        return;
    }
    
    // Calcular puntuación considerando probabilidad
    combinacionesActuales.forEach(c => {
        c.puntuacionTotal = calcularPuntuacion(c) + (parseFloat(calcularProbabilidadIndividual(c)) / 5);
    });
    
    combinacionesActuales.sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);
    
    const cantidad = Math.max(1, Math.floor(combinacionesActuales.length * 0.3));
    combinacionesActuales.forEach(c => c.seleccionada = false);
    
    for (let i = 0; i < cantidad; i++) {
        combinacionesActuales[i].seleccionada = true;
    }
    
    renderizarTablaCombinaciones();
    mostrarNotificacion(`${cantidad} mejores combinaciones seleccionadas`, 'success');
}

// Función para eliminar seleccionadas
function eliminarCombinacionesSeleccionadas() {
    const seleccionadas = combinacionesActuales.filter(c => c.seleccionada);
    if (seleccionadas.length === 0) {
        mostrarNotificacion('No hay combinaciones seleccionadas', 'warning');
        return;
    }
    
    if (confirm(`¿Eliminar ${seleccionadas.length} combinación(es)?`)) {
        combinacionesActuales = combinacionesActuales.filter(c => !c.seleccionada);
        renderizarTablaCombinaciones();
        actualizarEstadisticas();
        mostrarNotificacion('Combinaciones eliminadas', 'success');
    }
}

// Función para limpiar actuales
function limpiarCombinacionesActuales() {
    try {
        if (combinacionesActuales.length === 0) {
            mostrarNotificacion('No hay combinaciones', 'info');
            return;
        }
        
        if (confirm('¿Limpiar todas las combinaciones?')) {
            combinacionesActuales = [];
            renderizarTablaCombinaciones();
            actualizarEstadisticas();
            mostrarNotificacion('Combinaciones limpiadas', 'success');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

// Función para limpiar estadísticas
function limpiarEstadisticas() {
    if (confirm('¿Limpiar todas las estadísticas? Esta acción no se puede deshacer.')) {
        estadisticas = {
            totalGeneradas: 0,
            totalGuardadas: 0,
            frecuenciaNumeros: {},
            lotesGuardados: 0
        };
        localStorage.setItem('estadisticasCombinaciones', JSON.stringify(estadisticas));
        actualizarEstadisticas();
        mostrarNotificacion('Estadísticas limpiadas', 'success');
    }
}// Función para seleccionar todas
function seleccionarTodasCombinaciones() {
    const seleccionar = elementos.seleccionarTodas.checked;
    combinacionesActuales.forEach(c => c.seleccionada = seleccionar);
    renderizarTablaCombinaciones();
}

// Función para actualizar checkbox "seleccionar todas"
function actualizarCheckboxSeleccionarTodas() {
    if (combinacionesActuales.length === 0) {
        elementos.seleccionarTodas.checked = false;
        elementos.seleccionarTodas.disabled = true;
    } else {
        elementos.seleccionarTodas.disabled = false;
        elementos.seleccionarTodas.checked = combinacionesActuales.every(c => c.seleccionada);
    }
}

// Función para guardar en histórico
function guardarEnHistorico() {
    try {
        if (combinacionesActuales.length === 0) {
            mostrarNotificacion('No hay combinaciones', 'info');
            return;
        }
        
        const lote = {
            id: Date.now(),
            fecha: new Date().toLocaleString('es-ES'),
            juego: elementos.juego.value,
            combinaciones: JSON.parse(JSON.stringify(combinacionesActuales))
        };
        
        historico.push(lote);
        localStorage.setItem('historicoCombinaciones', JSON.stringify(historico));
        
        estadisticas.totalGuardadas += combinacionesActuales.length;
        estadisticas.lotesGuardados++;
        localStorage.setItem('estadisticasCombinaciones', JSON.stringify(estadisticas));
        actualizarEstadisticas();
        
        mostrarNotificacion('Combinaciones guardadas en histórico', 'success');
    } catch (e) {
        console.error('Error guardando:', e);
        mostrarNotificacion('Error al guardar', 'error');
    }
}

// Exportar histórico a JSON descargable
function exportarHistorico() {
    if (!historico || historico.length === 0) {
        mostrarNotificacion('No hay histórico para exportar', 'info');
        return;
    }
    const data = JSON.stringify(historico, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historicoCombinaciones.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    mostrarNotificacion('Histórico exportado', 'success');
}

// Manejar archivo importado (JSON)
function manejarImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!Array.isArray(parsed)) throw new Error('Formato inválido: se esperaba un arreglo de lotes');

            // Validación simple de estructura y merge
            parsed.forEach(lote => {
                if (!lote.id || !lote.fecha || !lote.juego || !Array.isArray(lote.combinaciones)) {
                    throw new Error('Formato de lote inválido');
                }
            });

            historico = historico.concat(parsed);
            localStorage.setItem('historicoCombinaciones', JSON.stringify(historico));

            // Recomponer estadísticas basadas en historico importado
            recomputeEstadisticasFromHistorico();
            actualizarEstadisticas();
            mostrarNotificacion('Histórico importado correctamente', 'success');
        } catch (err) {
            mostrarNotificacion('Error importando JSON: ' + (err.message || err), 'danger');
        }
    };
    reader.readAsText(file);
    // reset input
    event.target.value = '';
}

// Recalcula estadísticas básicas desde el histórico (frecuencia y totales guardados/lotes)
function recomputeEstadisticasFromHistorico() {
    estadisticas.frecuenciaNumeros = {};
    estadisticas.totalGuardadas = 0;
    estadisticas.lotesGuardados = historico.length;

    historico.forEach(lote => {
        estadisticas.totalGuardadas += lote.combinaciones.length;
        lote.combinaciones.forEach(combi => {
            if (Array.isArray(combi.numeros)) {
                combi.numeros.forEach(n => {
                    estadisticas.frecuenciaNumeros[n] = (estadisticas.frecuenciaNumeros[n] || 0) + 1;
                });
            }
        });
    });

    guardarEstadisticas();
}

// Función para mostrar histórico
function mostrarHistorico() {
    // Limpiar contenido previo
    while (elementos.contenidoHistorico.firstChild) elementos.contenidoHistorico.removeChild(elementos.contenidoHistorico.firstChild);

    if (historico.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        const icon = document.createElement('div'); icon.textContent = '📋';
        const h3 = document.createElement('h3'); h3.textContent = 'No hay registros en el histórico';
        const p = document.createElement('p'); p.textContent = 'Genere y guarde combinaciones para verlas aquí';
        empty.appendChild(icon); empty.appendChild(h3); empty.appendChild(p);
        elementos.contenidoHistorico.appendChild(empty);
    } else {
        historico.forEach((lote, index) => {
            if (index > 0) {
                const sep = document.createElement('div');
                sep.className = 'separator';
                sep.textContent = '────────────────────────────────────────';
                elementos.contenidoHistorico.appendChild(sep);
            }

            const header = document.createElement('div');
            header.className = 'lot-header';
            header.textContent = `Generado el: ${lote.fecha} - Juego: ${obtenerNombreJuego(lote.juego)}`;
            elementos.contenidoHistorico.appendChild(header);

            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';

            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            ['#', 'Combinación', 'Puntuación'].forEach(text => {
                const th = document.createElement('th');
                th.style.border = '1px solid #ddd';
                th.style.padding = '8px';
                th.style.textAlign = 'center';
                th.textContent = text;
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            lote.combinaciones.forEach((combi, idx) => {
                const tr = document.createElement('tr');
                
                const tdIdx = document.createElement('td');
                tdIdx.style.border = '1px solid #ddd';
                tdIdx.style.padding = '8px';
                tdIdx.style.textAlign = 'center';
                tdIdx.textContent = idx + 1;
                tr.appendChild(tdIdx);

                const tdComb = document.createElement('td');
                tdComb.style.border = '1px solid #ddd';
                tdComb.style.padding = '8px';
                tdComb.style.textAlign = 'center';
                tdComb.textContent = formatearCombinacion(combi);
                tr.appendChild(tdComb);

                const tdScore = document.createElement('td');
                tdScore.style.border = '1px solid #ddd';
                tdScore.style.padding = '8px';
                tdScore.style.textAlign = 'center';
                tdScore.style.fontWeight = 'bold';
                tdScore.textContent = calcularPuntuacion(combi);
                tr.appendChild(tdScore);

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            elementos.contenidoHistorico.appendChild(table);
        });
    }

    elementos.seccionHistorico.classList.remove('hidden');
}

// Función para formatear combinación
function formatearCombinacion(combinacion) {
    if (combinacion.juego === 'color-loto') {
        return combinacion.combinaciones.map(c => `${c.color}:${c.numero}`).join(', ');
    } else if (combinacion.juego === 'baloto') {
        return `${combinacion.numeros.join(', ')} + ${combinacion.superBalota}`;
    } else {
        return combinacion.numeros.join(', ');
    }
}

// Función para limpiar histórico
function limpiarHistoricoCompleto() {
    if (historico.length === 0) {
        mostrarNotificacion('Histórico vacío', 'info');
        return;
    }
    
    if (confirm('¿Limpiar TODO el histórico?')) {
        historico = [];
        localStorage.removeItem('historicoCombinaciones');
        // Mostrar estado vacío usando nodos seguros
        while (elementos.contenidoHistorico.firstChild) elementos.contenidoHistorico.removeChild(elementos.contenidoHistorico.firstChild);
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        const icon = document.createElement('div'); icon.textContent = '📋';
        const h3 = document.createElement('h3'); h3.textContent = 'No hay registros en el histórico';
        const p = document.createElement('p'); p.textContent = 'Genere y guarde combinaciones para verlas aquí';
        empty.appendChild(icon); empty.appendChild(h3); empty.appendChild(p);
        elementos.contenidoHistorico.appendChild(empty);
        
        estadisticas.lotesGuardados = 0;
        estadisticas.totalGuardadas = 0;
        localStorage.setItem('estadisticasCombinaciones', JSON.stringify(estadisticas));
        actualizarEstadisticas();
        
        mostrarNotificacion('Histórico limpiado completamente', 'success');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    elementos.notification.textContent = mensaje;
    elementos.notification.className = `notification ${tipo}`;
    elementos.notification.classList.remove('hidden');
    
    setTimeout(() => {
        elementos.notification.classList.add('hidden');
    }, 3000);
}

// Exponer funciones (útil para pruebas en consola)
window._app = {
    generarCombinaciones,
    guardarEnHistorico,
    mostrarHistorico,
    exportarHistorico,
    manejarImportFile,
    recomputeEstadisticasFromHistorico
};
