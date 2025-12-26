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
export async function buscarFuncionarioEmailPublic(email) {
  return await Funcionarios.findOne({
    where: { email: email },
  });
}
export async function buscarFuncionarios(id_dono) {
  return await Funcionarios.findAll({
    attributes: { exclude: ["senha", "id_dono"] },
    where: { id_dono: id_dono },
  });
}

export async function buscarFuncionariosUuid(uuid, id_Dono) {
  return await Funcionarios.findOne({
    attributes: { exclude: ["senha", "id_dono"] },
    where: { id: uuid, id_dono: id_Dono },
  });
}

export async function deletarFuncionariosUuid(id_Dono, id) {
  return await Funcionarios.destroy({
    where: { id: id, id_dono: id_Dono },
  });
}

export async function atualizarFuncionarios(
  uuid_Dono,
  uuid_Funcionario,
  dados
) {
  return await Funcionarios.update(dados, {
    where: { id: uuid_Funcionario, id_dono: uuid_Dono },
  });
}

export async function buscarNivelPermissao(uuid_Funcionario) {
  return await Funcionarios.findOne({
    attributes: ["nivel_permissao"],
    where: { id: uuid_Funcionario },
  });
}
export async function buscarFuncionarioPorId(uuid) {
  return await Funcionarios.findByPk(uuid, {
    attributes: ["nivel_permissao"],
    raw: true,
  });
}