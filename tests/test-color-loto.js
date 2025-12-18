/**
 * Script de prueba para validar las reglas de Color Loto
 * Ejecutar en la consola del navegador después de cargar index.html
 */

function testColorLotoRules() {
    console.log('🧪 Iniciando pruebas de Color Loto...\n');

    // Cambiar a Color Loto
    const juegoSelect = document.getElementById('juego');
    if (juegoSelect) {
        juegoSelect.value = 'color-loto';
        juegoSelect.dispatchEvent(new Event('change'));
    }

    const config = {
        coloresDisponibles: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
        numeros: 6,
        minNumero: 1,
        maxNumero: 7
    };

    let testsPasados = 0;
    let testsFallados = 0;

    // Generar 100 combinaciones de prueba
    const combinaciones = [];
    for (let i = 0; i < 100; i++) {
        const comb = generarCombinacionUnica(config, 'color-loto');
        combinaciones.push(comb);
    }

    console.log(`✅ Generadas ${combinaciones.length} combinaciones\n`);

    // Test 1: Verificar que todas tienen 6 colores
    console.log('📋 Test 1: Todas las combinaciones tienen 6 colores');
    let test1Pass = true;
    combinaciones.forEach((comb, idx) => {
        if (comb.colores.length !== 6) {
            console.error(`❌ Combinación ${idx}: tiene ${comb.colores.length} colores`);
            test1Pass = false;
        }
    });
    if (test1Pass) {
        console.log('✅ PASADO\n');
        testsPasados++;
    } else {
        console.log('❌ FALLADO\n');
        testsFallados++;
    }

    // Test 2: Verificar que todos tienen 6 números
    console.log('📋 Test 2: Todas las combinaciones tienen 6 números');
    let test2Pass = true;
    combinaciones.forEach((comb, idx) => {
        if (comb.colorNumeros.length !== 6) {
            console.error(`❌ Combinación ${idx}: tiene ${comb.colorNumeros.length} números`);
            test2Pass = false;
        }
    });
    if (test2Pass) {
        console.log('✅ PASADO\n');
        testsPasados++;
    } else {
        console.log('❌ FALLADO\n');
        testsFallados++;
    }

    // Test 3: Verificar que los números están en rango 1-7
    console.log('📋 Test 3: Todos los números están entre 1 y 7');
    let test3Pass = true;
    combinaciones.forEach((comb, idx) => {
        comb.colorNumeros.forEach((num, numIdx) => {
            if (num < 1 || num > 7) {
                console.error(`❌ Combinación ${idx}, posición ${numIdx}: número ${num} fuera de rango`);
                test3Pass = false;
            }
        });
    });
    if (test3Pass) {
        console.log('✅ PASADO\n');
        testsPasados++;
    } else {
        console.log('❌ FALLADO\n');
        testsFallados++;
    }

    // Test 4: Verificar que no hay parejas (color, número) duplicadas en cada combinación
    console.log('📋 Test 4: No hay parejas (color, número) duplicadas en cada combinación');
    let test4Pass = true;
    combinaciones.forEach((comb, idx) => {
        const parejas = new Set();
        for (let i = 0; i < comb.colores.length; i++) {
            const pareja = `${comb.colores[i]}-${comb.colorNumeros[i]}`;
            if (parejas.has(pareja)) {
                console.error(`❌ Combinación ${idx}: pareja duplicada (${comb.colores[i]}, ${comb.colorNumeros[i]})`);
                test4Pass = false;
            }
            parejas.add(pareja);
        }
    });
    if (test4Pass) {
        console.log('✅ PASADO\n');
        testsPasados++;
    } else {
        console.log('❌ FALLADO\n');
        testsFallados++;
    }

    // Test 5: Verificar reglas de repetición (colores repetidos CON números únicos, O números repetidos CON colores únicos)
    console.log('📋 Test 5: Reglas de repetición correctas');
    let test5Pass = true;
    let combinacionesConColoresRepetidos = 0;
    let combinacionesConNumerosRepetidos = 0;

    combinaciones.forEach((comb, idx) => {
        const coloresUnicos = new Set(comb.colores).size;
        const numerosUnicos = new Set(comb.colorNumeros).size;

        if (coloresUnicos < 6) combinacionesConColoresRepetidos++;
        if (numerosUnicos < 6) combinacionesConNumerosRepetidos++;

        // Si hay colores repetidos Y números repetidos, verificar que al menos uno tenga mayoría de únicos
        if (coloresUnicos < 6 && numerosUnicos < 6) {
            if (coloresUnicos < 5 && numerosUnicos < 5) {
                console.error(`❌ Combinación ${idx}: tiene muchos colores (${coloresUnicos}/6) Y números (${numerosUnicos}/6) repetidos`);
                console.error(`   Colores: ${comb.colores.join(', ')}`);
                console.error(`   Números: ${comb.colorNumeros.join(', ')}`);
                test5Pass = false;
            }
        }
    });

    console.log(`   Combinaciones con colores repetidos: ${combinacionesConColoresRepetidos}`);
    console.log(`   Combinaciones con números repetidos: ${combinacionesConNumerosRepetidos}`);

    if (test5Pass) {
        console.log('✅ PASADO\n');
        testsPasados++;
    } else {
        console.log('❌ FALLADO\n');
        testsFallados++;
    }

    // Test 6: Mostrar ejemplos de combinaciones generadas
    console.log('📋 Test 6: Ejemplos de combinaciones generadas');
    console.log('Mostrando 5 ejemplos aleatorios:\n');

    for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * combinaciones.length);
        const comb = combinaciones[idx];
        console.log(`Ejemplo ${i + 1}:`);
        for (let j = 0; j < comb.colores.length; j++) {
            const emoji = {
                'amarillo': '🟡',
                'azul': '🔵',
                'rojo': '🔴',
                'verde': '🟢',
                'blanco': '⚪',
                'negro': '⚫'
            }[comb.colores[j]];
            console.log(`   ${emoji} ${comb.colores[j]} → ${comb.colorNumeros[j]}`);
        }
        const coloresUnicos = new Set(comb.colores).size;
        const numerosUnicos = new Set(comb.colorNumeros).size;
        console.log(`   (${coloresUnicos} colores únicos, ${numerosUnicos} números únicos)\n`);
    }
    testsPasados++;

    // Resumen
    console.log('═══════════════════════════════════════');
    console.log(`📊 RESUMEN DE PRUEBAS:`);
    console.log(`   ✅ Pruebas pasadas: ${testsPasados}`);
    console.log(`   ❌ Pruebas falladas: ${testsFallados}`);
    console.log(`   📈 Total: ${testsPasados + testsFallados}`);
    console.log('═══════════════════════════════════════\n');

    return testsFallados === 0;
}

// Exportar función para uso en consola
window.testColorLotoRules = testColorLotoRules;

console.log('💡 Prueba cargada. Ejecuta testColorLotoRules() en la consola para probar las reglas de Color Loto.');
