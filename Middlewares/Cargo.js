import { buscarNivelPermissao } from "../Cruds/Funcionarios.js";
import { buscarUuid } from "../Cruds/Usuarios.js";

export async function VisitanteMiddleware(req, res, next) {
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
    }
    if (Number(nivel_permissao.nivel_permissao) == 1) {
      return res
        .status(403)
        .json({ msg: "Acesso negado, Cargo insuficiente", code: 403 });
    }

    next();
  } catch (error) {
    console.error("Erro no AuthMiddleware:", error);
    return res.status(500).json({ msg: "Erro interno no servidor", code: 500 });
  }
}

export async function FuncionarioMiddleware(req, res, next) {
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
    }
    if (Number(nivel_permissao) >= 2) {
      return res
        .status(403)
        .json({ msg: "Acesso negado, Cargo insuficiente", code: 403 });
    }

    next();
  } catch (error) {
    console.error("Erro no AuthMiddleware:", error);
    return res.status(500).json({ msg: "Erro interno no servidor", code: 500 });
  }
}
