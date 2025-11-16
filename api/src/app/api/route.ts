import { NextResponse } from "next/server";

export function GET() {
     return NextResponse.json({
          message: "Hello World",
          code: 200
     })
}