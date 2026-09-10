/*
==========================================
CRUD DE MOTORES
==========================================
*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document
        .getElementById("btnGuardar")
        .addEventListener("click", guardar);

    document
        .getElementById("btnModificar")
        .addEventListener("click", modificar);

    document
        .getElementById("btnEliminar")
        .addEventListener("click", eliminar);

    document
        .getElementById("btnConsultar")
        .addEventListener("click", consultar);

    document
        .getElementById("btnLimpiar")
        .addEventListener("click", limpiar);

    document
        .getElementById("btnSalir")
        .addEventListener("click", salir);

    listar();
}

/*=========================================
    Obtener datos del formulario
=========================================*/

function obtenerFormulario() {

    return {

        codigo:
            document.getElementById("codigo").value.trim(),

        nombre:
            document.getElementById("nombre").value.trim(),

        tipo:
            document.getElementById("tipo").value.trim(),

        cilindrada:
            document.getElementById("cilindrada").value.trim(),

        potencia:
            document.getElementById("potencia").value.trim()

    };

}

/*=========================================
    Guardar
=========================================*/

async function guardar() {

    const motor = obtenerFormulario();

    const respuesta = await fetch("/motores", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(motor)

    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);

    listar();

}

/*=========================================
    Modificar
=========================================*/

async function modificar() {

    const motor = obtenerFormulario();

    const respuesta = await fetch("/motores", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(motor)

    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);

    listar();

}

/*=========================================
    Eliminar
=========================================*/

async function eliminar() {

    const codigo =
        document.getElementById("codigo").value.trim();

    if (codigo === "") {

        mostrarMensaje("Digite el código.");

        return;

    }

    const respuesta =
        await fetch("/motores/" + codigo, {
            method: "DELETE"
        });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);

    listar();

    limpiar();

}

/*=========================================
    Consultar
=========================================*/

async function consultar() {

    const codigo =
        document.getElementById("codigo").value.trim();

    if (codigo === "") {

        mostrarMensaje("Digite el código.");

        return;

    }

    const respuesta =
        await fetch("/motores/" + codigo);

    const datos = await respuesta.json();

    if (!respuesta.ok) {

        mostrarMensaje(datos.mensaje);

        return;

    }

    document.getElementById("nombre").value = datos.nombre;
    document.getElementById("tipo").value = datos.tipo;
    document.getElementById("cilindrada").value = datos.cilindrada;
    document.getElementById("potencia").value = datos.potencia;

    mostrarMensaje("Motor encontrado.");

}

/*=========================================
    Consultar todos
=========================================*/

async function listar() {

    const respuesta =
        await fetch("/motores");

    const motores =
        await respuesta.json();

    const tbody =
        document.querySelector("#tablaMotores tbody");

    tbody.innerHTML = "";

    motores.forEach(motor => {

        const fila =
            "<tr>" +
            "<td>" + motor.codigo + "</td>" +
            "<td>" + motor.nombre + "</td>" +
            "<td>" + motor.tipo + "</td>" +
            "<td>" + motor.cilindrada + "</td>" +
            "<td>" + motor.potencia + "</td>" +
            "</tr>";

        tbody.innerHTML += fila;

    });

}

/*=========================================
    Limpiar
=========================================*/

function limpiar() {

    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("cilindrada").value = "";
    document.getElementById("potencia").value = "";

}

/*=========================================
    Salir
=========================================*/

function salir() {

    window.location.href = "/logout";

}

/*=========================================
    Mostrar mensaje
=========================================*/

function mostrarMensaje(texto) {

    document
        .getElementById("mensaje")
        .innerHTML = texto;

}
