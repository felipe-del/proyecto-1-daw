# ProyectoP4-App-Grupo-1

Guia para ejecutar y probar localmente la aplicacion Express de carros y motores.

Esta guia no requiere modificar codigo, configuraciones ni archivos de datos. Los comandos que eliminan datos estan marcados como opcionales.

## 1. Requisitos previos

Comprobar desde PowerShell:

```powershell
node --version
npm --version
psql --version
mongosh --version
Get-Command mongod.exe
Test-Path "C:\Program Files\PostgreSQL\18\bin\psql.exe"
```

Se necesitan:

- Node.js y npm.
- PostgreSQL y `psql`.
- MongoDB Server y `mongosh`.
- PowerShell.

## 2. Configuracion real

La aplicacion utiliza:

| Servicio | Configuracion |
|---|---|
| Aplicacion | `http://localhost:3000` |
| PostgreSQL | `localhost:5432` |
| Base PostgreSQL | `BDPostgreSQL` |
| Usuario PostgreSQL | `postgres` |
| Password PostgreSQL | `root` |
| MongoDB | `mongodb://localhost:27017` |
| Base MongoDB | `ProyectoP4` |
| Coleccion MongoDB | `CollMongoDB` |

El archivo `.env` contiene:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=ProyectoP4
PORT=3000
```

**NO MODIFICAR `.env`.**

La aplicacion instala estas dependencias directas desde `package.json`:

- `express`
- `pg`
- `mongodb`
- `dotenv`

## 3. Carpetas

Raiz del workspace:

```powershell
C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW
```

Proyecto Node:

```text
ProyectoP4-App-Grupo-1
```

Scripts PostgreSQL:

```text
ProyectoP4-PostgreSQL-Grupo-1/ScriptCrearBaseDatos.sql
ProyectoP4-PostgreSQL-Grupo-1/ScriptPopularBaseDatos.sql
```

Scripts MongoDB:

```text
ProyectoP4-MongoDB-Grupo-1/Script-120-MONGO.JSON
ProyectoP4-MongoDB-Grupo-1/Script-60-MONGO.JSON
```

Ejecuta `npm install` y `npm start` dentro de `ProyectoP4-App-Grupo-1`, no desde la raiz.

## 4. PostgreSQL

### 4.1 Comprobar el servicio

```powershell
Get-Service | Where-Object { $_.Name -like "*postgres*" }
```

Si esta detenido, inicia el servicio cuyo nombre aparezca. Habitualmente:

```powershell
Start-Service -Name "postgresql-x64-18"
```

Probar la conexion:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d postgres
```

Password:

```text
root
```

Salir de `psql`:

```sql
\q
```

### 4.2 Reconstruccion limpia opcional

**OPCIONAL - SOLO PARA RECONSTRUIR DESDE CERO.**

Este bloque elimina `BDPostgreSQL`. No lo ejecutes si deseas conservar la base actual.

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d postgres -c 'DROP DATABASE IF EXISTS "BDPostgreSQL" WITH (FORCE);'
```

Password: `root`.

Crear la base y sus tablas:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -f ".\ProyectoP4-PostgreSQL-Grupo-1\ScriptCrearBaseDatos.sql"
```

Cargar los datos:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d BDPostgreSQL -f ".\ProyectoP4-PostgreSQL-Grupo-1\ScriptPopularBaseDatos.sql"
```

### 4.3 Verificar conteos

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d BDPostgreSQL -c "SELECT 'motores_carrera' AS tabla, COUNT(*) FROM motores_carrera UNION ALL SELECT 'carros_carrera', COUNT(*) FROM carros_carrera UNION ALL SELECT 'especificaciones_motor', COUNT(*) FROM especificaciones_motor UNION ALL SELECT 'configuraciones_carro', COUNT(*) FROM configuraciones_carro;"
```

Resultado esperado:

```text
motores_carrera          10
carros_carrera           10
especificaciones_motor   10
configuraciones_carro    10
```

