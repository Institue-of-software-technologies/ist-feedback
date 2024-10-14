import { NextRequest } from "next/server";

export async function GET(request: NextRequest) { 
    // ... your route handler logic
    console.log(request)
}