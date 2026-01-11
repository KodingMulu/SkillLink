import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export interface TalentResponse {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: string;
  skills: string[];
  completedProjects: number;
  description: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    const whereClause: Prisma.UserWhereInput = {
      role: "FREELANCER",
      status: "ACTIVE",
    };

    if (search) {
      whereClause.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { skills: { has: search } }
      ];
    }

    if (category !== "all") {
      const cleanCategory = category.replace(/-/g, ' ');
      whereClause.title = { contains: cleanCategory, mode: "insensitive" };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        freelancerProjects: {
          where: { status: "COMPLETED" },
          select: { id: true }
        },
        _count: {
          select: { freelancerProjects: true }
        }
      },
      take: 20,
    });

    const formattedTalents: TalentResponse[] = users.map((user) => {
      const calculatedRating = 4.5 + (Math.random() * 0.5);
      const mockHourly = Math.floor(Math.random() * (300 - 50) + 50) * 1000;

      const completedCount = user.freelancerProjects.length;

      return {
        id: user.id,
        name: user.username || "Freelancer",
        title: user.title || "Freelancer",
        avatar: user.username ? user.username.charAt(0).toUpperCase() : "U",
        rating: Number(calculatedRating.toFixed(1)),
        reviews: Math.floor(Math.random() * 100),
        location: user.location || "Indonesia",
        hourlyRate: `Rp ${new Intl.NumberFormat('id-ID').format(mockHourly)}`,
        skills: user.skills || [],
        completedProjects: completedCount,
        description: user.bio || "No description provided.",
        availability: 'available'
      };
    });

    return NextResponse.json({
      code: 200,
      message: "Success",
      data: formattedTalents
    });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}