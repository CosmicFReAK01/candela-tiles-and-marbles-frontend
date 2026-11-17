import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_FILTERS_CONFIG } from "@/lib/catalogue-taxonomy";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const categoryKey = params.category.toLowerCase();
  const filters = CATEGORY_FILTERS_CONFIG[categoryKey] || CATEGORY_FILTERS_CONFIG["tiles"];

  return NextResponse.json({
    category: params.category,
    filters,
  });
}
