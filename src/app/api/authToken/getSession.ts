import { cookies } from "next/headers";
import { decrypt } from "./createToken";

export async function getSession(){
    const session = cookies().get('session')?.value;
    if(!session) return null;
    return await decrypt(session);
}