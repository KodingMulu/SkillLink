import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

async function checkOwnership(req: NextRequest, jobId: string) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "CLIENT") return null;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.clientId !== user.id) return null;
  return user;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> } 
) {
  try {
    const { jobId } = await params; 

    const job = await prisma.job.findUnique({
      where: { id: jobId }, 
      include: {
        _count: { select: { proposals: true } }
      }
    });

    if (!job) {
      return NextResponse.json({ message: "Pekerjaan tidak ditemukan", code: 404 }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", code: 200, data: job });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> } 
) {
  try {
    const { jobId } = await params; 

    const user = await checkOwnership(req, jobId); 
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", code: 403 }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, category, description, budget, 
      deadline, location, skills, duration, experienceLevel 
    } = body;

    const cleanBudget = parseFloat(String(budget).replace(/[^0-9]/g, ''));
    
    const tagsArray = typeof skills === 'string' 
      ? skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
      : Array.isArray(skills) ? skills : []; 

    const deadlineDate = deadline ? new Date(deadline) : null;

    const updatedJob = await prisma.job.update({
      where: { id: jobId }, 
      data: {
        title, category, description,
        budget: cleanBudget,
        deadline: deadlineDate,
        location, duration, experienceLevel,
        tags: tagsArray
      }
    });

    return NextResponse.json({ message: "Update berhasil", code: 200, data: updatedJob });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> } 
) {
  try {
    const { jobId } = await params; 

    const user = await checkOwnership(req, jobId); 
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", code: 403 }, { status: 403 });
    }

    await prisma.job.delete({
      where: { id: jobId }
    });

    return NextResponse.json({ message: "Pekerjaan berhasil dihapus", code: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}