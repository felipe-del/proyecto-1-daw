document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnEspecificacionGuardar").addEventListener("click", guardarEspecificacion);
    document.getElementById("btnEspecificacionLimpiar").addEventListener("click", limpiarEspecificacion);
    document.getElementById("btnConfiguracionGuardar").addEventListener("click", guardarConfiguracion);
    document.getElementById("btnConfiguracionLimpiar").addEventListener("click", limpiarConfiguracion);
    document.getElementById("btnEagerConfiguraciones").addEventListener("click", mostrarEagerConfiguraciones);

    listarEspecificaciones();
    listarConfiguraciones();
}

function leerImagen(input) {

    return new Promise(resolve => {

        if (!input.files[0]) {
            resolve(null);
            return;
        }

        const lector = new FileReader();

        lector.onload = function() {
            resolve(lector.result);
        };

        lector.readAsDataURL(input.files[0]);
    });
}

function mostrarMensaje(texto) {
    document.getElementById("mensajeConfiguracion").textContent = texto;
}

async function guardarEspecificacion() {

    const id = document.getElementById("especificacionId").value;
    const imagen = await leerImagen(document.getElementById("imagenEspecificacion"));

    const especificacion = {
        codigo_especificacion: document.getElementById("codigoEspecificacion").value,
        arquitectura: document.getElementById("arquitectura").value,
        numero_cilindros: document.getElementById("numeroCilindros").value,
        aspiracion: document.getElementById("aspiracion").value,
        rpm_maxima: document.getElementById("rpmMaxima").value,
        sistema_refrigeracion: document.getElementById("sistemaRefrigeracion").value,
        relacion_compresion: document.getElementById("relacionCompresion").value,
        imagen_especificacion: imagen
    };

    const respuesta = await fetch(
        id ? "/postgres/especificaciones/" + id : "/postgres/especificaciones",
        {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(especificacion)
        }
    );

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    limpiarEspecificacion();
    listarEspecificaciones();
}

async function listarEspecificaciones() {

    const respuesta = await fetch("/postgres/especificaciones");
    const especificaciones = await respuesta.json();
    const tabla = document.getElementById("tablaEspecificaciones");

    tabla.innerHTML = "";

    especificaciones.forEach(especificacion => {

        const fila = document.createElement("tr");
        const imagen = especificacion.imagen_especificacion
            ? "<img width='60' src='data:image/jpeg;base64," + especificacion.imagen_especificacion + "'>"
            : "";

        fila.innerHTML =
            "<td>" + especificacion.id + "</td>" +
            "<td>" + especificacion.codigo_especificacion + "</td>" +
            "<td>" + especificacion.arquitectura + "</td>" +
            "<td>" + especificacion.numero_cilindros + "</td>" +
            "<td>" + especificacion.rpm_maxima + "</td>" +
            "<td>" + imagen + "</td>" +
            "<td><button data-id='" + especificacion.id + "' class='btnEspecificacionEditar'>Editar</button>" +
            "<button data-id='" + especificacion.id + "' class='btnEspecificacionEliminar'>Eliminar</button></td>";

        tabla.appendChild(fila);
    });

    document.querySelectorAll(".btnEspecificacionEditar").forEach(boton => {
        boton.addEventListener("click", () => consultarEspecificacion(boton.dataset.id));
    });

    document.querySelectorAll(".btnEspecificacionEliminar").forEach(boton => {
        boton.addEventListener("click", () => eliminarEspecificacion(boton.dataset.id));
    });
}

async function consultarEspecificacion(id) {

    const respuesta = await fetch("/postgres/especificaciones/" + id);
    const especificacion = await respuesta.json();

    document.getElementById("especificacionId").value = especificacion.id;
    document.getElementById("codigoEspecificacion").value = especificacion.codigo_especificacion;
    document.getElementById("arquitectura").value = especificacion.arquitectura;
    document.getElementById("numeroCilindros").value = especificacion.numero_cilindros;
    document.getElementById("aspiracion").value = especificacion.aspiracion;
    document.getElementById("rpmMaxima").value = especificacion.rpm_maxima;
    document.getElementById("sistemaRefrigeracion").value = especificacion.sistema_refrigeracion;
    document.getElementById("relacionCompresion").value = especificacion.relacion_compresion;
    document.getElementById("imagenEspecificacionVista").src = especificacion.imagen_especificacion
        ? "data:image/jpeg;base64," + especificacion.imagen_especificacion
        : "";
    mostrarMensaje("Especificación consultada");
}

async function eliminarEspecificacion(id) {

    if (!confirm("¿Desea eliminar esta especificación?")) {
        return;
    }

    const respuesta = await fetch("/postgres/especificaciones/" + id, {
        method: "DELETE"
    });

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    listarEspecificaciones();
}

function limpiarEspecificacion() {
    document.getElementById("especificacionId").value = "";
    document.getElementById("codigoEspecificacion").value = "";
    document.getElementById("arquitectura").value = "";
    document.getElementById("numeroCilindros").value = "";
    document.getElementById("aspiracion").value = "";
    document.getElementById("rpmMaxima").value = "";
    document.getElementById("sistemaRefrigeracion").value = "";
    document.getElementById("relacionCompresion").value = "";
    document.getElementById("imagenEspecificacion").value = "";
    document.getElementById("imagenEspecificacionVista").src = "";
}

