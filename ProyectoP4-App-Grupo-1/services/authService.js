const UsuarioDAO = require("../dao/usuarioDAO");

let usuarioActual = null;


/*=========================================
  Autenticar usuario
=========================================*/
function autenticar(usuario,password){

    const encontrado =
    UsuarioDAO.validarCredenciales(
        usuario,
        password
    );

    if(!encontrado){

        throw new Error(
            "Usuario o contraseña incorrectos."
        );

    }

    usuarioActual = usuario;

    return encontrado;

}

function obtenerUsuarioActual() {
    return usuarioActual;
}

function estaAutenticado() {
    return usuarioActual !== null;
}

function cerrarSesion() {
    usuarioActual = null;
}


/*=========================================
  Exportar funciones
=========================================*/

module.exports = {

    autenticar
    ,obtenerUsuarioActual
    ,estaAutenticado
    ,cerrarSesion

};
