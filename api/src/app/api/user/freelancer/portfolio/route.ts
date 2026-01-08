import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "FREELANCER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const formattedPortfolios = portfolios.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.tags[0] || "Uncategorized",
      image: p.image || "https://via.placeholder.com/500",
      description: p.description
    }));

    return NextResponse.json({ data: formattedPortfolios }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "FREELANCER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, category, image, description } = body;

    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description: description || "",
        image,
        tags: [category],
        userId: user.id
      }
    });

    return NextResponse.json({ data: newPortfolio }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}