Comprobar las relaciones:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d BDPostgreSQL -c "SELECT c.id AS carro_id, c.nombre AS carro, m.id AS motor_id, m.nombre AS motor FROM carros_carrera c INNER JOIN motores_carrera m ON c.motor_id = m.id;"
```

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d BDPostgreSQL -c "SELECT c.id AS configuracion_id, c.nombre AS configuracion, e.id AS especificacion_id, e.codigo_especificacion FROM configuraciones_carro c INNER JOIN especificaciones_motor e ON c.especificacion_motor_id = e.id;"
```

## 5. MongoDB

### 5.1 Iniciar MongoDB

Desde la raiz del workspace, abre una terminal independiente y dejala abierta:

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW"
mongod.exe --dbpath .\mongo-data --port 27017 --bind_ip 127.0.0.1
```

### 5.2 Reconstruccion opcional desde los JSON

**OPCIONAL - SOLO PARA RECONSTRUIR `CollMongoDB` DESDE CERO.**

Este comando elimina unicamente la coleccion `ProyectoP4.CollMongoDB` y carga primero los 120 motores y despues los 60 carros.

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW"

$script=@'
const fs = require("fs");
const database = db.getSiblingDB("ProyectoP4");
database.CollMongoDB.drop();

const motores = EJSON.parse(
    fs.readFileSync("ProyectoP4-MongoDB-Grupo-1/Script-120-MONGO.JSON", "utf8")
);

const carros = EJSON.parse(
    fs.readFileSync("ProyectoP4-MongoDB-Grupo-1/Script-60-MONGO.JSON", "utf8")
);

database.CollMongoDB.insertMany(motores);
database.CollMongoDB.insertMany(carros);

printjson({
    motores: database.CollMongoDB.countDocuments({ codigoMotor: { $exists: true } }),
    carros: database.CollMongoDB.countDocuments({ codigoCarro: { $exists: true } }),
    total: database.CollMongoDB.countDocuments()
});
'@

$script | & (Get-Command mongosh).Source --quiet --host 127.0.0.1
```

Resultado esperado:

```text
motores: 120
carros: 60
total: 180
```

Verificacion manual:

```powershell
mongosh --quiet --host 127.0.0.1
```

```javascript
use ProyectoP4

db.CollMongoDB.countDocuments({codigoMotor: {$exists: true}})
db.CollMongoDB.countDocuments({codigoCarro: {$exists: true}})
db.CollMongoDB.countDocuments()
```

Resultados esperados: `120`, `60` y `180`.

Para comprobar referencias invalidas:

```javascript
const motores = db.CollMongoDB.distinct("codigoMotor")
db.CollMongoDB.countDocuments({
  codigoCarro: {$exists: true},
  $expr: {$not: {$in: ["$codigoMotorAsignado", motores]}}
})
```

Resultado esperado: `0`.

Salir:

```javascript
exit
```

## 6. Instalar y ejecutar Node.js

