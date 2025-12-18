import { buscarUuidClientes } from "../Cruds/Clientes.js";
import { buscarParcelasVencidas } from "../Cruds/Parcelas.js";

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
export function validar_UUID_V4(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );
}

export function validarNome(nome) {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  if (!regex.test(nome)) {
    return false;
  }
  if (nome.trim().length < 3) {
    return false;
  }
  return true;
}

function validarPais(nomePai, nomeMae) {
  const verificarString = (v, min = 3) =>
    typeof v === "string" && v.trim().length >= min;

  if (!verificarString(nomePai)) {
    return false;
  }
  if (!verificarString(nomeMae)) {
    return false;
  }
  return true;
}

export function validarCPF(cpf) {

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // inválido se não tiver 11 dígitos ou for repetido
  }

  // Validação do primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito >= 10) primeiroDigito = 0;
  if (primeiroDigito !== parseInt(cpf[9])) return false;

  // Validação do segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito >= 10) segundoDigito = 0;
  if (segundoDigito !== parseInt(cpf[10])) return false;

  return true;
}

function validarEndereco(endereco, tipo) {
  if (
    !endereco ||
    typeof endereco !== "object" ||
    !endereco.rua ||
    !endereco.numero ||
    !endereco.bairro
  ) {
    return false;
  }
  if (
    tipo === "comercial" &&
    (!endereco.funcaoCargo || !endereco.nomeEmpresa)
  ) {
    return false;
  }
  if (tipo === "residencial" && !endereco.complemento) {
    return false;
  }
  if (isNaN(Number(endereco.numero))) {
    return false;
  }

  return true;
}

function validarReferencia(dados) {
  const verificarString = (v, min = 3) =>
    typeof v === "string" && v.trim().length >= min;
  if (
    !dados.referencias ||
    !Array.isArray(dados.referencias) ||
    dados.referencias.length < 3
  ) {
    return { valido: false, mensagem: "Referências inválidas" };
  }
  for (const ref of dados.referencias) {
    if (!ref.nome || !validarNome(ref.nome)) {
      return { valido: false, mensagem: "Nome da referência inválido" };
    }
    if (!ref.telefone || !validarTelefone(ref.telefone)) {
      return { valido: false, mensagem: "Telefone da referência inválido" };
    }
    if (!ref.grauParentesco || !verificarString(ref.grauParentesco)) {
      return {
        valido: false,
        mensagem: "Grau de parentesco da referência inválido",
      };
    }
  }
  return true;
}
function validarParente(parente) {
  if (!parente || typeof parente !== "object") {
    return false;
  }
  if (
    !parente.nome ||
    typeof parente.nome !== "string" ||
    parente.nome.length < 3
  ) {
    return false;
  }
  if (
    !parente.grauParentesco ||
    typeof parente.grauParentesco !== "string" ||
    parente.grauParentesco.length < 3
  ) {
    return false;
  }
  const enderecoValido = validarEndereco(parente.endereco);
  if (!enderecoValido) {
    return false;
  }
  return true;
}

export function validarTelefone(telefone) {
  const regex = /^\d{10,11}$/;
  return regex.test(telefone);
}

