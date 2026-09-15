import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing or invalid", code: 401 },
        { status: 401 }
      );
    }
    if (user.role !== "FREELANCER") {
      return NextResponse.json(
        { message: "Forbidden: Freelancer access only", code: 403 },
        { status: 403 }
      );
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

    return NextResponse.json(
      { message: "Success", code: 200, data: formattedPortfolios },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PORTFOLIO_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing or invalid", code: 401 },
        { status: 401 }
      );
    }
    if (user.role !== "FREELANCER") {
      return NextResponse.json(
        { message: "Forbidden: Freelancer access only", code: 403 },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, category, image, description } = body;

    if (!title || !category) {
      return NextResponse.json(
        { message: "Judul dan kategori portofolio wajib diisi", code: 400 },
        { status: 400 }
      );
    }

    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description: description || "",
        image: image || null,
        tags: [category],
        userId: user.id
      }
    });

    return NextResponse.json(
      { message: "Portfolio created successfully", code: 201, data: newPortfolio },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PORTFOLIO_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}