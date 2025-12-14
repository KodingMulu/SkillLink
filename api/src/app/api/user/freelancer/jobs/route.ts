import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const userAuth = getAuthUser(req);
    if (!userAuth) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: userAuth.id },
      select: { skills: true },
    });
    const userSkills = userData?.skills || [];

    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN",
        proposals: {
          none: {
            freelancerId: userAuth.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const recommendedJobs = jobs.map((job) => {
      const matchingTags = job.tags.filter((tag) => userSkills.includes(tag));
      const matchScore = matchingTags.length;

      return {
        ...job,
        matchScore,
        isRecommended: matchScore > 0,
      };
    });

    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      message: "Success fetching job feed",
      code: 200,
      data: recommendedJobs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}