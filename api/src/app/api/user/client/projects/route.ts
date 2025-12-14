import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden", code: 403 }, { status: 403 });
    }

    const activeProjects = await prisma.project.findMany({
      where: {
        job: {
          clientId: user.id,
        },
      },
      include: {
        job: {
            select: {
                title: true,
                budget: true
            }
        },
        freelancer: {
            select: {
                id: true,
                username: true,
                email: true
            }
        }
      },
      orderBy: {
        status: "asc",
      },
    });

    return NextResponse.json({
      message: "Success fetching active projects",
      code: 200,
      data: activeProjects,
    });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}