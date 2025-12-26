import express from "express";
import {
  ArquivarClientesMiddleware,
  atualizarClientesMiddleware,
  atualizarEmprestimosMiddleware,
  atualizarFuncionarioMiddleware,
  cadastrarEmpestimosMiddleware,
  cadastrarFuncionariosMiddleware,
  deletarClientesMiddleware,
  deletarEmprestimosMiddleware,
  deletarFuncionarioMiddlleware,
  DesarquivarClientesMiddleware,
  LoginMiddleware,
  retornarClientesMiddleware,
    verClientesUuidMiddleware,
    
  verEmprestimosMiddleware,
  verFuncionariosMiddleware,
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
  atualizarClientesController,
  ArquivarClientesController,
  CadastrarFuncionariosController,
  DesarquivarClientesController,
  BuscarFuncionariosController,
  verFuncionariosController,
  deletarFuncionarioController,
  atualizarFuncionarioController,
  verPermissaoController
} from "../Controllers/Usuario.js";
import { AuthMiddleware } from "../Middlewares/Auth.js";
import multer from "multer";
import formidable from "formidable";
import { FuncionarioMiddleware, VisitanteMiddleware } from "../Middlewares/Cargo.js";

const UsuarioRouter = express.Router();

UsuarioRouter.use(AuthMiddleware);

UsuarioRouter.get("/clientes",retornarClientesMiddleware,retornarClientesController);
UsuarioRouter.get("/clientes/:uuid",verClientesUuidMiddleware,verClientesUuidController);
UsuarioRouter.get("/emprestimos",retornarEmprestimosController);
UsuarioRouter.get("/emprestimos/:uuid",verEmprestimosMiddleware,verEmprestimosController)
UsuarioRouter.get("/funcionarios",FuncionarioMiddleware, BuscarFuncionariosController)
UsuarioRouter.get("/funcionarios/:uuid",FuncionarioMiddleware, verFuncionariosMiddleware,verFuncionariosController)
UsuarioRouter.get("/permissao",verPermissaoController)




UsuarioRouter.post("/login", LoginMiddleware, LoginUsuarioController);
UsuarioRouter.post("/clientes",VisitanteMiddleware, cadastrarClienteController);
UsuarioRouter.post("/emprestimos",VisitanteMiddleware,cadastrarEmpestimosMiddleware, cadastrarEmpestimosController)
UsuarioRouter.post("/funcionarios",FuncionarioMiddleware,cadastrarFuncionariosMiddleware, CadastrarFuncionariosController)


UsuarioRouter.patch("/emprestimos/:uuid",VisitanteMiddleware,atualizarEmprestimosMiddleware,atualizarEmprestimosController)
UsuarioRouter.patch("/clientes/:uuid",VisitanteMiddleware,atualizarClientesMiddleware,atualizarClientesController)
UsuarioRouter.patch("/clientes/:uuid/arquivar",VisitanteMiddleware,ArquivarClientesMiddleware,ArquivarClientesController)
UsuarioRouter.patch("/clientes/:uuid/desarquivar",VisitanteMiddleware,DesarquivarClientesMiddleware,DesarquivarClientesController)
UsuarioRouter.patch("/funcionarios/:uuid",VisitanteMiddleware,atualizarFuncionarioMiddleware, atualizarFuncionarioController)


UsuarioRouter.delete("/clientes/:uuid",FuncionarioMiddleware,deletarClientesMiddleware,deletarClientesController)
UsuarioRouter.delete("/emprestimos/:uuid",FuncionarioMiddleware,deletarEmprestimosMiddleware,deletarEmprestimosController)
UsuarioRouter.delete("/funcionarios/:uuid", FuncionarioMiddleware, deletarFuncionarioMiddlleware,deletarFuncionarioController)


export default UsuarioRouter;