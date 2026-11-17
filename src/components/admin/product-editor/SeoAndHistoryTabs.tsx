"use client";

import React from "react";
import { AdminProduct } from "@/types";

interface Props {
  product: AdminProduct;
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>;
}

export function SeoMetaTab({ product, setProduct }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
          Canonical URL Slug
        </label>
        <input
          type="text"
          value={product.slug}
          onChange={(e) => setProduct({ ...product, slug: e.target.value })}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#9E7B47] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase text-gray-500 mb-1">
          Meta Title
        </label>
        <input
          type="text"
          value={`${product.name} | Candela Tiles & Marbles`}
          disabled
          className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-mono text-gray-500"
        />
      </div>
    </div>
  );
}

export function VersionHistoryTab({ product, setProduct }: Props) {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-sm">
        <h3 className="font-heading text-sm font-semibold text-gray-900">
          Audit Snapshot &amp; Revision Log
        </h3>
        <p className="text-xs text-gray-500 font-light">
          Every product edit creates an auditable version that can be reviewed.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {product.versions?.map((v) => (
          <div key={v.version} className="py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#9E7B47]">
                  Version {v.version}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {new Date(v.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{v.summary}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Restore Version ${v.version}?`)) {
                  setProduct((prev) => ({ ...prev, ...v.snapshot }));
                }
              }}
              className="font-mono text-[11px] text-[#9E7B47] hover:underline border border-[#9E7B47]/30 px-2.5 py-1 rounded"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
