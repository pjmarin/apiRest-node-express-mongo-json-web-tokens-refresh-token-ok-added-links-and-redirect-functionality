import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import redirectRouter from "./routes/redirect.route.js";

// (1) para servidor https
// import https from "https";
// import fs from "fs";

const app = express();

app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

// app.use(cors({ origin:true, credentials:true }));

app.use(
    cors({
        origin: function(origin, callback) {
          const whiteList = process.env.ORIGIN1.split(",");
          whiteList.map(string => string.trim());

          if (whiteList.includes(origin) !== -1) {
              return callback(null, origin); // el primer argumento es el error (si la IP de origen no esta dentro de nuestro array)
          }
          return callback("No autorizado por CORS"); // el primer argumento es el error (si la IP de origen no esta dentro de nuestro array)
        },
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '3mb'}))

app.use(function(req, res, next) {
  if(req.originalUrl.includes("api") || req.originalUrl.includes("html")) {
    console.log(`pasamos por aqui - todas las peticiones - ${req.originalUrl} - ${new Date(Date.now()).toISOString()}`);
  }
  
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRouter);

// Ejemplo back redirect (opcional)
// al introducir http://locaclhost:5000/:nanolink desde el navegador, nos redirecciona al link verdadero
app.use("/", redirectRouter);

app.use(express.static("public"));

app.use(function(err, req, res, next) {
  console.error("err.stack", err.stack);
  return res.send(500, { message: err.message });
});

// (1) para servidor https
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("😍😍😲 http://localhost:" + PORT));

// (1) para servidor https
// https.createServer(options, app).listen(PORT, console.log(`server runs on port ${PORT}`));