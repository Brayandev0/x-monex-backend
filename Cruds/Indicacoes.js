import { Indicacoes } from "../Models/Indicacoes.js";
import { geraruuid } from "../Utils/gerador.js";

export async function cadastrarIndicacoes(
  clienteID,
  IndicacaoCliente,
  nome,
  cpf,
  numero,
  grau_parentesco,
  status
) {
  return await Indicacoes.create({
    id: await geraruuid(),
    Clientes_id: clienteID,
    Clientes_Indicados: IndicacaoCliente,
    nome: nome,
    cpf: cpf,
    numero: numero,
    grau_parentesco: grau_parentesco,
    status: status,
  });
}
