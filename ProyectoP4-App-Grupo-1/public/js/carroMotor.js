document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnMotorGuardar").addEventListener("click", guardarMotor);
    document.getElementById("btnMotorLimpiar").addEventListener("click", limpiarMotor);
    document.getElementById("btnCarroGuardar").addEventListener("click", guardarCarro);
    document.getElementById("btnCarroLimpiar").addEventListener("click", limpiarCarro);
    document.getElementById("btnEagerCarros").addEventListener("click", mostrarEagerCarros);

    listarMotores();
    listarCarros();
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
    document.getElementById("mensajePostgres").textContent = texto;
}

async function guardarMotor() {

    const id = document.getElementById("motorId").value;
    const imagen = await leerImagen(document.getElementById("motorImagen"));

    const motor = {
        nombre: document.getElementById("motorNombre").value,
        fabricante: document.getElementById("motorFabricante").value,
        tipo: document.getElementById("motorTipo").value,
        cilindrada_cc: document.getElementById("motorCilindrada").value,
        potencia_hp: document.getElementById("motorPotencia").value,
        torque_nm: document.getElementById("motorTorque").value,
        combustible: document.getElementById("motorCombustible").value,
        imagen_motor: imagen
    };

    const respuesta = await fetch(
        id ? "/postgres/motores/" + id : "/postgres/motores",
        {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(motor)
        }
    );

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    limpiarMotor();
    listarMotores();
}

async function listarMotores() {

    const respuesta = await fetch("/postgres/motores");
    const motores = await respuesta.json();
    const tabla = document.getElementById("tablaMotoresPostgres");

    tabla.innerHTML = "";

    motores.forEach(motor => {

        const fila = document.createElement("tr");
        const imagen = motor.imagen_motor
            ? "<img width='60' src='data:image/jpeg;base64," + motor.imagen_motor + "'>"
            : "";

        fila.innerHTML =
            "<td>" + motor.id + "</td>" +
            "<td>" + motor.nombre + "</td>" +
            "<td>" + motor.fabricante + "</td>" +
            "<td>" + motor.tipo + "</td>" +
            "<td>" + motor.potencia_hp + "</td>" +
            "<td>" + imagen + "</td>" +
            "<td><button data-id='" + motor.id + "' class='btnMotorEditar'>Editar</button>" +
            "<button data-id='" + motor.id + "' class='btnMotorEliminar'>Eliminar</button></td>";

        tabla.appendChild(fila);
    });

    document.querySelectorAll(".btnMotorEditar").forEach(boton => {
        boton.addEventListener("click", () => consultarMotor(boton.dataset.id));
    });

    document.querySelectorAll(".btnMotorEliminar").forEach(boton => {
        boton.addEventListener("click", () => eliminarMotor(boton.dataset.id));
    });
}

async function consultarMotor(id) {

    const respuesta = await fetch("/postgres/motores/" + id);
    const motor = await respuesta.json();

    document.getElementById("motorId").value = motor.id;
    document.getElementById("motorNombre").value = motor.nombre;
    document.getElementById("motorFabricante").value = motor.fabricante;
    document.getElementById("motorTipo").value = motor.tipo;
    document.getElementById("motorCilindrada").value = motor.cilindrada_cc;
    document.getElementById("motorPotencia").value = motor.potencia_hp;
    document.getElementById("motorTorque").value = motor.torque_nm;
    document.getElementById("motorCombustible").value = motor.combustible;
    document.getElementById("motorImagenVista").src = motor.imagen_motor
        ? "data:image/jpeg;base64," + motor.imagen_motor
        : "";
    mostrarMensaje("Motor consultado");
}

async function eliminarMotor(id) {

    if (!confirm("¿Desea eliminar este motor?")) {
        return;
    }

    const respuesta = await fetch("/postgres/motores/" + id, {
        method: "DELETE"
    });

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    listarMotores();
}

function limpiarMotor() {
    document.getElementById("motorId").value = "";
    document.getElementById("motorNombre").value = "";
    document.getElementById("motorFabricante").value = "";
    document.getElementById("motorTipo").value = "";
    document.getElementById("motorCilindrada").value = "";
    document.getElementById("motorPotencia").value = "";
    document.getElementById("motorTorque").value = "";
    document.getElementById("motorCombustible").value = "";
    document.getElementById("motorImagen").value = "";
    document.getElementById("motorImagenVista").src = "";
}

