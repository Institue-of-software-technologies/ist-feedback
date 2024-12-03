import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./updateSession";
import Joi from 'joi'

export async function middleware(request:NextRequest){
    return await updateSession(request);
}

export const validateBody = (
    schema: Joi.ObjectSchema,
    body: unknown
) => {
    const result = schema.validate(body, { abortEarly: false });

    if (result.error) {
        return NextResponse.json(
            { error: result.error.details.map((err) => err.message) },
            { status: 400 }
        );
    }

    // No error means validation passed
    return null;
};
