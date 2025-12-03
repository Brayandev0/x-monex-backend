import {
  buscarUuidClientes,
  retornarTodosClientesPublic,
  retornarTodosClientesSelect,
} from "../Cruds/Clientes.js";
import { buscarEmprestimosClientes, buscarEmprestimosUuidHash } from "../Cruds/Emprestimos.js";
import { buscarEmail } from "../Cruds/Usuarios.js";
import { compararDados, descriptografarDadosAES } from "../Utils/Criptografar.js";
import { UploadFiles } from "../Utils/Upload.js";
import { validar_UUID_V4, validarEmail } from "../Utils/Validador.js";

export async function LoginMiddleware(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ msg: "Email e senha são obrigatórios", code: 400 });
    }
    if (!validarEmail(email)) {
      return res.status(400).json({ msg: "Email inválido", code: 400 });
    }
    if (senha.length < 4) {
      return res
        .status(400)
        .json({ msg: "Senha deve ter no mínimo 4 caracteres", code: 400 });
    }
    const data = await buscarEmail(email);
    if (!data) {
      return res
        .status(404)
        .json({ msg: "Email inválido ou senha incorreta", code: 404 });
    }
    if (!(await compararDados(data.senha, senha))) {
      return res
        .status(404)
        .json({ msg: "Email inválido ou senha incorreta", code: 404 });
    }
    req.usuario = data;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function cadastrarClienteMiddleware(req, res, next) {
  try {
    console.log(req.headers["Content-type"]);

    // if(!nome || !cpf || !telefone || !pai || !mae || !telefones_referencia || !valor_solicitado){
    //   return  res.status(400).json({ msg: "Campos obrigatórios não foram preenchidos", code: 400 });
    // }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function retornarClientesMiddleware(req, res, next) {
  try {
    const unico = req.query.unico;
    if (!unico) {
      var data = await retornarTodosClientesPublic();
    } else {
      var data = await retornarTodosClientesSelect(unico);
    }

    req.data = data;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
/*
{
  cliente_id: "ca4170bf-3274-4d55-ab01-252297c97761", // UUID
  data_emprestimo: "2024-01-15", // formato YYYY-MM-DD
  data_pagamento: "2024-12-15", // formato YYYY-MM-DD
  valor: 1000.00, // float/decimal
  taxa_juros: 5.5, // float/decimal
  tipo_juros: "simples", // string
  quantidade_parcelas: 12, // integer
  parcelas_pagas: 0, // integer
  valor_parcela: 83.33, // float/decimal (calculado)
  status: "ativo", // string
  observacao: "Texto da observação" // string
}
*/

export async function cadastrarEmpestimosMiddleware(req, res, next) {
  try {
    const {
      id,
      data,
      data_Pag,
      valor,
      taxa_juros,
      tipo_juros,
      quantidade_parcelas,
      parcelas_pagas,
      valor_parcela,
      status,
      observacao,
      data_final
    } = req.body;

    if(!id || !data || !data_Pag || !valor || !taxa_juros || !tipo_juros || !quantidade_parcelas || parcelas_pagas===undefined || !valor_parcela || !status){
      return  res.status(400).json({ msg: "Campos obrigatórios não foram preenchidos", code: 400 });
    }
    if(!data_final){
      return  res.status(400).json({ msg: "Data final do empréstimo é obrigatória", code: 400 });
    }
    if(Date.parse(data_final) === NaN){
      return res.status(400).json({ msg: "Data final do empréstimo inválida", code: 400 });
    }
    if(!validar_UUID_V4(id)){
      return res.status(400).json({ msg: "ID do cliente inválido", code: 400 });
    }
    if(isNaN(Number(valor)) || Number(valor) <=0){
      return res.status(400).json({ msg: "Valor do empréstimo inválido", code: 400 });
    }
    if(isNaN(Number(taxa_juros)) || Number(taxa_juros) <0){
      return res.status(400).json({ msg: "Taxa de juros inválida", code: 400 });
    }
    if(!["simples","composto"].includes(tipo_juros)){
      return res.status(400).json({ msg: "Tipo de juros inválido", code: 400 });
    }
    if(Date.parse(data) === NaN){
      return res.status(400).json({ msg: "Data de empréstimo inválida", code: 400 });
    }
    if(Date.parse(data_Pag) === NaN){
      return res.status(400).json({ msg: "Data de pagamento inválida", code: 400 });
    }
    if(isNaN(Number(quantidade_parcelas)) || Number(quantidade_parcelas) <=0){
      return res.status(400).json({ msg: "Quantidade de parcelas inválida", code: 400 });
    }
    if(isNaN(Number(parcelas_pagas)) || Number(parcelas_pagas) <0){
      return res.status(400).json({ msg: "Parcelas pagas inválida", code: 400 });
    }
    if(isNaN(Number(valor_parcela)) || Number(valor_parcela) <=0){
      return res.status(400).json({ msg: "Valor da parcela inválida", code: 400 });
    }
    if(!["ativo","inativo","quitado"].includes(status)){
      return res.status(400).json({ msg: "Status inválido", code: 400 });
    }
    if(observacao && observacao.length > 500){
      return res.status(400).json({ msg: "Observação muito longa", code: 400 });
    }
    const clienteData = await buscarUuidClientes(id);
    if(!clienteData){
      return res.status(404).json({ msg: "Cliente não encontrado", code: 404 });
    }

    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}


export async function verEmprestimosMiddleware(req,res,next) {
  try {
    const uuid = req.params.uuid;

    const uuidUsuario =  req.uuid;
    if(!uuid || !validar_UUID_V4(uuid)){
      return res.status(400).json({ msg: "UUID inválido", code: 400 });
    }
    req.uuid = uuid;

    var emprestimos = await buscarEmprestimosUuidHash(uuid,uuidUsuario);
    emprestimos = JSON.parse(JSON.stringify(emprestimos));

    var {cpf,byte,tag} = emprestimos.clientesEmprestimos
    cpf = descriptografarDadosAES(cpf,byte,tag)
    emprestimos.clientesEmprestimos.cpf = cpf;
    delete emprestimos.clientesEmprestimos.byte;
    delete emprestimos.clientesEmprestimos.tag;
    req.data = emprestimos;
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
  
}