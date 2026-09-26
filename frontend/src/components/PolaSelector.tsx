"use client";

import { DAFTAR_POLA } from "@/data/pola";
import { PolaTarget } from "@/types";

interface PolaSelectorProps {
  selected: PolaTarget;
  onChange: (pola: PolaTarget) => void;
  disabled?: boolean;
}

export default function PolaSelector({ selected, onChange, disabled }: PolaSelectorProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="pola-select"
        className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider"
      >
        🎯 Pilih Tantangan Latihan
      </label>
      <div className="relative">
        <select
          id="pola-select"
          value={selected.id}
          onChange={(e) => {
            const pola = DAFTAR_POLA.find((p) => p.id === e.target.value);
            if (pola && pola.aktif) onChange(pola);
          }}
          disabled={disabled}
          className="w-full appearance-none bg-white border-3 border-blue-200 rounded-2xl
                     px-5 py-4 pr-12 text-lg font-semibold text-blue-900
                     focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200 cursor-pointer
                     shadow-sm hover:border-blue-300"
          style={{ borderWidth: "3px" }}
        >
          {DAFTAR_POLA.map((pola) => (
            <option key={pola.id} value={pola.id} disabled={!pola.aktif}>
              {pola.emoji} {pola.nama}
              {!pola.aktif ? " (Segera hadir)" : ""}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Deskripsi pola yang dipilih */}
      <p className="mt-2 text-sm text-gray-500 italic pl-1">
        {selected.deskripsi_singkat}
      </p>
    </div>
  );
}
