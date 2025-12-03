import { Clientes } from "../Models/Clientes.js";
import { Indicacoes } from "../Models/Indicacoes.js";
import { geraruuid } from "../Utils/gerador.js";

export async function cadastrarCliente(dados) {
  const {
    indicacao,
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
  } = dados;

  console.log(dados);

  return await Clientes.create({
    Clientes_id: await geraruuid(),
    indicacoes: indicacao,
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
    score: dados.score !== undefined ? dados.score : undefined,
  });
}
export async function buscarUuidClientes(uuid_Clientes) {
  return await Clientes.findOne({
    where: { Clientes_id: uuid_Clientes },
  });
}

export async function buscarClientesCpf(cpf) {
  return await Clientes.findOne({
    where: { cpf: cpf },
  });
}

export async function retornarTodosClientesPublic() {
  return await Clientes.findAll({
    attributes: {
      exclude: ["valor_solicitado", "byte", "tag", "cpf"],
    },
    where:{

    },
    include: [
      {
        model: Indicacoes,
        as: "IndicacaoRecebida",  // a indicação recebida por este cliente
        attributes:{exclude:["id","cpf","uuid_Cliente_Indicacoes"]}
      }
    ]
  });
}


export async function retornarTodosClientesSelect() {
  return await Clientes.findAll({
    attributes: ['Clientes_id', 'nome', 'telefone',"status"],

  });
}