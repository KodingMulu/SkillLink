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
      title, category, description, budget, 
      deadline, location, skills, duration, experienceLevel 
    } = body;

    const cleanBudget = parseFloat(String(budget).replace(/[^0-9]/g, ''));
    
    const tagsArray = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(s => s !== '')
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
        status: "OPEN"
      }
    });

    return NextResponse.json({ message: "Job posted", code: 201, data: newJob });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
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
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { proposals: true } }
      }
    });

    return NextResponse.json({
      message: "Success",
      code: 200,
      data: jobs 
    });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}