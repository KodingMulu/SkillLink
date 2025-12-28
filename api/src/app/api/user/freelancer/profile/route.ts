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

    const [completedProjectsCount, ratingAggregate, reviewsList] = await Promise.all([
      prisma.project.count({
        where: { freelancerId: userId, status: "COMPLETED" }
      }),
      prisma.review.aggregate({
        _avg: { rating: true },
        where: { project: { freelancerId: userId } }
      }),
      prisma.review.findMany({
        where: { project: { freelancerId: userId } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            include: {
              job: {
                include: { client: { select: { username: true } } }
              }
            }
          }
        }
      })
    ]);

    const avgRating = ratingAggregate._avg.rating 
      ? Number(ratingAggregate._avg.rating.toFixed(1)) 
      : 0; 

    const profileData = {
      name: user.username || "User",
      title: user.title || "Freelancer",
      email: user.email,
      phone: user.phone || "-",
      location: user.location || "-",
      joinDate: user.createdAt,
      bio: user.bio || "Belum ada bio.",
      skills: user.skills || [],
      completedProjects: completedProjectsCount,
      rating: avgRating,
      reviewCount: reviewsList.length,
      responseTime: "1 jam",
      website: "#",
      github: "#",
      linkedin: "#",
      avatar: user.username ? user.username.substring(0, 2).toUpperCase() : "US",
      
      portfolios: user.portfolios,
      reviews: reviewsList.map(r => ({
        id: r.id,
        clientName: r.project.job.client.username || "Client",
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt
      }))
    };

    return NextResponse.json({
      message: "Success fetching profile",
      code: 200,
      data: profileData
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });

    const body = await req.json();
    const { name, title, bio } = body;

    await prisma.user.update({
      where: { id: userAuth.id },
      data: {
        username: name,
        title: title,
        bio: bio
      }
    });

    return NextResponse.json({ message: "Profile updated", code: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}