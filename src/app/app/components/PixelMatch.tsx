"use client";

import { useMemo, useState } from "react";
import { glyphArrayToString } from "@/utils";

export interface PixelMatchType {
  size?: [number, number]; // Now a tuple: [rows, cols]
  onChange?: (glyph: boolean[][]) => void;
  defaultGlyph?: boolean[][]; // May be not a square
  locked?: boolean;
  name?: string;
  coords?: [number, number];
}

export default function PixelMatch({
  size,
  onChange,
  defaultGlyph = [],
  locked = false,
  name,
  coords,
}: PixelMatchType) {
  if (!size && defaultGlyph.length > 0)
    size = [defaultGlyph.length, defaultGlyph[0].length];
  else if (!size) size = [29, 29]; // Default size if not provided
  const glyph = useMemo(
    () => fillMatrixToSize(defaultGlyph, size, coords),
    [defaultGlyph, size, coords]
  );
  const [currentPattern, setCurrentPattern] = useState<boolean[][]>(() => {
    if (glyph.length > 0) {
      return glyph;
    }
    return Array.from({ length: size[0] }, () => Array(size[1]).fill(false));
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
          gridTemplateColumns: `repeat(${size[0]}, 1fr)`,
          width: `${size[1] * 20}px`,
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

export function fillMatrixToSize(
  matrix: boolean[][],
  size: [number, number],
  coords = [0, 0] as [number, number]
) {
  const [rows, cols] = size;
  if (matrix.length === 0 || matrix[0].length === 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(false));
  }
  const mRows = matrix.length;
  const mCols = matrix[0].length;

  const newMatrix = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let i = 0; i < mRows; i++) {
    for (let j = 0; j < mCols; j++) {
      const ni = i + coords[0];
      const nj = j + coords[1];
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
        newMatrix[ni][nj] = matrix[i][j];
      }
    }
  }
  return newMatrix;
}
