export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);

    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      category,
      description,
      budget,
      deadline,
      location,
      skills,
      duration,
      experienceLevel,
    } = body;

    const cleanBudget = budget
      ? Number(String(budget).replace(/\D/g, ""))
      : 0;

    const tagsArray =
      typeof skills === "string"
        ? skills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const newJob = await prisma.job.create({
      data: {
        title,
        category,
        description,
        budget: cleanBudget,
        deadline: deadline ? new Date(deadline) : null,
        location,
        duration,
        experienceLevel,
        tags: tagsArray,
        clientId: user.id,
        status: "OPEN",
      },
    });

    return NextResponse.json({ message: "Job posted", data: newJob }, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
      console.error("POST Error:", error.message);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { clientId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { proposals: true } },
      },
    });

    return NextResponse.json({ message: "Success", data: jobs });
  } catch (error) {
    if (error instanceof Error) {
      console.error("POST Error:", error.message);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Unknown server error" },
      { status: 500 }
    );
  }
}
