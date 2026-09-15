export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing or invalid", code: 401 },
        { status: 401 }
      );
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json(
        { message: "Forbidden: Client access only", code: 403 },
        { status: 403 }
      );
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

    if (!title || !category || !description || budget === undefined || budget === null) {
      return NextResponse.json(
        { message: "Judul, kategori, deskripsi, dan anggaran wajib diisi", code: 400 },
        { status: 400 }
      );
    }

    const cleanBudget = budget
      ? Number(String(budget).replace(/\D/g, ""))
      : 0;

    const tagsArray =
      typeof skills === "string"
        ? skills.split(",").map(s => s.trim()).filter(Boolean)
        : Array.isArray(skills)
        ? skills
        : [];

    const newJob = await prisma.job.create({
      data: {
        title,
        category,
        description,
        budget: cleanBudget,
        deadline: deadline ? new Date(deadline) : null,
        location: location || null,
        duration: duration || null,
        experienceLevel: experienceLevel || null,
        tags: tagsArray,
        clientId: user.id,
        status: "OPEN",
      },
    });

    return NextResponse.json(
      { message: "Job posted successfully", code: 201, data: newJob },
      { status: 201 }
    );

  } catch (error) {
    console.error("CREATE_JOB_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing or invalid", code: 401 },
        { status: 401 }
      );
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json(
        { message: "Forbidden: Client access only", code: 403 },
        { status: 403 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: { clientId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { proposals: true } },
      },
    });

    return NextResponse.json(
      { message: "Success", code: 200, data: jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_CLIENT_JOBS_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}
