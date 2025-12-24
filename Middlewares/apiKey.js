import { config } from "dotenv";

config();

export async function VerificarApiKey(req,res,next){
    try {
        console.log("Verificando API Key para a rota:", req.original)
        if (req.method === "OPTIONS") {
            return next();
        }
        const apiKey = req.headers['x-api-key'];
        const keyEnv = process.env.API_KEY;

        if(!apiKey || apiKey !== keyEnv || apiKey === undefined){
            return res.status(403).json({ msg: "Acesso não autorizado", code: 403 });
        }
        next();
        
    } catch (error) {
        console.error("Erro ao verificar API Key:", error);
        return res.status(500).json({ msg: "Acesso não autorizado", code: 500 });
    }
}