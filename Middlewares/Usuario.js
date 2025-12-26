import {
  buscarUuidClientes,
  buscarUuidClientesIndicacao,
  retornarClientesArquivados,
  retornarTodosClientesPublic,
  retornarTodosClientesSelect,
} from "../Cruds/Clientes.js";
import {
  buscarEmprestimosClientes,
  buscarEmprestimosUuidHash,
} from "../Cruds/Emprestimos.js";
import {
  buscarFuncionarioEmail,
  buscarFuncionarioEmailPublic,
  buscarFuncionariosUuid,
} from "../Cruds/Funcionarios.js";
import { buscarEmail } from "../Cruds/Usuarios.js";
import {
  compararDados,
  criptografarDados,
  descriptografarDadosAES,
} from "../Utils/Criptografar.js";
import { UploadFiles } from "../Utils/Upload.js";
import {
  validar_UUID_V4,
  validarCPF,
  validarEmail,
} from "../Utils/Validador.js";

export async function LoginMiddleware(req, res, next) {
  try {
    var data;
    const { email, senha, tipo } = req.body;

    if (!email || !senha || !tipo) {
      return res
        .status(400)
        .json({ msg: "Email, senha e cargo são obrigatórios", code: 400 });
    }
    if (!validarEmail(email)) {
      return res.status(400).json({ msg: "Email inválido", code: 400 });
    }
    if (senha.length < 4) {
      return res
        .status(400)
        .json({ msg: "Senha deve ter no mínimo 4 caracteres", code: 400 });
    }
    if (tipo !== "admin" && tipo !== "funcionario") {
      return res
        .status(400)
        .json({ msg: "Tipo de usuário inválido", code: 400 });
    }
    if (tipo == "funcionario") {
      data = await buscarFuncionarioEmailPublic(email);
    } else {
      data = await buscarEmail(email);
    }
    if (!data) {
      return res
        .status(404)
        .json({ msg: "Email inválido ou senha incorreta", code: 404 });
    }
    if (!(await compararDados(data.senha, senha))) {
      return res
        .status(400)
        .json({ msg: "Email inválido ou senha incorreta", code: 400 });
    }
    req.usuario = data;
    req.tipo = tipo;
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
    const uuid = req.uuid;
    const unico = req.query.unico;
    const arquivado = req.query.arquivado;

    if (!unico && !arquivado) {
      var data = await retornarTodosClientesPublic(uuid);
    } else if (!arquivado && unico) {
      var data = await retornarTodosClientesSelect(uuid);
    } else if (arquivado && !unico) {
      var data = await retornarClientesArquivados(uuid);
    }

    req.data = data;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

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
      data_final,
    } = req.body;

    if (
      !id ||
      !data ||
      !data_Pag ||
      !valor ||
      !taxa_juros ||
      !tipo_juros ||
      !quantidade_parcelas ||
      parcelas_pagas === undefined ||
      !valor_parcela ||
      !status
    ) {
      return res
        .status(400)
        .json({ msg: "Campos obrigatórios não foram preenchidos", code: 400 });
    }
    if (!data_final) {
      return res
        .status(400)
        .json({ msg: "Data final do empréstimo é obrigatória", code: 400 });
    }
    if (Date.parse(data_final) === NaN) {
      return res
        .status(400)
        .json({ msg: "Data final do empréstimo inválida", code: 400 });
    }
    if (!validar_UUID_V4(id)) {
      return res.status(400).json({ msg: "ID do cliente inválido", code: 400 });
    }
    if (isNaN(Number(valor)) || Number(valor) <= 0) {
      return res
        .status(400)
        .json({ msg: "Valor do empréstimo inválido", code: 400 });
    }
    if (isNaN(Number(taxa_juros)) || Number(taxa_juros) < 0) {
      return res.status(400).json({ msg: "Taxa de juros inválida", code: 400 });
    }
    if (!["simples", "composto"].includes(tipo_juros)) {
      return res.status(400).json({ msg: "Tipo de juros inválido", code: 400 });
    }
    if (Date.parse(data) === NaN) {
      return res
        .status(400)
        .json({ msg: "Data de empréstimo inválida", code: 400 });
    }
    if (Date.parse(data_Pag) === NaN) {
      return res
        .status(400)
        .json({ msg: "Data de pagamento inválida", code: 400 });
    }
    if (
      isNaN(Number(quantidade_parcelas)) ||
      Number(quantidade_parcelas) <= 0
    ) {
      return res
        .status(400)
        .json({ msg: "Quantidade de parcelas inválida", code: 400 });
    }
    if (isNaN(Number(parcelas_pagas)) || Number(parcelas_pagas) < 0) {
      return res
        .status(400)
        .json({ msg: "Parcelas pagas inválida", code: 400 });
    }
    if (isNaN(Number(valor_parcela)) || Number(valor_parcela) <= 0) {
      return res
        .status(400)
        .json({ msg: "Valor da parcela inválida", code: 400 });
    }
    if (!["ativo", "inativo", "quitado"].includes(status)) {
      return res.status(400).json({ msg: "Status inválido", code: 400 });
    }
    if (observacao && observacao.length > 500) {
      return res.status(400).json({ msg: "Observação muito longa", code: 400 });
    }
    const clienteData = await buscarUuidClientes(id, req.uuid);
    if (!clienteData) {
      return res.status(404).json({ msg: "Cliente não encontrado", code: 404 });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verEmprestimosMiddleware(req, res, next) {
  try {
    const uuid = req.params.uuid;

    const uuidUsuario = req.uuid;
    if (!uuid || !validar_UUID_V4(uuid)) {
      return res.status(400).json({ msg: "UUID inválido", code: 400 });
    }
    req.uuid = uuid;

    var emprestimos = await buscarEmprestimosUuidHash(uuid, uuidUsuario);
    if (!emprestimos) {
      return res
        .status(404)
        .json({ msg: "Emprestimo nao encontrado", code: 404 });
    }
    emprestimos = JSON.parse(JSON.stringify(emprestimos));

    var { cpf, byte, tag } = emprestimos.clientesEmprestimos;
    console.log(cpf, byte, tag);
    cpf = descriptografarDadosAES(cpf, byte, tag);
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

export async function verClientesUuidMiddleware(req, res, next) {
  try {
    const uuid = req.params.uuid;
    const uuidUsuario = req.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res.status(400).json({ msg: "UUID inválido", code: 400 });
    }

    const clientes = await buscarUuidClientesIndicacao(uuid, uuidUsuario);
    if (!clientes) {
      return res.status(404).json({ msg: "Cliente não encontrado", code: 404 });
    }
    req.data = clientes;

    const clientesJson = JSON.parse(JSON.stringify(clientes));

    var { cpf, byte, tag } = clientesJson;
    console.log(cpf, byte, tag);
    cpf = descriptografarDadosAES(cpf, byte, tag);
    clientesJson.cpf = cpf;
    delete clientesJson.byte;
    delete clientesJson.tag;
    req.data = clientesJson;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarClientesMiddleware(req, res, next) {
  try {
    const uuid = req.params.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res.status(400).json({ msg: "UUID inválido", code: 400 });
    }

    req.uuidCliente = uuid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarEmprestimosMiddleware(req, res, next) {
  try {
    const uuid = req.params.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res.status(400).json({ msg: "UUID inválido", code: 400 });
    }

    req.uuidEmprestimo = uuid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
export async function atualizarEmprestimosMiddleware(req, res, next) {
  try {
    var ObjetoUpdate = {};
    console.log("Corpo da requisição:", req.body);
    const {
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
      data_final,
    } = req.body;
    const id = req.params.uuid;

    if (
      !data &&
      !data_Pag &&
      !valor &&
      !taxa_juros &&
      !tipo_juros &&
      !quantidade_parcelas &&
      !parcelas_pagas &&
      !valor_parcela &&
      !status &&
      !data_final &&
      !observacao
    ) {
      return res
        .status(400)
        .json({ msg: "Envie pelo menos um campo para atualizar", code: 400 });
    }
    if (!validar_UUID_V4(id) || !id) {
      return res.status(400).json({ msg: "Emprestimo inválido", code: 400 });
    }
    if (valor) {
      if (isNaN(Number(valor)) || Number(valor) <= 0) {
        return res
          .status(400)
          .json({ msg: "Valor do empréstimo inválido", code: 400 });
      }
      ObjetoUpdate.valor = valor;
    }
    if (taxa_juros) {
      if (isNaN(Number(taxa_juros)) || Number(taxa_juros) < 0) {
        return res
          .status(400)
          .json({ msg: "Taxa de juros inválida", code: 400 });
      }
      ObjetoUpdate.juros = taxa_juros;
    }
    if (tipo_juros) {
      if (!["simples", "composto"].includes(tipo_juros)) {
        return res
          .status(400)
          .json({ msg: "Tipo de juros inválido", code: 400 });
      }
      ObjetoUpdate.tipo_juros = tipo_juros;
    }
    console.log(data);
    if (data) {
      if (!Date.parse(data)) {
        return res
          .status(400)
          .json({ msg: "Data de empréstimo inválida", code: 400 });
      }
      ObjetoUpdate.data = data;
    }
    if (data_Pag) {
      if (!Date.parse(data_Pag)) {
        return res
          .status(400)
          .json({ msg: "Data de pagamento inválida", code: 400 });
      }
      ObjetoUpdate.data_pagamento = data_Pag;
    }
    if (quantidade_parcelas) {
      if (
        isNaN(Number(quantidade_parcelas)) ||
        Number(quantidade_parcelas) <= 0
      ) {
        return res
          .status(400)
          .json({ msg: "Quantidade de parcelas inválida", code: 400 });
      }
      ObjetoUpdate.quantidade_parcelas = quantidade_parcelas;
    }
    if (parcelas_pagas) {
      if (isNaN(Number(parcelas_pagas)) || Number(parcelas_pagas) < 0) {
        return res
          .status(400)
          .json({ msg: "Parcelas pagas inválida", code: 400 });
      }
      ObjetoUpdate.quantidade_parcelas_usadas = parcelas_pagas;
    }

    if (valor_parcela) {
      if (isNaN(Number(valor_parcela)) || Number(valor_parcela) <= 0) {
        return res
          .status(400)
          .json({ msg: "Valor da parcela inválida", code: 400 });
      }
      ObjetoUpdate.parcela = valor_parcela;
    }

    if (status) {
      if (!["ativo", "inativo", "quitado"].includes(status)) {
        return res.status(400).json({ msg: "Status inválido", code: 400 });
      }
      ObjetoUpdate.status = status;
    }

    if (observacao) {
      if (observacao.length > 500) {
        return res
          .status(400)
          .json({ msg: "Observação muito longa", code: 400 });
      }
      ObjetoUpdate.observacao = observacao;
    }

    if (data_final) {
      if (!Date.parse(data_final)) {
        return res
          .status(400)
          .json({ msg: "Data final do empréstimo inválida", code: 400 });
      }
      ObjetoUpdate.data_final = data_final;
    }
    const emprestimos = await buscarEmprestimosUuidHash(id, req.uuid);
    if (!emprestimos) {
      return res
        .status(404)
        .json({ msg: "Empréstimo não encontrado", code: 404 });
    }

    req.ObjetoUpdate = ObjetoUpdate;
    req.uuidEmprestimo = req.params.uuid;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
export async function atualizarClientesMiddleware(req, res, next) {
  try {
    var ObjetoUpdate = {};
    const {
      nome,
      telefone,
      pai,
      mae,
      indicacao,
      indicacaoGrau,
      enderecoResidencial,
      enderecoComercial,
      referencias,
      chavePix,
      tipoChavePix,
      status,
      score,
      valorSolicitado,
    } = req.body;
    const id = req.params.uuid;

    if (
      !nome &&
      !telefone &&
      !pai &&
      !mae &&
      !indicacao &&
      !indicacaoGrau &&
      !enderecoResidencial &&
      !enderecoComercial &&
      !referencias &&
      !chavePix &&
      !tipoChavePix &&
      !status &&
      !score &&
      !valorSolicitado
    ) {
      return res
        .status(400)
        .json({ msg: "Envie pelo menos um campo para atualizar", code: 400 });
    }

    if (!validar_UUID_V4(id) || !id) {
      return res.status(400).json({ msg: "Cliente inválido", code: 400 });
    }

    if (nome) {
      if (nome.length > 200 || nome.length < 3) {
        return res.status(400).json({ msg: "Nome inválido", code: 400 });
      }
      ObjetoUpdate.nome = nome;
    }

    if (telefone) {
      const telefoneLimpo = telefone.replace(/\D/g, "");
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 14) {
        return res.status(400).json({ msg: "Telefone inválido", code: 400 });
      }
      ObjetoUpdate.telefone = telefone;
    }

    // Validação do objeto Pai
    if (pai) {
      if (typeof pai !== "object") {
        return res
          .status(400)
          .json({ msg: "Dados do pai inválidos", code: 400 });
      }

      const paiObj = {};

      // Valida nome do pai
      if (pai.nome) {
        if (pai.nome.length < 3 || pai.nome.length > 200) {
          return res
            .status(400)
            .json({ msg: "Nome do pai inválido", code: 400 });
        }
        paiObj.nome = pai.nome;
      }

      // Valida endereço do pai
      if (pai.endereco) {
        if (typeof pai.endereco !== "object") {
          return res
            .status(400)
            .json({ msg: "Endereço do pai inválido", code: 400 });
        }

        const { rua, numero, bairro, complemento } = pai.endereco;

        if (rua && (rua.length < 3 || rua.length > 200)) {
          return res
            .status(400)
            .json({ msg: "Rua do endereço do pai inválida", code: 400 });
        }
        if (numero && (isNaN(Number(numero)) || Number(numero) <= 0)) {
          return res
            .status(400)
            .json({ msg: "Número do endereço do pai inválido", code: 400 });
        }
        if (bairro && (bairro.length < 3 || bairro.length > 100)) {
          return res
            .status(400)
            .json({ msg: "Bairro do endereço do pai inválido", code: 400 });
        }
        if (complemento && complemento.length > 100) {
          return res.status(400).json({
            msg: "Complemento do endereço do pai inválido",
            code: 400,
          });
        }

        paiObj.endereco = pai.endereco;
      }

      ObjetoUpdate.pai = paiObj;
    }

    // Validação do objeto Mãe
    if (mae) {
      if (typeof mae !== "object") {
        return res
          .status(400)
          .json({ msg: "Dados da mãe inválidos", code: 400 });
      }

      const maeObj = {};

      // Valida nome da mãe
      if (mae.nome) {
        if (mae.nome.length < 3 || mae.nome.length > 200) {
          return res
            .status(400)
            .json({ msg: "Nome da mãe inválido", code: 400 });
        }
        maeObj.nome = mae.nome;
      }

      // Valida endereço da mãe
      if (mae.endereco) {
        if (typeof mae.endereco !== "object") {
          return res
            .status(400)
            .json({ msg: "Endereço da mãe inválido", code: 400 });
        }

        const { rua, numero, bairro, complemento } = mae.endereco;

        if (rua && (rua.length < 3 || rua.length > 200)) {
          return res
            .status(400)
            .json({ msg: "Rua do endereço da mãe inválida", code: 400 });
        }
        if (numero && (isNaN(Number(numero)) || Number(numero) <= 0)) {
          return res
            .status(400)
            .json({ msg: "Número do endereço da mãe inválido", code: 400 });
        }
        if (bairro && (bairro.length < 3 || bairro.length > 100)) {
          return res
            .status(400)
            .json({ msg: "Bairro do endereço da mãe inválido", code: 400 });
        }
        if (complemento && complemento.length > 100) {
          return res.status(400).json({
            msg: "Complemento do endereço da mãe inválido",
            code: 400,
          });
        }

        maeObj.endereco = mae.endereco;
      }

      // Valida parente1
      if (mae.parente1) {
        if (typeof mae.parente1 !== "object") {
          return res
            .status(400)
            .json({ msg: "Dados do parente 1 inválidos", code: 400 });
        }
        if (!mae.parente1.nome || !mae.parente1.grauParentesco) {
          return res
            .status(400)
            .json({ msg: "Dados do parente 1 incompletos", code: 400 });
        }
        maeObj.parente1 = mae.parente1;
      }

      // Valida parente2
      if (mae.parente2) {
        if (typeof mae.parente2 !== "object") {
          return res
            .status(400)
            .json({ msg: "Dados do parente 2 inválidos", code: 400 });
        }
        if (!mae.parente2.nome || !mae.parente2.grauParentesco) {
          return res
            .status(400)
            .json({ msg: "Dados do parente 2 incompletos", code: 400 });
        }
        maeObj.parente2 = mae.parente2;
      }

      ObjetoUpdate.mae = maeObj;
    }

    if (indicacao) {
      if (!validar_UUID_V4(indicacao)) {
        return res
          .status(400)
          .json({ msg: "UUID de indicação inválido", code: 400 });
      }
      ObjetoUpdate.indicacoes = indicacao;
    }

    if (enderecoResidencial) {
      if (typeof enderecoResidencial !== "object") {
        return res
          .status(400)
          .json({ msg: "Endereço residencial inválido", code: 400 });
      }
      const { rua, numero, bairro, complemento, tipoImovel } =
        enderecoResidencial;

      if (rua && (rua.length < 3 || rua.length > 200)) {
        return res
          .status(400)
          .json({ msg: "Rua do endereço residencial inválida", code: 400 });
      }
      if (bairro && (bairro.length < 3 || bairro.length > 100)) {
        return res
          .status(400)
          .json({ msg: "Bairro do endereço residencial inválido", code: 400 });
      }
      if (numero && (isNaN(Number(numero)) || Number(numero) <= 0)) {
        return res
          .status(400)
          .json({ msg: "Número do endereço residencial inválido", code: 400 });
      }
      if (complemento && complemento.length > 100) {
        return res.status(400).json({
          msg: "Complemento do endereço residencial inválido",
          code: 400,
        });
      }
      if (
        tipoImovel &&
        !["Próprio", "Alugado", "Financiado", "Familiar"].includes(tipoImovel)
      ) {
        return res
          .status(400)
          .json({ msg: "Tipo de imóvel inválido", code: 400 });
      }

      ObjetoUpdate.endereco_residencial = enderecoResidencial;
    }

    if (enderecoComercial) {
      if (typeof enderecoComercial !== "object") {
        return res
          .status(400)
          .json({ msg: "Endereço comercial inválido", code: 400 });
      }
      const { rua, numero, bairro, funcaoCargo, nomeEmpresa } =
        enderecoComercial;

      if (rua && (rua.length < 3 || rua.length > 200)) {
        return res
          .status(400)
          .json({ msg: "Rua do endereço comercial inválida", code: 400 });
      }
      if (bairro && (bairro.length < 3 || bairro.length > 100)) {
        return res
          .status(400)
          .json({ msg: "Bairro do endereço comercial inválido", code: 400 });
      }
      if (numero && (isNaN(Number(numero)) || Number(numero) <= 0)) {
        return res
          .status(400)
          .json({ msg: "Número do endereço comercial inválido", code: 400 });
      }
      if (funcaoCargo && funcaoCargo.length > 100) {
        return res
          .status(400)
          .json({ msg: "Função/Cargo inválido", code: 400 });
      }
      if (nomeEmpresa && nomeEmpresa.length > 200) {
        return res
          .status(400)
          .json({ msg: "Nome da empresa inválido", code: 400 });
      }

      ObjetoUpdate.endereco_comercial = enderecoComercial;
    }

    if (referencias) {
      if (!Array.isArray(referencias) || referencias.length > 3) {
        return res
          .status(400)
          .json({ msg: "Referências inválidas (máximo 3)", code: 400 });
      }

      for (const ref of referencias) {
        if (!ref.nome || !ref.telefone || !ref.grauParentesco) {
          return res
            .status(400)
            .json({ msg: "Dados de referência incompletos", code: 400 });
        }
        if (ref.nome.length < 3 || ref.nome.length > 200) {
          return res
            .status(400)
            .json({ msg: "Nome da referência inválido", code: 400 });
        }
        const telLimpo = ref.telefone.replace(/\D/g, "");
        if (telLimpo.length < 10 || telLimpo.length > 14) {
          return res
            .status(400)
            .json({ msg: "Telefone da referência inválido", code: 400 });
        }
      }

      ObjetoUpdate.referencia = referencias;
    }

    if (valorSolicitado) {
      if (isNaN(Number(valorSolicitado)) || Number(valorSolicitado) <= 0) {
        return res
          .status(400)
          .json({ msg: "Valor solicitado inválido", code: 400 });
      }
      ObjetoUpdate.valor_solicitado = valorSolicitado;
    }

    if (chavePix) {
      if (chavePix.length > 100) {
        return res.status(400).json({ msg: "Chave PIX inválida", code: 400 });
      }
      ObjetoUpdate.chave_pix = chavePix;
    }

    if (tipoChavePix) {
      if (
        !["cpf", "cnpj", "email", "telefone", "aleatoria"].includes(
          tipoChavePix.toLowerCase()
        )
      ) {
        return res
          .status(400)
          .json({ msg: "Tipo de chave PIX inválido", code: 400 });
      }
      ObjetoUpdate.tipo_chave_pix = tipoChavePix;
    }

    if (status) {
      if (
        !["pendente", "aprovado", "reprovado", "ativo", "inativo"].includes(
          status
        )
      ) {
        return res.status(400).json({ msg: "Status inválido", code: 400 });
      }
      ObjetoUpdate.status = status;
    }

    if (score !== undefined) {
      if (isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100) {
        return res.status(400).json({ msg: "Score inválido", code: 400 });
      }
      ObjetoUpdate.score = score;
    }

    const cliente = await buscarUuidClientes(id, req.uuid);
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente não encontrado", code: 404 });
    }

    req.ObjetoUpdate = ObjetoUpdate;
    req.uuidCliente = req.params.uuid;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function ArquivarClientesMiddleware(req, res, next) {
  try {
    const uuidCliente = req.params.uuid;
    const uuid = req.uuid;

    if (!uuidCliente || !validar_UUID_V4(uuid)) {
      return res
        .status(400)
        .json({ msg: "Cliente informado invalido", code: 400 });
    }
    const cliente = await buscarUuidClientes(uuidCliente, uuid);

    if (!cliente) {
      return res.status(400).json({ msg: "Cliente nao encontrado", code: 400 });
    }
    if (cliente.arquivado == true) {
      return res
        .status(400)
        .json({ msg: "Cliente ja esta arquivado", code: 400 });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function cadastrarFuncionariosMiddleware(req, res, next) {
  try {
    let { nome, email, senha, nivel_permissao } = req.body;
    const uuid = req.uuid;

    if (
      !nome ||
      !email ||
      !senha ||
      (!nivel_permissao && nivel_permissao !== 0)
    ) {
      return res.status(400).json({
        msg: "Por favor, preencha os campos obrigatórios: nome, email, senha e nível de permissão.",
        code: 400,
      });
    }
    if (!validarEmail(email)) {
      return res.status(400).json({
        msg: "Email inválido. Forneça um email no formato correto.",
        code: 400,
      });
    }
    if (senha.length < 6) {
      return res.status(400).json({
        msg: "Senha muito curta. A senha deve conter ao menos 6 caracteres.",
        code: 400,
      });
    }
    if (
      isNaN(Number(nivel_permissao)) ||
      Number(nivel_permissao) < 0 ||
      Number(nivel_permissao) > 3
    ) {
      return res.status(400).json({
        msg: "Nível de permissão inválido. Informe um valor entre 0 e 3.",
        code: 400,
      });
    }
    const funcionarioExistente = await buscarFuncionarioEmail(email, uuid);

    if (funcionarioExistente) {
      return res.status(400).json({
        msg: "Este email já está em uso por outro funcionário.",
        code: 400,
      });
    }

    senha = await criptografarDados(senha);

    req.funcionarioData = {
      nome,
      email,
      senha,
      nivel_permissao,
      id_dono: uuid,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Ocorreu um erro interno. Tente novamente mais tarde.",
      code: 500,
    });
  }
}

export async function DesarquivarClientesMiddleware(req, res, next) {
  try {
    const uuidCliente = req.params.uuid;
    const uuid = req.uuid;

    if (!uuidCliente || !validar_UUID_V4(uuid)) {
      return res
        .status(400)
        .json({ msg: "Cliente informado invalido", code: 400 });
    }
    const cliente = await buscarUuidClientes(uuidCliente, uuid);

    if (!cliente) {
      return res.status(400).json({ msg: "Cliente nao encontrado", code: 400 });
    }
    if (cliente.arquivado == false) {
      return res
        .status(400)
        .json({ msg: "Cliente nao esta arquivado", code: 400 });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verFuncionariosMiddleware(req, res, next) {
  try {
    const uuid = req.params.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res
        .status(400)
        .json({ msg: "Funcionario informado invalido", code: 400 });
    }
    const funcionario = await buscarFuncionariosUuid(uuid, req.uuid);

    if (!funcionario) {
      return res
        .status(404)
        .json({ msg: "Funcionário não encontrado", code: 404 });
    }

    req.data = funcionario;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarFuncionarioMiddlleware(req, res, next) {
  try {
    const uuid = req.params.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res
        .status(400)
        .json({ msg: "Funcionário informado inválido", code: 400 });
    }

    const funcionario = await buscarFuncionariosUuid(uuid, req.uuid);

    if (!funcionario) {
      return res
        .status(404)
        .json({ msg: "Funcionário não encontrado", code: 404 });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function atualizarFuncionarioMiddleware(req, res, next) {
  try {
    let objetoUpdate = {};
    let { nome, email, senha, nivel_permissao } = req.body;
    const uuid = req.params.uuid;

    if (!uuid || !validar_UUID_V4(uuid)) {
      return res
        .status(400)
        .json({ msg: "Funcionário informado inválido", code: 400 });
    }

    if (!nome && !email && !senha && isNaN(Number(nivel_permissao))) {
      return res
        .status(400)
        .json({ msg: "Envie pelo menos um campo para atualizar", code: 400 });
    }
    if (nivel_permissao) {
      if (nivel_permissao > 3 || nivel_permissao < 0) {
        return res
          .status(400)
          .json({ msg: "Nível de permissão inválido", code: 400 });
      }
      objetoUpdate.nivel_permissao = nivel_permissao;
    }
    if (email) {
      if (!validarEmail(email)) {
        return res.status(400).json({ msg: "Email inválido", code: 400 });
      }
      if (await buscarFuncionarioEmail(email, req.uuid)) {
        return res
          .status(400)
          .json({ msg: "Email já em uso por outro funcionário", code: 400 });
      }
      objetoUpdate.email = email;
    }
    if (senha) {
      if (senha && senha.length < 6) {
        return res.status(400).json({
          msg: "Senha muito curta. A senha deve conter ao menos 6 caracteres.",
          code: 400,
        });
      }
      senha = await criptografarDados(senha);
      objetoUpdate.senha = senha;
    }
    if (nome) {
      objetoUpdate.nome = nome;
    }

    const funcionario = await buscarFuncionariosUuid(uuid, req.uuid);

    if (!funcionario) {
      return res
        .status(404)
        .json({ msg: "Funcionário não encontrado", code: 404 });
    }

    req.funcionarioUpdate = objetoUpdate;
    req.uuidFuncionario = uuid;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
