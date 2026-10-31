import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const { publicId, resourceType } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
      invalidate: true,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 502 }
    );
  }
}
