import jsonwebtoken from 'jsonwebtoken';
import dotenv, { config } from 'dotenv';
config();

export async function gerarToken(uuid,cargo){

    return await jsonwebtoken.sign(
        {uuid:uuid,cargo:cargo ? cargo : "5"},
        process.env.JWT_SECRET,
        { expiresIn: '7d',algorithm: "HS256" }
    )
}

export async function verificarToken(token){
    try {
        return await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return false;
    }
}



export async function gerar_ADMIN_Tokens(uuid){
    return await jsonwebtoken.sign(
        {uuid:uuid},
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: '2d',algorithm: "HS256"},
        { scope:["admin",`code ${process.env.VERIFICATION_TOKEN_ADMIN}`] }
    )
    
}

export async function verificar_ADMIN_Token(token){
    try {
        return await jsonwebtoken.verify(token, process.env.JWT_ADMIN_SECRET);
    } catch (error) {
        return false;
    }
}