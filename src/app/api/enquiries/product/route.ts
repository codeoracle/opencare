import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/apiErrors";
import { isBot, recordLead } from "@/lib/leads";
import { Product } from "@/models/Product";

const schema = z.object({
  productSlug: z.string().min(1),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6),
  quantity: z.coerce.number().int().min(1).max(1_000_000),
  deliveryAddress: z.string().trim().max(1000).optional(),
  message: z.string().trim().max(5000).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (isBot(json)) return NextResponse.json({ ok: true });
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    return await recordLead(req, async (tenant) => {
      const product = await Product.findOne({
        tenant: tenant._id,
        slug: parsed.data.productSlug,
        isActive: true,
      }).select("_id name");
      if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

      const { productSlug: _slug, ...rest } = parsed.data;
      void _slug;
      return { ...rest, type: "enquiry" as const, product: product._id, productName: product.name };
    });
  } catch (err) {
    return apiErrorResponse(err, "Failed to submit enquiry.");
  }
}
