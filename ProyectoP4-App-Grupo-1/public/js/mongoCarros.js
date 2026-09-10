document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
    document.getElementById("btnCarroMongoGuardar").addEventListener("click", guardar);
    document.getElementById("btnCarroMongoModificar").addEventListener("click", modificar);
    document.getElementById("btnCarroMongoEliminar").addEventListener("click", eliminar);
    document.getElementById("btnCarroMongoConsultar").addEventListener("click", consultar);
    document.getElementById("btnCarroMongoLimpiar").addEventListener("click", limpiar);
    document.getElementById("btnCarroMongoListar").addEventListener("click", listar);
    listar();
}

function leerImagen() {
    return new Promise(resolve => {
        const archivo = document.getElementById("imagenCarro").files[0];
        if (!archivo) { resolve(null); return; }
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.readAsDataURL(archivo);
    });
}

function datosFormulario(imagen) {
    return {
        codigoCarro: document.getElementById("codigoCarro").value,
        nombreCarro: document.getElementById("nombreCarro").value,
        escuderia: document.getElementById("escuderia").value,
        fabricante: document.getElementById("fabricante").value,
        modelo: document.getElementById("modelo").value,
        categoria: document.getElementById("categoria").value,
        anio: document.getElementById("anio").value,
        paisOrigen: document.getElementById("paisOrigen").value,
        pesoKg: document.getElementById("pesoKg").value,
        velocidadMaximaKmh: document.getElementById("velocidadMaximaKmh").value,
        aceleracion0a100: document.getElementById("aceleracion0a100").value,
        tipoTraccion: document.getElementById("tipoTraccion").value,
        numeroMarchas: document.getElementById("numeroMarchas").value,
        codigoMotorAsignado: document.getElementById("codigoMotorAsignado").value,
        imagenCarro: imagen
    };
}

function mostrarMensaje(texto) { document.getElementById("mensajeCarroMongo").textContent = texto; }
function obtenerId() { return document.getElementById("carroMongoId").value; }

async function guardar() {
    const respuesta = await fetch("/mongo/carros", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datosFormulario(await leerImagen())) });
    const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); listar();
}

async function modificar() {
    const respuesta = await fetch("/mongo/carros/" + obtenerId(), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datosFormulario(await leerImagen())) });
    const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); listar();
}

async function eliminar() {
    const respuesta = await fetch("/mongo/carros/" + obtenerId(), { method: "DELETE" });
    const datos = await respuesta.json(); mostrarMensaje(datos.mensaje); limpiar(); listar();
}

async function consultar() {
    const respuesta = await fetch("/mongo/carros/" + obtenerId());
    const datos = await respuesta.json();
    if (!respuesta.ok) { mostrarMensaje(datos.mensaje); return; }
    llenarFormulario(datos.carro); mostrarMensaje(datos.mensaje);
}

async function listar() {
    const respuesta = await fetch("/mongo/carros");
    const datos = await respuesta.json();
    const tabla = document.getElementById("tablaCarrosMongo"); tabla.innerHTML = "";
    datos.carros.forEach(carro => {
        const fila = document.createElement("tr");
        const imagen = carro.imagenCarro ? "<img width='60' src='data:image/jpeg;base64," + carro.imagenCarro + "'>" : "";
        fila.innerHTML = "<td>" + carro._id + "</td><td>" + carro.codigoCarro + "</td><td>" + carro.nombreCarro + "</td><td>" + carro.fabricante + "</td><td>" + carro.codigoMotorAsignado + "</td><td>" + imagen + "</td><td><button data-id='" + carro._id + "' data-motor='" + carro.codigoMotorAsignado + "' class='btnVerMotor'>Ver motor</button></td>";
        tabla.appendChild(fila);
    });
    document.querySelectorAll(".btnVerMotor").forEach(boton => boton.addEventListener("click", () => verMotor(boton.dataset.id, boton.dataset.motor)));
}

async function verMotor(id, codigoMotor) {
    // CARGA LAZY: el motor se consulta únicamente cuando el usuario lo solicita.
    const respuesta = await fetch("/mongo/carros/" + id + "/motor/" + codigoMotor);
    const datos = await respuesta.json();
    mostrarMensaje(datos.mensaje);
    if (respuesta.ok) { document.getElementById("motorLazy").textContent = JSON.stringify(datos.motor); }
}

function llenarFormulario(carro) {
    document.getElementById("carroMongoId").value = carro._id;
    Object.keys(carro).forEach(campo => { const elemento = document.getElementById(campo); if (elemento) elemento.value = carro[campo]; });
    document.getElementById("imagenCarroVista").src = carro.imagenCarro ? "data:image/jpeg;base64," + carro.imagenCarro : "";
}

function limpiar() {
    document.querySelectorAll("input").forEach(input => input.value = "");
    document.getElementById("imagenCarroVista").src = "";
    document.getElementById("motorLazy").textContent = "";
}
