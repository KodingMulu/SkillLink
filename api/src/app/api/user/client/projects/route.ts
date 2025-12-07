import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
     const data = await req.json();

     const project = await prisma.project.create({
          data: {
               clientId: data.clientId,
               title: data.title,
               description: data.description,
      budget: data.budget
      duration: data.duration,
      skills: data.skills,
      deadline: data.deadline,
      attachmentUrl: data.attachmentUrl,
      status: "OPEN",
          }
     })

     return NextResponse.json(project)
}