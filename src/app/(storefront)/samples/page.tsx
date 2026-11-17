"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SamplesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-center p-6 font-mono text-xs text-candela-secondary">
      Redirecting to Surface &amp; Stone Catalogue...
    </div>
  );
}
