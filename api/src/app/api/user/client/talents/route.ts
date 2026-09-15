import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { getAuthUser } from "@/lib/server-auth";

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
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing or invalid", code: 401 },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

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

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
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
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const formattedTalents: TalentResponse[] = users.map((u) => {
      const calculatedRating = 4.5 + (Math.random() * 0.5);
      const mockHourly = Math.floor(Math.random() * (300 - 50) + 50) * 1000;

      const completedCount = u.freelancerProjects.length;

      return {
        id: u.id,
        name: u.username || "Freelancer",
        title: u.title || "Freelancer",
        avatar: u.username ? u.username.charAt(0).toUpperCase() : "U",
        rating: Number(calculatedRating.toFixed(1)),
        reviews: Math.floor(Math.random() * 100),
        location: u.location || "Indonesia",
        hourlyRate: `Rp ${new Intl.NumberFormat('id-ID').format(mockHourly)}`,
        skills: u.skills || [],
        completedProjects: completedCount,
        description: u.bio || "No description provided.",
        availability: 'available'
      };
    });

    return NextResponse.json(
      {
        message: "Success",
        code: 200,
        data: formattedTalents,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          limit
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET_TALENTS_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}