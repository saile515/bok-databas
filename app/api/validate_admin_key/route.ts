import { NextRequest } from "next/server"

interface RequestBody {
    admin_key: string;
}

export async function POST(req: NextRequest) {
    const { admin_key }: RequestBody = await req.json();
    const valid = admin_key == process.env.ADMIN_KEY;

    return Response.json({ valid: valid });
}
