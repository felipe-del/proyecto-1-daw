const fs = require("fs");
const path = require("path");

const ARCHIVO = path.join(
    __dirname,
    "..",
    "data",
    "acciones.txt"
);

function registrar(accion, usuario) {

    if (!fs.existsSync(ARCHIVO)) {
        fs.writeFileSync(ARCHIVO, "");
    }

    const contenido = fs.readFileSync(
        ARCHIVO,
        "utf8"
    );

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-ES");
    const hora = ahora.toLocaleTimeString("es-ES", {
        hour12: false
    });

    const linea = `${fecha} - ${hora} / ${accion} / ${usuario || "SIN_AUTENTICAR"}`;

    fs.writeFileSync(
        ARCHIVO,
        contenido + (contenido && !contenido.endsWith("\n") ? "\n" : "") + linea + "\n",
        "utf8"
    );
}

module.exports = {
    registrar
};
