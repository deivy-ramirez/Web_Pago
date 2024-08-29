let trabajadores = [];
let asistencia = {};
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();

function inicializarSelectores() {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const selectMes = document.getElementById('mes-select');
    const selectAnio = document.getElementById('anio-select');

    meses.forEach((mes, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = mes;
        selectMes.appendChild(option);
    });
    selectMes.value = mesActual;

    for (let i = anioActual - 1; i <= anioActual + 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectAnio.appendChild(option);
    }
    selectAnio.value = anioActual;
}

function cambiarPeriodo() {
    mesActual = parseInt(document.getElementById('mes-select').value);
    anioActual = parseInt(document.getElementById('anio-select').value);
    actualizarCalendario();
}

function actualizarCalendario() {
    const container = document.getElementById('calendario-container');
    container.innerHTML = '';

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const ultimoDia = new Date(anioActual, mesActual + 1, 0).getDate();

    trabajadores.forEach(trabajador => {
        const calendarioTrabajador = document.createElement('div');
        calendarioTrabajador.className = 'calendario-trabajador';
        
        const nombreTrabajador = document.createElement('div');
        nombreTrabajador.className = 'trabajador-nombre';
        nombreTrabajador.textContent = trabajador.nombre;
        calendarioTrabajador.appendChild(nombreTrabajador);

        const calendario = document.createElement('div');
        calendario.className = 'calendario';

        diasSemana.forEach(dia => {
            const diaHeader = document.createElement('div');
            diaHeader.className = 'dia dia-header';
            diaHeader.textContent = dia;
            calendario.appendChild(diaHeader);
        });

        for (let i = 0; i < primerDia; i++) {
            calendario.appendChild(document.createElement('div'));
        }

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const diaElement = document.createElement('div');
            diaElement.className = 'dia';
            const diaNumero = document.createElement('span');
            diaNumero.className = 'dia-numero';
            diaNumero.textContent = dia;
            diaElement.appendChild(diaNumero);

            const periodoKey = `${anioActual}-${mesActual + 1}-${dia}`;
            if (asistencia[periodoKey]?.[trabajador.nombre]) {
                diaElement.classList.add('trabajado');
            }

            diaElement.addEventListener('click', () => {
                diaElement.classList.toggle('trabajado');
                if (!asistencia[periodoKey]) {
                    asistencia[periodoKey] = {};
                }
                asistencia[periodoKey][trabajador.nombre] = diaElement.classList.contains('trabajado');
            });

            calendario.appendChild(diaElement);
        }

        calendarioTrabajador.appendChild(calendario);
        container.appendChild(calendarioTrabajador);
    });
}

function agregarTrabajador() {
    const nombre = document.getElementById('nombre-trabajador').value.trim();
    if (nombre && !trabajadores.some(t => t.nombre === nombre)) {
        trabajadores.push({ nombre });
        document.getElementById('nombre-trabajador').value = '';
        actualizarCalendario();
        actualizarListaTrabajadores();
    } else {
        alert('Por favor, ingrese un nombre válido y no repetido.');
    }
}

function eliminarTrabajador(nombre) {
    trabajadores = trabajadores.filter(t => t.nombre !== nombre);
    // Eliminar la asistencia del trabajador
    Object.keys(asistencia).forEach(fecha => {
        if (asistencia[fecha][nombre]) {
            delete asistencia[fecha][nombre];
        }
    });
    actualizarCalendario();
    actualizarListaTrabajadores();
}

function actualizarListaTrabajadores() {
    const lista = document.getElementById('lista-trabajadores');
    lista.innerHTML = '<h3>Lista de Trabajadores</h3>';
    trabajadores.forEach(trabajador => {
        const item = document.createElement('div');
        item.className = 'trabajador-item';
        item.innerHTML = `
            <span>${trabajador.nombre}</span>
            <button class="btn-eliminar" onclick="eliminarTrabajador('${trabajador.nombre}')">Eliminar</button>
        `;
        lista.appendChild(item);
    });
}

function guardarAsistencia() {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
    localStorage.setItem('asistencia', JSON.stringify(asistencia));
    alert('Asistencia guardada correctamente');
}

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

window.onload = function() {
    cargarDatos();
    inicializarSelectores();
    actualizarCalendario();
    actualizarListaTrabajadores();
};