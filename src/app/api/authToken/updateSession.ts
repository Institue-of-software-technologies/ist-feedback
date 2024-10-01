import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./createToken";

export async function updateSession(request:NextRequest){
    const session = request.cookies.get('session')?.value;
    if(!session) return;

    // Refresh the session so it dosen't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name:'session',
        value:await encrypt(parsed),
        httpOnly: true,
        expires:parsed.expires
    });
    return res;
}