Abre otra terminal:

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW\ProyectoP4-App-Grupo-1"
npm install
```

Validar sintaxis opcionalmente:

```powershell
Get-ChildItem -Path . -Filter *.js -File -Recurse | ForEach-Object {
    node --check $_.FullName
}
```

Arrancar la aplicacion:

```powershell
npm start
```

Mensaje esperado:

```text
Servidor iniciado en puerto 3000
```

El mensaje `MongoDB conectado` aparece cuando se usa por primera vez una operacion MongoDB. Deja abierta esta terminal.

Aplicacion:

```text
http://localhost:3000
```

## 7. Login y menu

Credenciales existentes en `data/usuarios.txt`:

| Usuario | Password |
|---|---|
| `admin` | `12345` |
| `profesor` | `abc123` |
| `secretaria` | `clave456` |

Usar preferentemente:

```text
Usuario: admin
Password: 12345
```

Primero prueba una password incorrecta y comprueba el error. Despues inicia sesion correctamente.

El menu contiene:

| Funcion | URL |
|---|---|
| Inicio | `/menu` |
| Carros TXT | `/carros/pagina` |
| Motores TXT | `/motores/pagina` |
| Carros y motores PostgreSQL | `/carro-motor/pagina` |
| Configuraciones PostgreSQL | `/configuracion/pagina` |
| Carros MongoDB | `/mongo/carros/pagina` |
| Motores MongoDB | `/mongo/motores/pagina` |
| Cerrar sesion | `/logout` |

## 8. CRUD TXT

### Carros

URL:

```text
http://localhost:3000/carros/pagina
```

Campos: `codigo`, `nombre`, `marca`, `categoria`, `velocidadMaxima`.

Datos temporales:

```text
codigo: CAR900
nombre: Prueba Guia
marca: Marca Temporal
categoria: Competicion
velocidadMaxima: 250
```

Probar `Guardar`, `Consultar`, `Modificar`, `Eliminar` y `Limpiar`.

### Motores

URL:

```text
http://localhost:3000/motores/pagina
```

Campos: `codigo`, `nombre`, `tipo`, `cilindrada`, `potencia`.

Datos temporales:

```text
codigo: MOT900
nombre: Motor Guia
tipo: Combustion
cilindrada: 2000
potencia: 400
```

Probar `Guardar`, `Consultar`, `Modificar`, `Eliminar` y `Limpiar`.

Al terminar, `CAR900` y `MOT900` deben haber sido eliminados de `data/carros.txt` y `data/motores.txt`.

## 9. PostgreSQL: carros y motores

URL:

```text
http://localhost:3000/carro-motor/pagina
```

### Motor

Campos:

```text
motorId
motorNombre
motorFabricante
motorTipo
motorCilindrada
motorPotencia
motorTorque
motorCombustible
motorImagen
```

Crear, consultar, modificar y eliminar un motor temporal. Para eliminarlo, primero deben eliminarse los carros que lo referencien.

### Carro

Campos:

```text
carroId
carroNombre
carroMarca
carroModelo
carroCategoria
carroPeso
carroVelocidad
carroAnio
carroMotorId
carroImagen
```

Crear un carro usando un `carroMotorId` existente, por ejemplo `1`. Consultarlo, modificarlo, probar una imagen JPG y eliminarlo.

### Eager carros y motores

Pulsar `Consultar carros y motores`.

Endpoint:

```text
GET /postgres/carros-eager
```

Cada resultado debe mostrar los datos del carro y del motor relacionado en una sola carga.

## 10. PostgreSQL: especificaciones y configuraciones

URL:

```text
http://localhost:3000/configuracion/pagina
```

### Especificacion

Campos:

```text
codigo_especificacion
arquitectura
numero_cilindros
aspiracion
rpm_maxima
sistema_refrigeracion
relacion_compresion
imagen_especificacion
```

Probar crear, consultar, modificar, imagen y eliminar.

### Configuracion

Campos:

```text
nombre_configuracion
tipo_traccion
transmision
numero_marchas
tipo_neumatico
carga_aerodinamica
altura_mm
especificacion_motor_id
imagen_configuracion
```

Usar una especificacion existente, por ejemplo `1`. Probar el CRUD completo y eliminar primero la configuracion antes de eliminar su especificacion relacionada.

### Eager configuraciones y especificaciones

Pulsar `Consultar configuraciones y especificaciones`.

Endpoint:

```text
GET /postgres/configuraciones-eager
```

Cada resultado debe mostrar la configuracion junto con su especificacion relacionada.

## 11. MongoDB: carros

URL:

```text
http://localhost:3000/mongo/carros/pagina
```

Campos:

```text
codigoCarro
nombreCarro
escuderia
fabricante
modelo
categoria
anio
paisOrigen
pesoKg
velocidadMaximaKmh
aceleracion0a100
tipoTraccion
numeroMarchas
codigoMotorAsignado
imagenCarro
```

Probar `Mostrar todos`, `Consultar`, `Guardar`, `Modificar`, `Eliminar` y `Limpiar`.

Para probar la carga lazy, consultar un carro como `CAR001` y pulsar `Ver motor`. Ese boton realiza:

```text
Carro -> motor
```

El motor mostrado debe corresponder a `codigoMotorAsignado`.

## 12. MongoDB: motores

URL:

```text
http://localhost:3000/mongo/motores/pagina
```

Campos:

```text
codigoMotor
nombreMotor
fabricanteMotor
familiaMotor
arquitecturaMotor
configuracionCilindros
cantidadCilindros
cilindradaCc
diametroMm
carreraMm
relacionCompresion
tipoAspiracion
potenciaHp
torqueNm
rpmPotenciaMaxima
rpmTorqueMaximo
rpmLimite
tipoCombustible
sistemaInyeccion
sistemaRefrigeracion
sistemaLubricacion
materialBloque
materialCulata
vidaUtilCompetenciaKm
imagenMotor
```

Probar `Mostrar todos`, `Consultar`, `Guardar`, `Modificar`, `Eliminar` y `Limpiar`.

Para la carga lazy:

- En `MOT001`, pulsar `Ver carros asociados`: debe aparecer al menos un carro.
- En `MOT061`, pulsar `Ver carros asociados`: debe aparecer una lista vacia.

Esto prueba:

```text
Motor -> carros
```

## 13. Datos temporales MongoDB

Si se necesita probar CRUD y relaciones sin modificar los datos iniciales, usar primero este motor:

```text
codigoMotor: MOT901
nombreMotor: Motor Guia
fabricanteMotor: Fabricante Prueba
familiaMotor: V
arquitecturaMotor: V6
configuracionCilindros: 6 cilindros
cantidadCilindros: 6
cilindradaCc: 2000
diametroMm: 85
carreraMm: 70
relacionCompresion: 10
tipoAspiracion: Turbo
potenciaHp: 500
torqueNm: 600
rpmPotenciaMaxima: 8000
rpmTorqueMaximo: 6000
rpmLimite: 10000
tipoCombustible: Gasolina
sistemaInyeccion: Directa
sistemaRefrigeracion: Liquida
sistemaLubricacion: Presion
materialBloque: Aluminio
materialCulata: Aluminio
vidaUtilCompetenciaKm: 5000
```

Despues crear este carro:

```text
codigoCarro: CAR901
nombreCarro: Carro Guia
escuderia: Escuderia Prueba
fabricante: Fabricante Prueba
modelo: Modelo Prueba
categoria: Competicion
anio: 2026
paisOrigen: España
pesoKg: 700
velocidadMaximaKmh: 300
aceleracion0a100: 2.5
tipoTraccion: Trasera
numeroMarchas: 7
codigoMotorAsignado: MOT901
```

Probar `Ver motor` desde el carro y despues eliminar primero `CAR901` y finalmente `MOT901`.

## 14. Imagenes

Los formularios aceptan imagenes JPEG/JPG mediante `image/jpeg`.

Probar en cada tipo de entidad:

1. Seleccionar un JPG pequeño.
2. Confirmar la vista previa.
3. Guardar el registro.
4. Consultarlo.
5. Confirmar que la imagen se recupera.
6. Modificarla con otro JPG.
7. Confirmar la actualizacion.

PostgreSQL almacena las imagenes como `BYTEA`. MongoDB las almacena como BSON `Binary`.

## 15. Log

El log esta en:

```text
data/acciones.txt
```

Desde el proyecto:

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW\ProyectoP4-App-Grupo-1"
Get-Content .\data\acciones.txt
```

