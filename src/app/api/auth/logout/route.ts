import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(){
    cookies().delete("session")
    return NextResponse.json(
        {message:"you have successfully logged out"},
        {status:200}
    )
}