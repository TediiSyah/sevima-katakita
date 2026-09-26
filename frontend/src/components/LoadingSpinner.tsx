"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Membuat soal latihan baru...",
}: LoadingSpinnerProps) {
  return (
    <div className="card text-center py-12 animate-fade-in">
      {/* Animated mascot */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="text-6xl animate-bounce">🤖</div>
          <div className="absolute -top-2 -right-2 text-2xl floating">✨</div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex justify-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
            style={{
              animation: `bounce 0.8s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-gray-600 text-lg font-semibold">{message}</p>
      <p className="text-gray-400 text-sm mt-2">
        AI sedang menyiapkan soal latihan yang variatif...
      </p>
    </div>
  );
}
