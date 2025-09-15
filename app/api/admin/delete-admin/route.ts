// app/api/admin/delete-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDeleteAdmin } from "@/app/data/admin/admin-delete-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ status: "error", message: "Missing admin ID" });
    }

    const result = await adminDeleteAdmin(id);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: "Unexpected server error" });
  }
}
