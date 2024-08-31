let trabajadores = [];
let asistencia = {};

// Cargar datos desde localStorage
function cargarDatos() {
    const trabajadoresGuardados = localStorage.getItem('trabajadores');
    if (trabajadoresGuardados) {
        trabajadores = JSON.parse(trabajadoresGuardados);
    }

    const asistenciaGuardada = localStorage.getItem('asistencia');
    if (asistenciaGuardada) {
        asistencia = JSON.parse(asistenciaGuardada);
    }
}

// Actualizar el select de trabajadores en la calculadora de salarios
function actualizarSelectTrabajadores() {
    const select = document.getElementById('select-trabajador');
    select.innerHTML = '<option value="">Seleccione un trabajador</option>';
    trabajadores.forEach(trabajador => {
        const option = document.createElement('option');
        option.value = trabajador.nombre;
        option.textContent = trabajador.nombre;
        select.appendChild(option);
    });
}

// Actualizar el salario de un trabajador seleccionado
function actualizarSalario() {
    const nombre = document.getElementById('select-trabajador').value;
    const salarioDia = parseFloat(document.getElementById('salarioDia').value);

    if (nombre && !isNaN(salarioDia)) {
        const trabajador = trabajadores.find(t => t.nombre === nombre);
        if (trabajador) {
            trabajador.salarioDia = salarioDia;
            guardarTrabajadores(); // Guardar la lista actualizada en localStorage
            actualizarTabla(); // Actualizar la tabla con el nuevo salario
            document.getElementById('salarioDia').value = ''; // Limpiar el campo de salario
        }
    } else {
        alert('Por favor, seleccione un trabajador e ingrese un salario válido.');
    }
}

// Guardar la lista de trabajadores en localStorage
function guardarTrabajadores() {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
}

// Actualizar la tabla de salarios en la calculadora
function actualizarTabla() {
    const tbody = document.querySelector('#tablaTrabajadores tbody');
    let totalPagar = 0;

    tbody.innerHTML = '';

    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const anioActual = fecha.getFullYear();

    trabajadores.forEach(trabajador => {
        let diasTrabajados = 0;
        for (let dia = 1; dia <= 31; dia++) { // Contamos hasta 31 para cubrir todos los días posibles del mes
            const periodoKey = `${anioActual}-${mesActual}-${dia}`;
            if (asistencia[periodoKey] && asistencia[periodoKey][trabajador.nombre]) {
                diasTrabajados++;
            }
        }

        const salarioQuincenal = (trabajador.salarioDia || 0) * diasTrabajados;
        totalPagar += salarioQuincenal;

        const fila = tbody.insertRow();
        fila.insertCell(0).textContent = trabajador.nombre;
        fila.insertCell(1).textContent = trabajador.salarioDia ? `$${trabajador.salarioDia.toFixed(2)}` : 'No establecido';
        fila.insertCell(2).textContent = diasTrabajados;
        fila.insertCell(3).textContent = `$${salarioQuincenal.toFixed(2)}`;
    });

    document.getElementById('totalPagar').textContent = totalPagar.toFixed(2);
}

// Inicializar la página de la calculadora de salarios
window.onload = function() {
    cargarDatos();
    actualizarSelectTrabajadores();
    actualizarTabla();
};