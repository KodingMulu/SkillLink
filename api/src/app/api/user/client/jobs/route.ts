import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    if (user.role !== "CLIENT") {
      return NextResponse.json({ message: "Hanya Client yang dapat memposting pekerjaan", code: 403 }, { status: 403 });
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
      experienceLevel 
    } = body;

    if (!title || !description || !budget || !category) {
      return NextResponse.json({ message: "Data wajib tidak lengkap", code: 400 }, { status: 400 });
    }

    const cleanBudget = parseFloat(String(budget).replace(/[^0-9]/g, ''));

    const tagsArray = typeof skills === 'string' 
      ? skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
      : [];

    const deadlineDate = deadline ? new Date(deadline) : null;

    const newJob = await prisma.job.create({
      data: {
        title,
        category,
        description,
        budget: cleanBudget,
        deadline: deadlineDate,
        location,
        duration,
        experienceLevel,
        tags: tagsArray,
        clientId: user.id,
        status: "OPEN"
      }
    });

    return NextResponse.json({
      message: "Pekerjaan berhasil diposting",
      code: 201,
      data: newJob
    }, { status: 201 });

  } catch (error) {
    console.error("Post Job Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const jobs = await prisma.job.findMany({
      where: {
        clientId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: { proposals: true } 
        }
      }
    });

    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      category: job.category,
      budget: `Rp ${job.budget.toLocaleString('id-ID')}`, 
      deadline: job.deadline ? new Date(job.deadline).toLocaleDateString('id-ID') : '-',
      location: job.location,
      duration: job.duration,
      applicants: job._count.proposals,
      status: job.status === 'OPEN' ? 'active' : 'closed', 
      postedDate: new Date(job.createdAt).toLocaleDateString('id-ID'),
      skills: job.tags
    }));

    return NextResponse.json({
      message: "Success",
      code: 200,
      data: formattedJobs
    });

  } catch (error) {
    console.error("Get Jobs Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}