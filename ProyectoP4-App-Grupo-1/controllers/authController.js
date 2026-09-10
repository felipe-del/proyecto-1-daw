const path = require("path");

const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");


/*=========================================
  Mostrar pantalla de login
=========================================*/

function mostrarLogin(req, res) {

    res.sendFile(
        path.join(__dirname, "..", "views", "login.html")
    );

}

function mostrarMenu(req, res) {

    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.redirect("/");
    }

    res.sendFile(
        path.join(__dirname, "..", "views", "menu.html")
    );
}

/*=========================================
  Procesar login
=========================================*/

function iniciarSesion(req,res){

    try{

        const usuario =
        req.body.usuario;

        const password =
        req.body.password;

        AuthService.autenticar(
            usuario,
            password
        );

        LogDAO.registrar("Login correcto", usuario);

        res.json({

            ok:true

        });

    }
    catch(error){

        LogDAO.registrar("Login incorrecto", req.body.usuario);

        res.status(401).json({

            ok:false,

            mensaje:error.message

        });

    }

}

/*=========================================
  Cerrar sesión
=========================================*/

function cerrarSesion(req, res) {

    LogDAO.registrar("Logout", AuthService.obtenerUsuarioActual());
    AuthService.cerrarSesion();

    res.redirect("/");

}

/*=========================================
  Exportar funciones
=========================================*/

module.exports = {

    mostrarLogin,
    mostrarMenu,

    iniciarSesion,

    cerrarSesion

};
