import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Admin } from "@/models/Admin";
import { createToken, hashPassword, setAuthCookieOnResponse, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const email = parsed.data.email.toLowerCase();

    // First-run bootstrap: when no admin exists yet, the ADMIN_EMAIL / ADMIN_PASSWORD
    // environment variables create the first account on its first successful login.
    if ((await Admin.estimatedDocumentCount()) === 0) {
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && envPassword.length >= 8 && email === envEmail && parsed.data.password === envPassword) {
        await Admin.create({ email, name: "Admin", password: await hashPassword(envPassword) });
      }
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = await verifyPassword(parsed.data.password, admin.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createToken({ id: admin._id.toString(), email: admin.email });

    const res = NextResponse.json({ ok: true });
    setAuthCookieOnResponse(res, token);
    return res;
  } catch (err) {
    return apiErrorResponse(err, "Login failed.");
  }
}

