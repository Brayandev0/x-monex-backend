import { Funcionarios } from "../Models/Funcionarios.js";

export async function cadastrarFuncionarios(
  nome,
  email,
  senha,
  nivel_permissao,
  uuid_Usuarios
) {
  return await Funcionarios.create({
    nome: nome,
    email: email,
    senha: senha,
    nivel_permissao: nivel_permissao,
    id_dono: uuid_Usuarios,
  });
}

export async function buscarFuncionarioEmail(email, uuid_Usuarios) {
  return await Funcionarios.findOne({
    where: { email: email, id_dono: uuid_Usuarios },
  });
}

export async function buscarFuncionarios(id_dono) {
  return await Funcionarios.findAll({
    attributes: { exclude: ["senha", "id_dono"] },
    where: { id_dono: id_dono },
  });
}
