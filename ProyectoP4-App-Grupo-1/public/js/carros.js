/*
==========================================
CRUD DE CARROS
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

        marca:
            document.getElementById("marca").value.trim(),

        categoria:
            document.getElementById("categoria").value.trim(),

        velocidadMaxima:
            document.getElementById("velocidadMaxima").value.trim()

    };

}

/*=========================================
    Guardar
=========================================*/

async function guardar() {

    const carro = obtenerFormulario();

    const respuesta = await fetch("/carros", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(carro)

    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);

    listar();

}

/*=========================================
    Modificar
=========================================*/

async function modificar() {

    const carro = obtenerFormulario();

    const respuesta = await fetch("/carros", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(carro)

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
        await fetch("/carros/" + codigo, {
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
        await fetch("/carros/" + codigo);

    const datos = await respuesta.json();

    if (!respuesta.ok) {

        mostrarMensaje(datos.mensaje);

        return;

    }

    document.getElementById("nombre").value = datos.nombre;
    document.getElementById("marca").value = datos.marca;
    document.getElementById("categoria").value = datos.categoria;
    document.getElementById("velocidadMaxima").value = datos.velocidadMaxima;

    mostrarMensaje("Carro encontrado.");

}

/*=========================================
    Consultar todos
=========================================*/

async function listar() {

    const respuesta =
        await fetch("/carros");

    const carros =
        await respuesta.json();

    const tbody =
        document.querySelector("#tablaCarros tbody");

    tbody.innerHTML = "";

    carros.forEach(carro => {

        const fila =
            "<tr>" +
            "<td>" + carro.codigo + "</td>" +
            "<td>" + carro.nombre + "</td>" +
            "<td>" + carro.marca + "</td>" +
            "<td>" + carro.categoria + "</td>" +
            "<td>" + carro.velocidadMaxima + "</td>" +
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
    document.getElementById("marca").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("velocidadMaxima").value = "";

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