Para observarlo en directo:

```powershell
Get-Content .\data\acciones.txt -Wait
```

El formato esperado es:

```text
fecha - hora / accion / usuario
```

Deben registrarse acciones como:

- Login incorrecto.
- Login correcto.
- Guardar carro TXT.
- Carga Eager.
- Carga Lazy motor.
- Carga Lazy carros asociados al motor.
- Logout.
- Intentos sin autenticacion como `SIN_AUTENTICAR`.

## 16. Logout

1. Pulsar `Cerrar sesion`.
2. Comprobar que vuelve al login.
3. Abrir manualmente `http://localhost:3000/menu`.
4. Debe redirigir a `/`.
5. Probar tambien `http://localhost:3000/carros/pagina`.
6. Debe impedir el acceso hasta volver a iniciar sesion.

## 17. Endpoints opcionales

Con la aplicacion arrancada:

Login incorrecto:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:3000/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"usuario":"admin","password":"incorrecta"}' `
  -SkipHttpErrorCheck
```

Login correcto:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:3000/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"usuario":"admin","password":"12345"}'
```

TXT:

```powershell
Invoke-WebRequest http://localhost:3000/carros
Invoke-WebRequest http://localhost:3000/motores
```

PostgreSQL Eager:

```powershell
Invoke-WebRequest http://localhost:3000/postgres/carros-eager
Invoke-WebRequest http://localhost:3000/postgres/configuraciones-eager
```

