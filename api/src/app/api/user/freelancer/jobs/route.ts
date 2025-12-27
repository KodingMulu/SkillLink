import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";
import { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";
    const category = searchParams.get("category") || "Semua";

    const userData = await prisma.user.findUnique({
      where: { id: userAuth.id },
      select: { skills: true },
    });
    const userSkills = userData?.skills || [];

    const whereClause: Prisma.JobWhereInput = {
      status: "OPEN",
      proposals: {
        none: {
          freelancerId: userAuth.id,
        },
      },
    };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (category !== "Semua") {
      whereClause.tags = { has: category };
    }

    const [jobs, totalApplied, pendingResponse] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" }, 
        take: 20,
        include: {
          client: {
            select: {
              username: true, 
            }
          },
          _count: { 
            select: { proposals: true } 
          }
        }
      }),

      prisma.proposal.count({
        where: { freelancerId: userAuth.id }
      }),

      prisma.proposal.count({
        where: { 
          freelancerId: userAuth.id,
          status: "PENDING"
        }
      })
    ]);

    const formattedJobs = jobs.map((job) => {
      const matchingTags = job.tags.filter((tag) => userSkills.includes(tag));
      const matchScore = matchingTags.length;

      return {
        id: job.id,
        title: job.title,
        description: job.description,
        budget: job.budget, 
        tags: job.tags,
        companyName: job.client.username || "Klien Terverifikasi",
        applicantCount: job._count.proposals,
        createdAt: job.createdAt,
        matchScore,
        isRecommended: matchScore > 0,
      };
    });

    formattedJobs.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      message: "Success fetching job feed",
      code: 200,
      data: {
        jobs: formattedJobs,
        stats: {
          applied: totalApplied, 
          pending: pendingResponse
        }
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}