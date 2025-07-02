"use client";

import { useState } from "react";
import { glyphArrayToString } from "@/utils";

export interface PixelMatchType {
  inputMode: boolean;
  size?: number;
  onChange?: (glyph: boolean[][]) => void;
  defaultGlyph?: boolean[][];
  locked?: boolean;
  name?: string;
}

export default function PixelMatch({
  inputMode,
  size = 29,
  onChange,
  defaultGlyph = [],
  locked = false,
  name,
}: PixelMatchType) {
  const [currentPattern, setCurrentPattern] = useState<boolean[][]>(() => {
    if (defaultGlyph.length > 0) {
      return defaultGlyph;
    }
    return Array.from({ length: size }, () => Array(size).fill(false));
  });

  const toggleCell = (rowIndex: number, colIndex: number) => {
    if (locked) return;
    setCurrentPattern((prev) => {
      const newPattern = prev.map((row) => [...row]);
      newPattern[rowIndex][colIndex] = !newPattern[rowIndex][colIndex];
      if (onChange) {
        onChange(newPattern);
      }
      return newPattern;
    });
  };

  return (
    <div className="text-center">
      <h3 className="text-sm font-medium mb-2">Votre motif</h3>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: `${size * 20}px`,
          margin: "0 auto",
        }}
      >
        {currentPattern.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-5 h-5 border ${
                cell ? "bg-black" : "bg-white"
              } cursor-pointer transition-colors duration-150`}
              onClick={() => toggleCell(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      {name && (
        <input
          type="hidden"
          name={name}
          value={glyphArrayToString(currentPattern)}
        />
      )}
    </div>
  );
}
