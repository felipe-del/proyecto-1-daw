const fs = require("fs");
const path = require("path");


/*
==========================================
Ubicación del archivo usuarios.txt
==========================================
*/

const archivo = path.join(
    __dirname,
    "..",
    "data",
    "usuarios.txt"
);


/*
==========================================
Validar credenciales
==========================================
*/

function validarCredenciales(usuario, password) {

    const contenido = fs.readFileSync(
        archivo,
        "utf8"
    );

    const lineas = contenido.split("\n");

    for (let linea of lineas) {

        linea = linea.trim();

        if (linea === "") {

            continue;

        }

        const datos = linea.split(";");

        const usuarioArchivo =
            datos[0];

        const passwordArchivo =
            datos[1];

        if (
            usuarioArchivo === usuario &&
            passwordArchivo === password
        ) {

            return {
                usuario: usuarioArchivo
            };

        }

    }

    return null;

}


module.exports = {

    validarCredenciales

};
