import { Clientes } from "../Models/Clientes.js";
import Emprestimos from "../Models/Emprestimos.js";
import Parcelas from "../Models/Parcelas.js";
import { geraruuid } from "../Utils/gerador.js";

export async function CadastrarEmprestimos(
  usuario_id,
  clientes_id,
  data,
  valor,
  juros,
  quantidade_parcelas,
  quantidade_parcelas_usadas,
  valor_parcela,
  status,
  observacao,
  data_pagamento,
  tipo_juros,
  data_final
) {
  return await Emprestimos.create({
    Emprestimos_id: await geraruuid(),
    Usuarios_id: usuario_id,
    Clientes_id: clientes_id,
    data: data,
    valor: valor,
    juros: juros,
    quantidade_parcelas: quantidade_parcelas,
    quantidade_parcelas_usadas: quantidade_parcelas_usadas,
    parcela: valor_parcela,
    status: status,
    observacao: observacao,
    data_pagamento: data_pagamento,
    tipo_juros: tipo_juros,
    data_final: data_final,
  });
}

export async function BuscarEmprestimosVencidos(uuid_Clientes) {
  return await Emprestimos.findOne({
    where: {
      uuid_Clientes: uuid_Clientes,
      status: "inadimplente",
    },
  });
}

export async function buscarEmprestimosClientes(uuidUsuario,{
  attributes = [
    "Emprestimos_id",
    "Clientes_id",
    "data",
    "valor",
    "status",
    "data_final_Emprestimos",
  ],
  order = [["data", "DESC"]],
  where = {Usuarios_id: uuidUsuario},
} = {}) {
  return await Emprestimos.findAll({
    attributes,
    where,
    include: [
      {
        model: Clientes,
        as: "clientesEmprestimos",
        attributes: [
          "nome",
          "telefone",
          "score",
          "endereco_comercial",
          "endereco_residencial",
          "criado_em",
        ], // fields necessários apenas
      },
      {
        model: Parcelas,
        as: "DatasParcelas",
        attributes: [
          "Parcelas_id",
          "Clientes_id",
          "status",
          "valor",
          "vencimento",
          "pagamento",
          "numero",
        ], // fields necessários apenas
      },
    ],
    order,
    raw: true, // retorna objetos puros (mais rápido)
    nest: true, // mantém estrutura aninhada
    subQuery: false,
  });
}

export async function buscarEmprestimosUuidHash(uuid_Emprestimos, Usuarios_id) {
  return await Emprestimos.findOne({
    where: {
      Emprestimos_id: uuid_Emprestimos,
      Usuarios_id: Usuarios_id,
    },
    attributes:{exclude: ["Usuarios_id"]}
    ,
    include: [
      {
        model: Clientes,
        as: "clientesEmprestimos",
        attributes: [
          "nome",
          "telefone",
          "score",
          "endereco_comercial",
          "endereco_residencial",
          "criado_em",
          "cpf",
          "byte",
          "tag"

        ],
      },      {
        model: Parcelas,
        as: "DatasParcelas",
        attributes: [
          "Parcelas_id",
          "Clientes_id",
          "status",
          "valor",
          "vencimento",
          "pagamento",
          "numero",
        ], // fields necessários apenas
      },

    ],
  });
}


export async function deletarEmprestimosUuid(uuid_Emprestimos, Usuarios_id) {
  return await Emprestimos.destroy({
    where: {
      Emprestimos_id: uuid_Emprestimos,
      Usuarios_id: Usuarios_id,
    },
  });
}