export async function validarCadastroCliente(dados) {
  try {
    
    // ✅ Acessar [0] para todos os campos
    const nome = dados.nome?.[0];
    const telefone = dados.telefone?.[0];
    const cpf = dados.cpf?.[0];
    const nomePai = dados.nomePai?.[0];
    const nomeMae = dados.nomeMae?.[0];
    const indicacao = dados.indicacao?.[0];
    const indicacaoBox = dados.indicacaoBox?.[0];
    const comprovacaoTipo = dados.comprovacaoTipo?.[0];
    const chavePix = dados.chavePix?.[0];
    const tipoChavePix = dados.tipoChavePix?.[0];
    const status = dados.status?.[0];
    const indicacaoGrau = dados.indicacaoGrau?.[0];
    const score = dados.score?.[0];
    const cidade = dados.cidade?.[0]

    console.log("status : ",status);
    if (score !== undefined && (isNaN(Number(score)) || Number(score) < 0 || Number(score) > 50)) {
      return { valido: false, mensagem: "Score inválido" };
    }
    if(!status || (status !== "aprovado" && status !== "pendente")){
      return { valido: false, mensagem: "Status inválido" };
    }
    if (!nome || !validarNome(nome)) {
      return { valido: false, mensagem: "Nome inválido" };
    }
    if (!indicacaoGrau || !validarNome(indicacaoGrau)) {
      return { valido: false, mensagem: "Grau de indicação inválido" };
    }
    if (!telefone || !validarTelefone(telefone)) {
      return { valido: false, mensagem: "Telefone inválido" };
    }
    if (!cpf || !validarCPF(cpf)) {
      return { valido: false, mensagem: "CPF inválido" };
    }
    
    const residencial = {
      rua: dados["enderecoResidencial.rua"]?.[0],
      numero: dados["enderecoResidencial.numero"]?.[0],
      bairro: dados["enderecoResidencial.bairro"]?.[0],
      complemento: dados["enderecoResidencial.complemento"]?.[0],
      tipoImovel: dados["enderecoResidencial.tipoImovel"]?.[0],
    };

    const comercial = {
      rua: dados["enderecoComercial.rua"]?.[0],
      numero: dados["enderecoComercial.numero"]?.[0],
      bairro: dados["enderecoComercial.bairro"]?.[0],
      funcaoCargo: dados["enderecoComercial.funcaoCargo"]?.[0],
      nomeEmpresa: dados["enderecoComercial.nomeEmpresa"]?.[0],
    };

    if (!validarEndereco(residencial)) {
      return { valido: false, mensagem: "Endereço residencial inválido" };
    }
    if (!validarEndereco(comercial)) {
      return { valido: false, mensagem: "Endereço comercial inválido" };
    }

    if (!["Próprio", "Alugado"].includes(String(residencial.tipoImovel))) {
      return { valido: false, mensagem: "Tipo de imóvel residencial inválido" };
    }

    if (!validarPais(nomePai, nomeMae)) {
      return { valido: false, mensagem: "Nome dos pais inválido" };
    }
    
    if (!indicacao || !validar_UUID_V4(indicacao) ) {
      return { valido: false, mensagem: "indicação inválida" };
    }
    
    if (comprovacaoTipo !== "referencias" && comprovacaoTipo !== "carteira") {
      comprovacaoTipo = "carteira"
    }

    if (!chavePix || !tipoChavePix) {
      return { valido: false, mensagem: "Chave Pix não informada" };
    }
    
    if (tipoChavePix === "email") {
      if (!validarEmail(chavePix)) {
        return { valido: false, mensagem: "Chave Pix de email inválida" };
      }
    } else if (tipoChavePix === "telefone") {
      if (!validarTelefone(chavePix)) {
        return { valido: false, mensagem: "Chave Pix de telefone inválida" };
      }
    } else if (tipoChavePix === "cpf") {
      if (!validarCPF(chavePix)) {
        return { valido: false, mensagem: "Chave Pix de CPF inválida" };
      }
    }

    if (tipoChavePix !== "email" && tipoChavePix !== "telefone" && tipoChavePix !== "cpf") {
      return { valido: false, mensagem: "Tipo de chave Pix inválida" };
    }

    if (comprovacaoTipo === "referencias") {
      const referencias = {
        referencias: [
          {
            nome: dados["referencias[1].nome"]?.[0],
            telefone: dados["referencias[1].telefone"]?.[0],
            grauParentesco: dados["referencias[1].grauParentesco"]?.[0],
          },
          {
            nome: dados["referencias[2].nome"]?.[0],
            telefone: dados["referencias[2].telefone"]?.[0],
            grauParentesco: dados["referencias[2].grauParentesco"]?.[0],
          },
          {
            nome: dados["referencias[3].nome"]?.[0],
            telefone: dados["referencias[3].telefone"]?.[0],
            grauParentesco: dados["referencias[3].grauParentesco"]?.[0],
          },
        ],
      };
      if (!validarReferencia(referencias)) {
        return { valido: false, mensagem: "Referências inválidas" };
      }
    }



    const enderecoPais = {
      rua: dados["enderecoPais.rua"]?.[0],
      numero: dados["enderecoPais.numero"]?.[0],
      bairro: dados["enderecoPais.bairro"]?.[0],
      complemento: dados["enderecoPais.complemento"]?.[0],
    };
    
    if (!validarEndereco(enderecoPais)) {
      return { valido: false, mensagem: "Endereço dos pais inválido" };
    }

    const parente1 = {
      nome: dados["parente1.nome"]?.[0],
      grauParentesco: dados["parente1.grauParentesco"]?.[0],
      endereco: {
        rua: dados["parente1.endereco.rua"]?.[0],
        numero: dados["parente1.endereco.numero"]?.[0],
        bairro: dados["parente1.endereco.bairro"]?.[0],
      },
    };

    const parente2 = {
      nome: dados["parente2.nome"]?.[0],
      grauParentesco: dados["parente2.grauParentesco"]?.[0],
      endereco: {
        rua: dados["parente2.endereco.rua"]?.[0],
        numero: dados["parente2.endereco.numero"]?.[0],
        bairro: dados["parente2.endereco.bairro"]?.[0],
      },
    };
    
    const parente1Valido = validarParente(parente1);
    const parente2Valido = validarParente(parente2);
    
    if (!parente1Valido) {
      return { valido: false, mensagem: "Parente 1 inválido" };
    }
    if (!parente2Valido) {
      return { valido: false, mensagem: "Parente 2 inválido" };
    }

    return { valido: true };
  } catch (error) {
    console.log("Erro na validação:", error);
    return { valido: false, mensagem: "Erro ao validar cadastro" };
  }
}


