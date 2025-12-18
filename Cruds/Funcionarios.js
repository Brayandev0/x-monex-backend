import { Funcionarios } from "../Models/Funcionarios.js";

export async function cadastrarFuncionarios(nome, email, senha, nivel_permissao, uuid_Usuarios) {
  return await Funcionarios.create({
    nome: nome,
    email: email,
    senha: senha,
    nivel_permissao: nivel_permissao,
    uuid_Usuarios: uuid_Usuarios,
  });
}