import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) { 
    // ... your route handler logic
    console.log(request)
    console.log(params)
}