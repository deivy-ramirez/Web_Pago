let trabajadores = [];
let asistencia = {};

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

function actualizarSalario() {
    const nombre = document.getElementById('select-trabajador').value;
    const salarioDia = parseFloat(document.getElementById('salarioDia').value);

    if (nombre && !isNaN(salarioDia)) {
        const trabajador = trabajadores.find(t => t.nombre === nombre);
        if (trabajador) {
            trabajador.salarioDia = salarioDia;
            guardarTrabajadores();
            actualizarTabla();
            document.getElementById('salarioDia').value = '';
        }
    } else {
        alert('Por favor, seleccione un trabajador e ingrese un salario válido.');
    }
}

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

function guardarTrabajadores() {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
}

window.onload = function() {
    cargarDatos();
    actualizarSelectTrabajadores();
    actualizarTabla();
};