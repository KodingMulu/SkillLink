import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const userId = userAuth.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolios: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) return NextResponse.json({ message: "User not found", code: 404 });

    const completedProjectsRaw = await prisma.project.findMany({
      where: {
        freelancerId: userId,
        status: "COMPLETED"
      },
      include: {
        job: {
          include: { client: { select: { username: true } } }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    type ProjectWithRating = typeof completedProjectsRaw[0] & {
      rating: number | null;
      review: string | null;
    };

    const completedProjects = completedProjectsRaw as unknown as ProjectWithRating[];

    const validRatings = completedProjects
      .map(p => p.rating)
      .filter((r): r is number => r !== null && r !== undefined);

    const totalRating = validRatings.reduce((acc, curr) => acc + curr, 0);
    const avgRating = validRatings.length > 0 ? (totalRating / validRatings.length) : 0;

    const ratedProjects = completedProjects.filter(p => p.rating !== null);

    const profileData = {
      name: user.username || "User",
      title: user.title || "Freelancer",
      email: user.email,
      phone: user.phone || "-",
      location: user.location || "-",
      joinDate: user.createdAt,
      bio: user.bio || "",
      skills: user.skills || [],
      completedProjects: completedProjects.length,
      rating: Number(avgRating.toFixed(1)),
      reviewCount: validRatings.length,
      responseTime: "1 jam",
      website: "#",
      github: "#",
      linkedin: "#",
      avatar: user.username ? user.username.substring(0, 2).toUpperCase() : "US",
      portfolios: user.portfolios,
      reviews: ratedProjects.map(p => ({
        id: p.id,
        clientName: p.job.client.username || "Client",
        rating: p.rating || 0,
        comment: p.review || "Tidak ada komentar.",
        date: p.updatedAt
      }))
    };

    return NextResponse.json({ message: "Success", code: 200, data: profileData });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });

    const body = await req.json();
    const { name, title, bio, location, phone, skills } = body;

    await prisma.user.update({
      where: { id: userAuth.id },
      data: {
        username: name,
        title: title,
        bio: bio,
        location: location,
        phone: phone,
        skills: skills
      }
    });

    return NextResponse.json({ message: "Profile updated", code: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}