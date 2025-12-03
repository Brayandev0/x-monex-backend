import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Helmet from "helmet";
import UsuarioRouter from "./Routes/Usuario.js";
import cookieParser from "cookie-parser";
import { db } from "./Models/database.js";
import Pagamentos from "./Models/Pagamentos.js";
import { Planos } from "./Models/Planos.js";
import Emprestimos from "./Models/Emprestimos.js";
import { Cartoes } from "./Models/Cartoes.js";
import { Usuarios } from "./Models/Usuarios.js";
import { Assinaturas } from "./Models/Assinaturas.js";
import { Clientes } from "./Models/Clientes.js";
import { Indicacoes } from "./Models/Indicacoes.js";
import Parcelas from "./Models/Parcelas.js";
import "./Models/Relations.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
  origin:["http://127.0.0.1:3000"],
  credentials:true
}));
app.use(Helmet());
chamarRotas(app);
app.use((req,res,error) => {
  console.error(error);
  return res.status(500).json({ msg: "Rota " + req.originalUrl + " não encontrada", code: 404 });
})


db.sync()
function chamarRotas(app) {
  app.use("/usuarios", UsuarioRouter);
}
export default app;
