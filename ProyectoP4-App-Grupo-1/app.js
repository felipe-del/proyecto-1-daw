const express = require("express");

const path = require("path");

const app = express();


/*
=================================
Middleware
=================================
*/


app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));


/*
=================================
Archivos públicos
=================================
*/

app.use(express.static(
    path.join(__dirname,"public")
));


/*
=================================
Rutas
=================================
*/

const authRoutes =
require("./routes/authRoutes");

const carroRoutes =
require("./routes/carroRoutes");

const motorRoutes =
require("./routes/motorRoutes");

const carroMotorRoutes =
require("./routes/carroMotorRoutes");

const configuracionRoutes =
require("./routes/configuracionRoutes");

const mongoRoutes =
require("./routes/mongoRoutes");


app.use("/",authRoutes);

app.use("/",carroRoutes);

app.use("/",motorRoutes);

app.use("/",carroMotorRoutes);

app.use("/",configuracionRoutes);

app.use("/",mongoRoutes);


/*
=================================
Servidor
=================================
*/

app.listen(3000,()=>{

    console.log(
        "Servidor iniciado en puerto 3000"
    );

});
