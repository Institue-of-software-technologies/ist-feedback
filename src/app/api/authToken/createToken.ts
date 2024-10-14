import { createSecretKey } from "crypto";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

interface Payload extends JWTPayload {
    id: number,
    username: string,
    email: string,
    roleId: number,
    permissions:string[]
    expires:Date
}

export async function encrypt(payload:Payload){
    const secretKey = String(process.env.SECRET_KEY);
    const key = createSecretKey(new Uint8Array(Buffer.from(secretKey, 'utf-8')));
    return await new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key)
}

export async function decrypt(input: string): Promise<Payload>{
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY)
    const {payload} = await jwtVerify(input, secretKey,{
        algorithms:['HS256'],
    }) as { payload: Payload };
    return payload
}