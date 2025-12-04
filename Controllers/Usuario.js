import { retornarTodosClientesPublic } from "../Cruds/Clientes.js";
import {
  buscarEmprestimosClientes,
  CadastrarEmprestimos,
} from "../Cruds/Emprestimos.js";
import { verEmprestimosMiddleware } from "../Middlewares/Usuario.js";
import { gerarToken } from "../Utils/AuthToken.js";
import { UploadFiles } from "../Utils/Upload.js";

export async function LoginUsuarioController(req, res) {
  try {
    const usuario = req.usuario;
    const token = await gerarToken(usuario.id);

    return res.status(200).json({
      msg: "Login realizado com sucesso",
      code: 200,
      nome: usuario.nome,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function cadastrarClienteController(req, res) {
  try {
    const uuid = req.uuid;

    if (req.headers["content-type"]) {
      const tudo = await UploadFiles(req, "documento", uuid);
      console.log(tudo);

      return res
        .json({ msg: "Cliente cadastrado com sucesso", code: 201 })
        .status(201);
    }
  } catch (error) {
    console.error(error);
    if (error.mensagem)
      return res.status(400).json({ msg: error.mensagem, code: 400 });
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function retornarClientesController(req, res) {
  try {
    const data = req.data;

    return res.status(200).json({ code: 200, clientes: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function cadastrarEmpestimosController(req, res) {
  try {
    const uuidUsuario = req.uuid;
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
    console.log("ID do Cliente:", id);
    console.log("UUID do Usuário:", uuidUsuario);
    console.log("Data do Empréstimo:", data);
    console.log("Data do Pagamento:", data_Pag);
    console.log("Valor do Empréstimo:", valor);
    console.log("Taxa de Juros:", taxa_juros);
    console.log("Tipo de Juros:", tipo_juros);
    console.log("Quantidade de Parcelas:", quantidade_parcelas);
    console.log("Parcelas Pagas:", parcelas_pagas);
    console.log("Valor da Parcela:", valor_parcela);
    console.log("Status do Empréstimo:", status);
    console.log("Observação:", observacao);

    await CadastrarEmprestimos(
      uuidUsuario,
      id,
      data,
      valor,
      taxa_juros,
      quantidade_parcelas,
      parcelas_pagas,
      valor_parcela,
      status,
      observacao,
      data_Pag,
      tipo_juros,
      data_final
    );
    return res
      .status(201)
      .json({ msg: "Empréstimo cadastrado com sucesso", code: 201 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function retornarEmprestimosController(req, res) {
  try {
    const data = req.data;
    const uuid = req.uuid;
    const emprestimos = await buscarEmprestimosClientes(uuid,{});

    return res
      .status(200)
      .json({
        code: 200,
        msg: "Emprestimos retornados com sucesso",
        emprestimos: emprestimos,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verEmprestimosController(req, res) {
  try {
    const data = req.data;

    return res
      .status(200)
      .json({
        code: 200,
        msg: "Empréstimos retornados com sucesso",
        emprestimos: data,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
