import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Preview() {
  const [path, setPath] = useState("/");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const src = `${origin}${path.startsWith("/") ? path : `/${path}`}`;

  return (
    <div className="min-h-screen page-cream">
      <Header />

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl font-black mb-4">Preview Window</h1>

          <div className="flex gap-2 mb-4">
            <input
              aria-label="preview-path"
              className="flex-1 p-2 border rounded"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
            <button
              onClick={() => (window.location.hash = `#/preview?load=${encodeURIComponent(path)}`)}
              className="px-4 py-2 bg-[#2458a0] text-white rounded font-bold"
            >
              Load
            </button>
          </div>

          <div className="border rounded overflow-hidden" style={{ height: "70vh" }}>
            <iframe src={src} title="app-preview" style={{ width: "100%", height: "100%", border: 0 }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
