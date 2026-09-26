"use client";

import React from "react";

export default function LoadingSpinner({ message = "Sedang memuat..." }: { message?: string }) {
  return (
    <div className="card py-12 text-center animate-fade-in">
      {/* Spinner Biru */}
      <div className="flex justify-center mb-5">
        <div className="relative w-16 h-16">
          <div
            className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl floating">
            🤖
          </div>
        </div>
      </div>

      <p className="text-blue-700 font-bold text-base">{message}</p>
      <p className="text-gray-400 text-sm mt-1">Ini hanya sebentar, sabar ya!</p>

      {/* Animated dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
