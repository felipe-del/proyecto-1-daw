document.addEventListener("DOMContentLoaded", iniciar);

const camposMotor = [
    "codigoMotor", "nombreMotor", "fabricanteMotor", "familiaMotor", "arquitecturaMotor", "configuracionCilindros", "cantidadCilindros", "cilindradaCc", "diametroMm", "carreraMm", "relacionCompresion", "tipoAspiracion", "potenciaHp", "torqueNm", "rpmPotenciaMaxima", "rpmTorqueMaximo", "rpmLimite", "tipoCombustible", "sistemaInyeccion", "sistemaRefrigeracion", "sistemaLubricacion", "materialBloque", "materialCulata", "vidaUtilCompetenciaKm"
];

function iniciar() {
    document.getElementById("btnMotorMongoGuardar").addEventListener("click", guardar);
    document.getElementById("btnMotorMongoModificar").addEventListener("click", modificar);
    document.getElementById("btnMotorMongoEliminar").addEventListener("click", eliminar);
    document.getElementById("btnMotorMongoConsultar").addEventListener("click", consultar);
    document.getElementById("btnMotorMongoLimpiar").addEventListener("click", limpiar);
    document.getElementById("btnMotorMongoListar").addEventListener("click", listar);
    listar();
}

function leerImagen() {
    return new Promise(resolve => {
        const archivo = document.getElementById("imagenMotor").files[0];
        if (!archivo) { resolve(null); return; }
        const lector = new FileReader(); lector.onload = () => resolve(lector.result); lector.readAsDataURL(archivo);
    });
}

function datosFormulario(imagen) {
    const motor = {};
    camposMotor.forEach(campo => motor[campo] = document.getElementById(campo).value);
    motor.imagenMotor = imagen;
    return motor;
}

function mostrarMensaje(texto) { document.getElementById("mensajeMotorMongo").textContent = texto; }
function obtenerId() { return document.getElementById("motorMongoId").value; }

async function guardar() { const respuesta = await fetch("/mongo/motores", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datosFormulario(await leerImagen())) }); const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); listar(); }
async function modificar() { const respuesta = await fetch("/mongo/motores/" + obtenerId(), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datosFormulario(await leerImagen())) }); const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); listar(); }
async function eliminar() { const respuesta = await fetch("/mongo/motores/" + obtenerId(), { method: "DELETE" }); const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); limpiar(); listar(); }

async function consultar() {
    const respuesta = await fetch("/mongo/motores/" + obtenerId()); const datos = await respuesta.json();
    if (!respuesta.ok) { mostrarMensaje(datos.mensaje); return; }
    llenarFormulario(datos.motor); mostrarMensaje(datos.mensaje);
}

async function listar() {
    const respuesta = await fetch("/mongo/motores"); const datos = await respuesta.json(); const tabla = document.getElementById("tablaMotoresMongo"); tabla.innerHTML = "";
    datos.motores.forEach(motor => {
        const fila = document.createElement("tr"); const imagen = motor.imagenMotor ? "<img width='60' src='data:image/jpeg;base64," + motor.imagenMotor + "'>" : "";
        fila.innerHTML = "<td>" + motor._id + "</td><td>" + motor.codigoMotor + "</td><td>" + motor.nombreMotor + "</td><td>" + motor.fabricanteMotor + "</td><td>" + motor.potenciaHp + "</td><td>" + imagen + "</td><td><button data-codigo='" + motor.codigoMotor + "' class='btnVerCarrosAsociados'>Ver carros asociados</button></td>"; tabla.appendChild(fila);
    });
    document.querySelectorAll(".btnVerCarrosAsociados").forEach(boton => boton.addEventListener("click", () => verCarrosAsociados(boton.dataset.codigo)));
}

async function verCarrosAsociados(codigoMotor) {
    // CARGA LAZY: los carros se consultan únicamente al pulsar el botón.
    const respuesta = await fetch("/mongo/motores/" + codigoMotor + "/carros");
    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    const lista = document.getElementById("carrosAsociadosMotor");
    lista.innerHTML = "";
    datos.carros.forEach(carro => {
        const elemento = document.createElement("div");
        elemento.innerHTML = carro.codigoCarro + " - " + carro.nombreCarro;
        lista.appendChild(elemento);
    });
}

function llenarFormulario(motor) {
    document.getElementById("motorMongoId").value = motor._id;
    camposMotor.forEach(campo => document.getElementById(campo).value = motor[campo]);
    document.getElementById("imagenMotorVista").src = motor.imagenMotor ? "data:image/jpeg;base64," + motor.imagenMotor : "";
}

function limpiar() { document.querySelectorAll("input").forEach(input => input.value = ""); document.getElementById("imagenMotorVista").src = ""; }