async function guardarConfiguracion() {

    const id = document.getElementById("configuracionId").value;
    const imagen = await leerImagen(document.getElementById("imagenConfiguracion"));

    const configuracion = {
        nombre_configuracion: document.getElementById("nombreConfiguracion").value,
        tipo_traccion: document.getElementById("tipoTraccion").value,
        transmision: document.getElementById("transmision").value,
        numero_marchas: document.getElementById("numeroMarchas").value,
        tipo_neumatico: document.getElementById("tipoNeumatico").value,
        carga_aerodinamica: document.getElementById("cargaAerodinamica").value,
        altura_mm: document.getElementById("alturaMm").value,
        especificacion_motor_id: document.getElementById("especificacionMotorId").value,
        imagen_configuracion: imagen
    };

    const respuesta = await fetch(
        id ? "/postgres/configuraciones/" + id : "/postgres/configuraciones",
        {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(configuracion)
        }
    );

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    limpiarConfiguracion();
    listarConfiguraciones();
}

async function listarConfiguraciones() {

    const respuesta = await fetch("/postgres/configuraciones");
    const configuraciones = await respuesta.json();
    const tabla = document.getElementById("tablaConfiguraciones");

    tabla.innerHTML = "";

    configuraciones.forEach(configuracion => {

        const fila = document.createElement("tr");
        const imagen = configuracion.imagen_configuracion
            ? "<img width='60' src='data:image/jpeg;base64," + configuracion.imagen_configuracion + "'>"
            : "";

        fila.innerHTML =
            "<td>" + configuracion.id + "</td>" +
            "<td>" + configuracion.nombre_configuracion + "</td>" +
            "<td>" + configuracion.tipo_traccion + "</td>" +
            "<td>" + configuracion.transmision + "</td>" +
            "<td>" + configuracion.especificacion_motor_id + "</td>" +
            "<td>" + imagen + "</td>" +
            "<td><button data-id='" + configuracion.id + "' class='btnConfiguracionEditar'>Editar</button>" +
            "<button data-id='" + configuracion.id + "' class='btnConfiguracionEliminar'>Eliminar</button></td>";

        tabla.appendChild(fila);
    });

    document.querySelectorAll(".btnConfiguracionEditar").forEach(boton => {
        boton.addEventListener("click", () => consultarConfiguracion(boton.dataset.id));
    });

    document.querySelectorAll(".btnConfiguracionEliminar").forEach(boton => {
        boton.addEventListener("click", () => eliminarConfiguracion(boton.dataset.id));
    });
}

async function consultarConfiguracion(id) {

    const respuesta = await fetch("/postgres/configuraciones/" + id);
    const configuracion = await respuesta.json();

    document.getElementById("configuracionId").value = configuracion.id;
    document.getElementById("nombreConfiguracion").value = configuracion.nombre_configuracion;
    document.getElementById("tipoTraccion").value = configuracion.tipo_traccion;
    document.getElementById("transmision").value = configuracion.transmision;
    document.getElementById("numeroMarchas").value = configuracion.numero_marchas;
    document.getElementById("tipoNeumatico").value = configuracion.tipo_neumatico;
    document.getElementById("cargaAerodinamica").value = configuracion.carga_aerodinamica;
    document.getElementById("alturaMm").value = configuracion.altura_mm;
    document.getElementById("especificacionMotorId").value = configuracion.especificacion_motor_id;
    document.getElementById("imagenConfiguracionVista").src = configuracion.imagen_configuracion
        ? "data:image/jpeg;base64," + configuracion.imagen_configuracion
        : "";
    mostrarMensaje("Configuración consultada");
}

async function eliminarConfiguracion(id) {

    if (!confirm("¿Desea eliminar esta configuración?")) {
        return;
    }

    const respuesta = await fetch("/postgres/configuraciones/" + id, {
        method: "DELETE"
    });

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    listarConfiguraciones();
}

function limpiarConfiguracion() {
    document.getElementById("configuracionId").value = "";
    document.getElementById("nombreConfiguracion").value = "";
    document.getElementById("tipoTraccion").value = "";
    document.getElementById("transmision").value = "";
    document.getElementById("numeroMarchas").value = "";
    document.getElementById("tipoNeumatico").value = "";
    document.getElementById("cargaAerodinamica").value = "";
    document.getElementById("alturaMm").value = "";
    document.getElementById("especificacionMotorId").value = "";
    document.getElementById("imagenConfiguracion").value = "";
    document.getElementById("imagenConfiguracionVista").src = "";
}

async function mostrarEagerConfiguraciones() {

    const respuesta = await fetch("/postgres/configuraciones-eager");
    const configuraciones = await respuesta.json();
    const tabla = document.getElementById("tablaEagerConfiguraciones");

    tabla.innerHTML = "";

    configuraciones.forEach(configuracion => {
        const fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + configuracion.nombre_configuracion + "</td>" +
            "<td>" + configuracion.tipo_traccion + "</td>" +
            "<td>" + configuracion.codigo_especificacion + "</td>" +
            "<td>" + configuracion.arquitectura + "</td>" +
            "<td>" + configuracion.rpm_maxima + "</td>";
        tabla.appendChild(fila);
    });
}
