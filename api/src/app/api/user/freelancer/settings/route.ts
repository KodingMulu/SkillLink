import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userAuth.id },
      include: {
        wallet: true 
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found", code: 404 }, { status: 404 });
    }

    return NextResponse.json({
      message: "Success fetching settings",
      code: 200,
      data: {
        name: user.username || "",
        email: user.email,
        title: user.title || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        skills: user.skills || [],
        wallet: {
          balance: user.wallet?.balance || 0,
          bankName: user.wallet?.bankName || "-",
          accountNumber: user.wallet?.accountNumber || "-",
          accountHolder: user.wallet?.accountHolder || user.username || "-",
        }
      }
    });

  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, bio, phone, location, skills } = body;

    await prisma.user.update({
      where: { id: userAuth.id },
      data: {
        username: name,
        title: title,
        bio: bio,
        phone: phone,
        location: location,
        skills: skills
      }
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      code: 200
    });

  } catch (error) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}