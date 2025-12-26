import {
  ArquivarClientes,
  atualizarClientes,
  deletarClientesUuid,
  DesarquivarClientes,
} from "../Cruds/Clientes.js";
import {
  atualizarEmprestimos,
  buscarEmprestimosClientes,
  CadastrarEmprestimos,
  deletarEmprestimosUuid,
} from "../Cruds/Emprestimos.js";
import {
  atualizarFuncionarios,
  buscarFuncionarios,
  buscarNivelPermissao,
  cadastrarFuncionarios,
  deletarFuncionariosUuid,
} from "../Cruds/Funcionarios.js";
import { buscarUuid } from "../Cruds/Usuarios.js";
import { gerarToken } from "../Utils/AuthToken.js";
import { UploadFiles } from "../Utils/Upload.js";

export async function LoginUsuarioController(req, res) {
  try {
    var token;
    const usuario = req.usuario;
    const tipo = req.tipo;
    if (tipo == "funcionario") {
      token = await gerarToken(
        usuario.id_dono,
        usuario.nivel_permissao,
        usuario.id
      );
    } else {
      token = await gerarToken(usuario.id);
    }

    return res.status(200).json({
      msg: "Login realizado com sucesso",
      code: 200,
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
    console.log("Arquivos : ", req.files);
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).json({
        msg: "Content-Type deve ser multipart/form-data",
        code: 400,
      });
    }

    const tudo = await UploadFiles(req, "documento", uuid);
    console.log(tudo);

    return res
      .json({ msg: "Cliente cadastrado com sucesso", code: 201 })
      .status(201);
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
    const emprestimos = await buscarEmprestimosClientes(uuid, {});

    return res.status(200).json({
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

    return res.status(200).json({
      code: 200,
      msg: "Empréstimos retornados com sucesso",
      emprestimos: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verClientesUuidController(req, res) {
  try {
    const data = req.data;

    return res.status(200).json({
      code: 200,
      msg: "Clientes retornados com sucesso",
      clientes: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarClientesController(req, res) {
  try {
    const uuid = req.uuid;
    const uuidCliente = req.uuidCliente;

    await deletarClientesUuid(uuidCliente, uuid);

    return res
      .status(200)
      .json({ msg: "Cliente deletado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarEmprestimosController(req, res) {
  try {
    const uuid = req.uuid;
    const uuidEmprestimo = req.uuidEmprestimo;

    console.log("UUID Empréstimo:", uuidEmprestimo);
    console.log("UUID Usuário:", uuid);

    const data = await deletarEmprestimosUuid(uuidEmprestimo, uuid);
    console.log("Resultado da deleção:", data);

    return res
      .status(200)
      .json({ msg: "Empréstimo deletado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function atualizarEmprestimosController(req, res) {
  try {
    const uuidUsuario = req.uuid;
    const objetoUpdate = req.ObjetoUpdate;
    const emprestimosUuid = req.uuidEmprestimo;

    console.log(
      "Objeto Update:",
      objetoUpdate,
      "UUID Empréstimo:",
      emprestimosUuid,
      "UUID Usuário:",
      uuidUsuario
    );

    const a = await atualizarEmprestimos(
      emprestimosUuid,
      uuidUsuario,
      objetoUpdate
    );
    console.log("Resultado da atualização:", a);

    return res
      .status(200)
      .json({ msg: "Empréstimo atualizado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function atualizarClientesController(req, res) {
  try {
    const uuidUsuario = req.uuid;
    const objetoUpdate = req.ObjetoUpdate;
    const clientesUuid = req.uuidCliente;

    await atualizarClientes(clientesUuid, uuidUsuario, objetoUpdate);

    return res
      .status(200)
      .json({ msg: "Cliente atualizado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function ArquivarClientesController(req, res) {
  try {
    const uuidCliente = req.params.uuid;
    const uuid = req.uuid;

    await ArquivarClientes(uuidCliente, uuid);

    return res
      .status(200)
      .json({ msg: "Cliente arquivado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Um erro ocorreu", code: 400 });
  }
}

export async function CadastrarFuncionariosController(req, res) {
  try {
    const data = req.funcionarioData;

    await cadastrarFuncionarios(
      data.nome,
      data.email,
      data.senha,
      data.nivel_permissao,
      req.uuid
    );

    return res
      .status(200)
      .json({ msg: "Funcionário cadastrado com sucesso", code: 201 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function DesarquivarClientesController(req, res) {
  try {
    const uuidCliente = req.params.uuid;
    const uuid = req.uuid;

    await DesarquivarClientes(uuidCliente, uuid);

    return res
      .status(200)
      .json({ msg: "Cliente desarquivado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Um erro ocorreu", code: 400 });
  }
}

export async function BuscarFuncionariosController(req, res) {
  try {
    const funcionarios = await buscarFuncionarios(req.uuid);
    if (!funcionarios || funcionarios.length === 0) {
      return res
        .status(404)
        .json({ msg: "Nenhum funcionário encontrado", code: 404 });
    }
    return res.status(200).json({
      msg: "Funcionários encontrados com sucesso",
      code: 200,
      funcionarios,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verFuncionariosController(req, res) {
  try {
    const data = req.data;

    return res.status(200).json({
      code: 200,
      msg: "Funcionário retornado com sucesso",
      funcionario: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function deletarFuncionarioController(req, res) {
  try {
    const uuid = req.uuid;
    const uuidFuncionario = req.params.uuid;

    await deletarFuncionariosUuid(uuid, uuidFuncionario);

    return res
      .status(200)
      .json({ msg: "Funcionário deletado com sucesso", code: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
export async function atualizarFuncionarioController(req, res) {
  try {
    const uuidFuncionario = req.uuidFuncionario;
    const funcionarioUpdate = req.funcionarioUpdate;
    const uuid = req.uuid;

    await atualizarFuncionarios(uuid, uuidFuncionario, funcionarioUpdate);

    return res
      .status(200)
      .json({ msg: "Funcionário atualizado com sucesso", code: 200 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}

export async function verPermissaoController(req, res) {
  try {
    let uuidFuncionario = req.uuidFuncionario;
    
    if (!uuidFuncionario) {
      uuidFuncionario = req.uuid;
    }
    const nivel_permissao = await buscarNivelPermissao(uuidFuncionario);
    if (!nivel_permissao) {
      const usuarioAdmin = await buscarUuid(req.uuid);
      if (!usuarioAdmin) {
        return res
          .status(404)
          .json({ msg: "Usuário não encontrado", code: 404 });
      }
      return res.status(200).json({
        code: 200,
        msg: "Nível de permissão retornado com sucesso",
        cargo: 3,
      });
    }

    return res.status(200).json({
      code: 200,
      msg: "Nível de permissão retornado com sucesso",
      cargo: nivel_permissao.nivel_permissao,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Um erro ocorreu", code: 500 });
  }
}
