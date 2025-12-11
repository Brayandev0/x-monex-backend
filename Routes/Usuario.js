import express from "express";
import {
  atualizarClientesMiddleware,
  atualizarEmprestimosMiddleware,
  cadastrarClienteMiddleware,
  cadastrarEmpestimosMiddleware,
  deletarClientesMiddleware,
  deletarEmprestimosMiddleware,
  LoginMiddleware,
  retornarClientesMiddleware,
    verClientesUuidMiddleware,
    
  verEmprestimosMiddleware,
} from "../Middlewares/Usuario.js";
import {
  cadastrarClienteController,
  cadastrarEmpestimosController,
  LoginUsuarioController,
  retornarClientesController,
  retornarEmprestimosController,
  verEmprestimosController,
  verClientesUuidController,
  deletarClientesController,
  deletarEmprestimosController,
  atualizarEmprestimosController,
  atualizarClientesController
} from "../Controllers/Usuario.js";
import { AuthMiddleware } from "../Middlewares/Auth.js";
import multer from "multer";
import formidable from "formidable";

const UsuarioRouter = express.Router();

UsuarioRouter.use(AuthMiddleware);

UsuarioRouter.get("/clientes",retornarClientesMiddleware,retornarClientesController);
UsuarioRouter.get("/clientes/:uuid",verClientesUuidMiddleware,verClientesUuidController);
UsuarioRouter.get("/emprestimos",retornarEmprestimosController);
UsuarioRouter.get("/emprestimos/:uuid",verEmprestimosMiddleware,verEmprestimosController)

UsuarioRouter.post("/login", LoginMiddleware, LoginUsuarioController);
UsuarioRouter.post("/clientes", cadastrarClienteController);
UsuarioRouter.post("/emprestimos",cadastrarEmpestimosMiddleware, cadastrarEmpestimosController)

UsuarioRouter.put("/emprestimos/:uuid",atualizarEmprestimosMiddleware,atualizarEmprestimosController)
UsuarioRouter.put("/clientes/:uuid",atualizarClientesMiddleware,atualizarClientesController)


UsuarioRouter.delete("/clientes/:uuid",deletarClientesMiddleware,deletarClientesController)
UsuarioRouter.delete("/emprestimos/:uuid",deletarEmprestimosMiddleware,deletarEmprestimosController)


export default UsuarioRouter;