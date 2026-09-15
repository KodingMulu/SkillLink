import { NextResponse } from "next/server";

export function GET() {
     return NextResponse.json(
          {
               message: "SkillLink API Service",
               code: 200
          },
          { status: 200 }
     );
}