import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, reportData, aiSummary } = body;

    if (!email || !reportData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const audit = await prisma.audit.create({
      data: {
        email,
        reportData: JSON.stringify(reportData),
        aiSummary: aiSummary || null,
      },
    });

    return NextResponse.json({ success: true, id: audit.id });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