MongoDB:

```powershell
Invoke-WebRequest http://localhost:3000/mongo/carros
Invoke-WebRequest http://localhost:3000/mongo/motores
```

Lazy motor de un carro, sustituyendo `<ID_CARRO>` por un `_id` real:

```powershell
Invoke-WebRequest "http://localhost:3000/mongo/carros/<ID_CARRO>/motor/MOT001"
```

Lazy carros de un motor:

```powershell
Invoke-WebRequest http://localhost:3000/mongo/motores/MOT001/carros
Invoke-WebRequest http://localhost:3000/mongo/motores/MOT061/carros
```

## 18. Detener los servicios

En la terminal de Node:

```text
Ctrl + C
```

En la terminal de MongoDB:

```text
Ctrl + C
```

PostgreSQL puede permanecer activo como servicio de Windows. No elimines las bases al finalizar salvo que quieras reconstruirlas.

## 19. Solucion de problemas

| Problema | Causa probable | Que revisar |
|---|---|---|
| `npm start` falla | Carpeta incorrecta | Entrar en `ProyectoP4-App-Grupo-1` |
| `Cannot find module` | Dependencias no instaladas | Ejecutar `npm install` |
| `ECONNREFUSED` PostgreSQL | Servicio detenido | Revisar PostgreSQL en `localhost:5432` |
| Error de password PostgreSQL | Credenciales diferentes | El codigo usa `postgres` y `root` |
| MongoDB no conecta | `mongod.exe` detenido | Revisar la terminal de MongoDB y el puerto `27017` |
| Puerto `3000` ocupado | Otro proceso utiliza el puerto | Detener el proceso anterior |
| Login falla | Credenciales incorrectas | Usar `admin` / `12345` |
| Eager vacio | Tablas sin datos o relaciones inexistentes | Ejecutar los scripts SQL y revisar las FK |
| Lazy vacio para `MOT001` | Datos Mongo incompletos | Revisar `CollMongoDB` y `codigoMotorAsignado` |
| Lazy vacio para `MOT061` | Resultado esperado | Ese motor no tiene carros asociados |
| Imagen no aparece | Archivo no JPEG o no guardado | Usar un JPG pequeño y revisar la vista previa |
| Redireccion al login | No hay autenticacion activa | Volver a iniciar sesion |

## 20. Orden rapido para arrancar todo

### Terminal 1: MongoDB

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW"
mongod.exe --dbpath .\mongo-data --port 27017 --bind_ip 127.0.0.1
```

### Terminal 2: Node.js

```powershell
Set-Location "C:\Users\isaac\OneDrive\Documents\PROYECTO-1-DAW\ProyectoP4-App-Grupo-1"
npm install
npm start
```

### Navegador

```text
http://localhost:3000
```

Login recomendado:

```text
admin
12345
```

PostgreSQL debe estar iniciado y `BDPostgreSQL` debe contener sus cuatro tablas pobladas.

## 21. Checklist final

- [ ] PostgreSQL activo en `localhost:5432`.
- [ ] `BDPostgreSQL` creada.
- [ ] 10 registros en cada tabla PostgreSQL.
- [ ] MongoDB activo en `localhost:27017`.
- [ ] `CollMongoDB` con 120 motores y 60 carros.
- [ ] Dependencias instaladas dentro de `ProyectoP4-App-Grupo-1`.
- [ ] Aplicacion ejecutandose en `http://localhost:3000`.
- [ ] Login incorrecto probado.
- [ ] Login correcto probado.
- [ ] Menu revisado.
- [ ] CRUD TXT probado y temporales eliminados.
- [ ] CRUD PostgreSQL probado.
- [ ] Eager de carros y motores probado.
- [ ] Eager de configuraciones y especificaciones probado.
- [ ] CRUD MongoDB probado.
- [ ] Lazy carro hacia motor probado.
- [ ] Lazy motor hacia carros probado con `MOT001`.
- [ ] Lazy vacio probado con `MOT061`.
- [ ] Imagen JPG guardada y recuperada.
- [ ] `data/acciones.txt` revisado.
- [ ] Logout probado.
- [ ] Vistas internas bloqueadas despues del logout.
