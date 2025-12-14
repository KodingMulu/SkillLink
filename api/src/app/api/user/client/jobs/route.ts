import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden", code: 403 }, { status: 403 });
    }

    const myJobs = await prisma.job.findMany({
      where: {
        clientId: user.id,
      },
      include: {
        _count: {
          select: { proposals: true }, 
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Success fetching jobs",
      code: 200,
      data: myJobs,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error", code: 500 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden", code: 403 }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, budget, tags } = body;

    if (!title || !description || !budget) {
      return NextResponse.json({ message: "Missing required fields", code: 400 }, { status: 400 });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        tags: tags || [], 
        clientId: user.id, 
        status: "OPEN",
      },
    });

    return NextResponse.json({
      message: "Job posted successfully",
      code: 201,
      data: newJob,
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}