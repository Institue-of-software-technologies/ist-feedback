import { createSecretKey } from "crypto";
import { jwtVerify, SignJWT } from "jose";

export async function encrypt(payload:any){
    const secretKey = String(process.env.SECRET_KEY);
    const key = createSecretKey(new Uint8Array(Buffer.from(secretKey, 'utf-8')));
    return await new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any>{
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY)
    const {payload} = await jwtVerify(input, secretKey,{
        algorithms:['HS256'],
    });
    return payload
}