async function guardarCarro() {

    const id = document.getElementById("carroId").value;
    const imagen = await leerImagen(document.getElementById("carroImagen"));

    const carro = {
        nombre: document.getElementById("carroNombre").value,
        marca: document.getElementById("carroMarca").value,
        modelo: document.getElementById("carroModelo").value,
        categoria: document.getElementById("carroCategoria").value,
        peso_kg: document.getElementById("carroPeso").value,
        velocidad_maxima_kmh: document.getElementById("carroVelocidad").value,
        anio_fabricacion: document.getElementById("carroAnio").value,
        motor_id: document.getElementById("carroMotorId").value,
        imagen_carro: imagen
    };

    const respuesta = await fetch(
        id ? "/postgres/carros/" + id : "/postgres/carros",
        {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carro)
        }
    );

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    limpiarCarro();
    listarCarros();
}

async function listarCarros() {

    const respuesta = await fetch("/postgres/carros");
    const carros = await respuesta.json();
    const tabla = document.getElementById("tablaCarrosPostgres");

    tabla.innerHTML = "";

    carros.forEach(carro => {

        const fila = document.createElement("tr");
        const imagen = carro.imagen_carro
            ? "<img width='60' src='data:image/jpeg;base64," + carro.imagen_carro + "'>"
            : "";

        fila.innerHTML =
            "<td>" + carro.id + "</td>" +
            "<td>" + carro.nombre + "</td>" +
            "<td>" + carro.marca + "</td>" +
            "<td>" + carro.modelo + "</td>" +
            "<td>" + carro.motor_id + "</td>" +
            "<td>" + imagen + "</td>" +
            "<td><button data-id='" + carro.id + "' class='btnCarroEditar'>Editar</button>" +
            "<button data-id='" + carro.id + "' class='btnCarroEliminar'>Eliminar</button></td>";

        tabla.appendChild(fila);
    });

    document.querySelectorAll(".btnCarroEditar").forEach(boton => {
        boton.addEventListener("click", () => consultarCarro(boton.dataset.id));
    });

    document.querySelectorAll(".btnCarroEliminar").forEach(boton => {
        boton.addEventListener("click", () => eliminarCarro(boton.dataset.id));
    });
}

async function consultarCarro(id) {

    const respuesta = await fetch("/postgres/carros/" + id);
    const carro = await respuesta.json();

    document.getElementById("carroId").value = carro.id;
    document.getElementById("carroNombre").value = carro.nombre;
    document.getElementById("carroMarca").value = carro.marca;
    document.getElementById("carroModelo").value = carro.modelo;
    document.getElementById("carroCategoria").value = carro.categoria;
    document.getElementById("carroPeso").value = carro.peso_kg;
    document.getElementById("carroVelocidad").value = carro.velocidad_maxima_kmh;
    document.getElementById("carroAnio").value = carro.anio_fabricacion;
    document.getElementById("carroMotorId").value = carro.motor_id;
    document.getElementById("carroImagenVista").src = carro.imagen_carro
        ? "data:image/jpeg;base64," + carro.imagen_carro
        : "";
    mostrarMensaje("Carro consultado");
}

async function eliminarCarro(id) {

    if (!confirm("¿Desea eliminar este carro?")) {
        return;
    }

    const respuesta = await fetch("/postgres/carros/" + id, {
        method: "DELETE"
    });

    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    listarCarros();
}

function limpiarCarro() {
    document.getElementById("carroId").value = "";
    document.getElementById("carroNombre").value = "";
    document.getElementById("carroMarca").value = "";
    document.getElementById("carroModelo").value = "";
    document.getElementById("carroCategoria").value = "";
    document.getElementById("carroPeso").value = "";
    document.getElementById("carroVelocidad").value = "";
    document.getElementById("carroAnio").value = "";
    document.getElementById("carroMotorId").value = "";
    document.getElementById("carroImagen").value = "";
    document.getElementById("carroImagenVista").src = "";
}

async function mostrarEagerCarros() {

    const respuesta = await fetch("/postgres/carros-eager");
    const carros = await respuesta.json();
    const tabla = document.getElementById("tablaEagerCarros");

    tabla.innerHTML = "";

    carros.forEach(carro => {
        const fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + carro.nombre + "</td>" +
            "<td>" + carro.marca + "</td>" +
            "<td>" + carro.nombre_motor + "</td>" +
            "<td>" + carro.fabricante + "</td>" +
            "<td>" + carro.potencia_hp + "</td>";
        tabla.appendChild(fila);
    });
}
