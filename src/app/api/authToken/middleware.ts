import { NextRequest } from "next/server";
import { updateSession } from "./updateSession";

export async function middleware(request:NextRequest){
    return await updateSession(request);
}