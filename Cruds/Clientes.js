import { Op, or, where } from "sequelize";
import { Clientes } from "../Models/Clientes.js";
import { Indicacoes } from "../Models/Indicacoes.js";
import { geraruuid } from "../Utils/gerador.js";

export async function cadastrarCliente(dados) {
  const {
    indicacao,
    uuid_Clientes,
    nome_Clientes,
    cpf,
    telefone,
    endereco_residencial,
    endereco_comercial,
    pai,
    mae,
    documento_file,
    tipo_documento,
    residencia_file,
    carteira_file,
    comprovacao_tipo,
    referencias,
    parentes,
    chavePix,
    tipo_chave_pix,
    iv,
    tag,
    status,
    score,
    Dono_id,
    cidade
  } = dados;

  return await Clientes.create({
    Clientes_id: uuid_Clientes ? uuid_Clientes : await geraruuid(),
    indicacoes: indicacao,
    Dono_id: Dono_id,
    nome: nome_Clientes,
    cpf: cpf,
    telefone: telefone,
    endereco_residencial: endereco_residencial,
    endereco_comercial: endereco_comercial,
    pai: pai,
    mae: mae,
    comprovacao_tipo: comprovacao_tipo,
    referencia: referencias,
    parentes: parentes,
    chave_pix: chavePix,
    tipo_chave_pix: tipo_chave_pix,
    documento_caminho: documento_file,
    tipo_documento: tipo_documento,
    comprovante_residencia: residencia_file,
    carteira_trabalho: carteira_file,
    byte: iv,
    tag: tag,
    status: status,
    score: score ? score : 0,
    cidade : cidade,
  });
}
export async function buscarUuidClientes(uuid_Clientes, uuid_Usuario) {
  return await Clientes.findOne({
    where: { Clientes_id: uuid_Clientes, Dono_id: uuid_Usuario },
  });
}
export async function buscarUuidClientesIndicacao(uuid_Clientes, uuid_Usuario) {
  return await Clientes.findOne({
    where: { Clientes_id: uuid_Clientes, Dono_id: uuid_Usuario },
    include: [
      {
        model: Indicacoes,
        as: "IndicacaoRecebida", // a indicação recebida por este cliente
        attributes: { exclude: ["id", "cpf", "uuid_Cliente_Indicacoes"] },
      },
    ],
  });
}
export async function buscarClientesCpfTelefone(cpf, telefone, uuidDono) {
  return await Clientes.findOne({
    where: {
      [Op.or]: [{ cpf: cpf }, { telefone: telefone }],
      Dono_id: uuidDono,
    },
  });
}

export async function retornarTodosClientesPublic(uuid_Usuario) {
  return await Clientes.findAll({
    attributes: {
      exclude: ["valor_solicitado", "byte", "tag", "cpf"],
    },
    where: { Dono_id: uuid_Usuario, arquivado: false },
    include: [
      {
        model: Indicacoes,
        as: "IndicacaoRecebida", // a indicação recebida por este cliente
        attributes: { exclude: ["id", "cpf", "uuid_Cliente_Indicacoes"] },
      },
    ],
    order: [["nome", "ASC"]],
  });
}

export async function retornarTodosClientesSelect(uuid) {
  return await Clientes.findAll({
    attributes: ["Clientes_id", "nome", "telefone", "status"],
    where: { Dono_id: uuid, arquivado: false },
    order: [["nome", "ASC"]],
  });
}

export async function deletarClientesUuid(uuid_Clientes, uuid_Usuario) {
  return await Clientes.destroy({
    where: { Clientes_id: uuid_Clientes, Dono_id: uuid_Usuario },
  });
}

export async function atualizarClientes(
  clientesUuid,
  uuidUsuario,
  objetoUpdate
) {
  return await Clientes.update(objetoUpdate, {
    where: {
      Clientes_id: clientesUuid,
      Dono_id: uuidUsuario,
    },
  });
}

export async function ArquivarClientes(uuidClientes, uuidUsuarios) {
  return await Clientes.update(
    { arquivado: true },
    {
      where: {
        Clientes_id: uuidClientes,
        Dono_id: uuidUsuarios,
      },
    }
  );
}

export async function DesarquivarClientes(uuidClientes, uuidUsuarios) {
  return await Clientes.update(
    { arquivado: false },
    {
      where: {
        Clientes_id: uuidClientes,
        Dono_id: uuidUsuarios,
      },
    }
  );
}


export async function retornarClientesArquivados(uuidUsuario) {
  return await Clientes.findAll({
    attributes: {
      exclude: ["valor_solicitado", "byte", "tag", "cpf"],
    },
    where: { Dono_id: uuidUsuario, arquivado: true },
    include: [
      {
        model: Indicacoes,
        as: "IndicacaoRecebida", // a indicação recebida por este cliente
        attributes: { exclude: ["id", "cpf", "uuid_Cliente_Indicacoes"] },
      },
    ],
    order: [["nome", "ASC"]],
  });
}