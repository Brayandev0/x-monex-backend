import { configDotenv } from "dotenv";
import { verificarToken } from "../Utils/AuthToken.js";
configDotenv();
export async function AuthMiddleware(req, res, next) {
  try {
    if (req.path === "/login" || req.path === "/login/") {
      return next();
    }

    const token = req.headers["authorization"]
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Login inválido ou expirado", code: 401 });
    }
    const tokenWithoutBearer = token.split(" ")[1];
    const verify = await verificarToken(tokenWithoutBearer);
    if (!verify) {
      return res
        .status(401)
        .json({ msg: "Login inválido ou expirado", code: 401 });
    }
    console.log("Token verificado com sucesso:", verify);
    if (!verify.uuid) {
      return res
        .status(401)
        .json({ msg: "Login inválido ou expirado", code: 401 });
    }
    
    req.uuid = verify.uuid;
    req.cargo = verify.cargo;
    req.uuidFuncionario = verify.uuid_Funcionario;
    next();
  } catch (error) {
    console.error("Erro no AuthMiddleware:", error);
    return res.status(500).json({ msg: "Erro interno no servidor", code: 500 });
  }
}
