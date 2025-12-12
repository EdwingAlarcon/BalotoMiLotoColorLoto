// Configuración global de la aplicación
const CONFIG = {
    version: '1.0.0',
    maxCombinaciones: 100,
    maxHistorial: 1000,
    juegos: {
        baloto: {
            nombre: 'Baloto',
            numeros: 6,
            minNumero: 1,
            maxNumero: 43,
            superBalota: true,
            minSuperBalota: 1,
            maxSuperBalota: 16,
            descripcion: 'Selecciona 6 números del 1 al 43 y 1 Super Balota del 1 al 16'
        },
        'mi-loto': {
            nombre: 'Mi Loto',
            numeros: 5,
            minNumero: 1,
            maxNumero: 46,
            superBalota: false,
            descripcion: 'Selecciona 5 números del 1 al 46'
        },
        'color-loto': {
            nombre: 'Color Loto',
            numeros: 6,
            minNumero: 1,
            maxNumero: 42,
            superBalota: false,
            colores: true,
            coloresDisponibles: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
            descripcion: 'Selecciona 6 números del 1 al 42 y un color para cada número'
        }
    }
};

// Estado de la aplicación
const AppState = {
    combinaciones: [],
    historial: [],
    estadisticas: {
        totalGeneradas: 0,
        totalLotes: 0,
        frecuenciaNumeros: {},
        probabilidadAcumulada: 0
    },
    config: CONFIG,
    tema: localStorage.getItem('tema') || 'light'
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    // Cargar datos guardados
    cargarDatos();
    
    // Aplicar tema
    aplicarTema(AppState.tema);
    
    // Inicializar UI
    inicializarUI();
    
    // Inicializar eventos
    inicializarEventos();
    
    // Actualizar estadísticas iniciales
    actualizarEstadisticas();
    
    // Mostrar reglas del juego actual
    mostrarReglasJuego();
    
    console.log('Aplicación inicializada correctamente');
}

function inicializarUI() {
    // Actualizar versión en el footer
    const versionElement = document.querySelector('.version');
    if (versionElement) {
        versionElement.textContent = `v${CONFIG.version}`;
    }
    
    // Actualizar tabla vacía
    actualizarTablaCombinaciones();
}

function inicializarEventos() {
    // Controles principales
    document.getElementById('juego').addEventListener('change', manejarCambioJuego);
    document.getElementById('generar').addEventListener('click', generarCombinaciones);
    document.getElementById('guardar').addEventListener('click', guardarEnHistorial);
    document.getElementById('seleccionar-mejores').addEventListener('click', seleccionarMejores);
    document.getElementById('eliminar-seleccionados').addEventListener('click', eliminarSeleccionadas);
    document.getElementById('limpiar').addEventListener('click', limpiarCombinaciones);
    document.getElementById('seleccionar-todas').addEventListener('change', manejarSeleccionTodas);
    
    // Estadísticas
    document.getElementById('limpiar-estadisticas').addEventListener('click', limpiarEstadisticas);
    
    // Tema
    document.getElementById('themeToggle').addEventListener('click', alternarTema);
    
    // Histórico
    document.getElementById('ver-historial').addEventListener('click', mostrarHistorial);
    document.getElementById('cerrar-historico').addEventListener('click', cerrarHistorial);
    document.getElementById('export-historico').addEventListener('click', exportarHistorial);
    document.getElementById('import-historico').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importarHistorial);
    document.getElementById('limpiar-historico').addEventListener('click', limpiarHistorial);
    
    // Cerrar modal al hacer clic fuera
    document.querySelector('.modal-overlay')?.addEventListener('click', cerrarHistorial);
    
    // Prevenir envío de formularios
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => e.preventDefault());
    });
}

// Funciones principales de la aplicación
function manejarCambioJuego() {
    mostrarReglasJuego();
    actualizarTablaCombinaciones();
    actualizarClasesJuego();
}

function generarCombinaciones() {
    const juego = document.getElementById('juego').value;
    const cantidad = parseInt(document.getElementById('combinaciones').value);
    
    if (isNaN(cantidad) || cantidad < 1 || cantidad > CONFIG.maxCombinaciones) {
        mostrarNotificacion('error', `Ingresa un número entre 1 y ${CONFIG.maxCombinaciones}`);
        return;
    }
    
    const configJuego = CONFIG.juegos[juego];
    const nuevasCombinaciones = [];
    
    for (let i = 0; i < cantidad; i++) {
        const combinacion = generarCombinacionUnica(configJuego, juego);
        nuevasCombinaciones.push(combinacion);
    }
    
    AppState.combinaciones.push(...nuevasCombinaciones);
    AppState.estadisticas.totalGeneradas += nuevasCombinaciones.length;
    
    actualizarTablaCombinaciones();
    actualizarEstadisticas();
    mostrarNotificacion('success', `${cantidad} combinación(es) generada(s) correctamente`);
}

function guardarEnHistorial() {
    if (AppState.combinaciones.length === 0) {
        mostrarNotificacion('warning', 'No hay combinaciones para guardar');
        return;
    }
    
    const lote = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        juego: document.getElementById('juego').value,
        combinaciones: [...AppState.combinaciones]
    };
    
    AppState.historial.unshift(lote);
    AppState.estadisticas.totalLotes++;
    
    if (AppState.historial.length > CONFIG.maxHistorial) {
        AppState.historial.pop();
    }
    
    guardarDatos();
    mostrarNotificacion('success', 'Combinaciones guardadas en el histórico');
}

// Exportar funciones al ámbito global
window.AppState = AppState;
window.CONFIG = CONFIG;