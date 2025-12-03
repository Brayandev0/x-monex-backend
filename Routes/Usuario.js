import express from "express";
import {
  cadastrarEmpestimosMiddleware,
  LoginMiddleware,
  retornarClientesMiddleware,
  verEmprestimosMiddleware,
} from "../Middlewares/Usuario.js";
import {
  cadastrarClienteController,
  cadastrarEmpestimosController,
  LoginUsuarioController,
  retornarClientesController,
  retornarEmprestimosController,
  verEmprestimosController,
} from "../Controllers/Usuario.js";
import { AuthMiddleware } from "../Middlewares/Auth.js";

const UsuarioRouter = express.Router();

UsuarioRouter.use(AuthMiddleware);

UsuarioRouter.get("/clientes",retornarClientesMiddleware,retornarClientesController);
UsuarioRouter.get("/emprestimos",retornarEmprestimosController);
UsuarioRouter.get("/emprestimos/:uuid",verEmprestimosMiddleware,verEmprestimosController);


UsuarioRouter.post("/login", LoginMiddleware, LoginUsuarioController);
UsuarioRouter.post("/clientes", cadastrarClienteController);
UsuarioRouter.post("/emprestimos",cadastrarEmpestimosMiddleware, cadastrarEmpestimosController)

export default UsuarioRouter;