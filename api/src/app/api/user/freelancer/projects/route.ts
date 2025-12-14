import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        freelancerId: user.id,
      },
      include: {
        job: {
          select: {
            title: true,
            description: true,
            budget: true,
            tags: true,
            clientId: true,
          },
        },
      },
      orderBy: {
        status: "asc",
      },
    });

    return NextResponse.json({
      message: "Success fetching projects",
      code: 200,
      data: projects,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}