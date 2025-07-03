"use client";

import { useMemo, useState } from "react";
import { glyphArrayToString } from "@/utils";

export interface PixelMatchType {
  size?: number;
  onChange?: (glyph: boolean[][]) => void;
  defaultGlyph?: boolean[][]; // May be not a square
  locked?: boolean;
  name?: string;
  coords?: [number, number];
}

export default function PixelMatch({
  size = 29,
  onChange,
  defaultGlyph = [],
  locked = false,
  name,
  coords,
}: PixelMatchType) {
  const glyph = useMemo(
    () => fillMatrixToSize(defaultGlyph, size, coords),
    [defaultGlyph, size, coords]
  );
  const [currentPattern, setCurrentPattern] = useState<boolean[][]>(() => {
    if (glyph.length > 0) {
      return glyph;
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

export function fillMatrixToSize(
  matrix: boolean[][],
  size: number,
  coords: [number, number] | undefined
) {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return Array.from({ length: size }, () => Array(size).fill(false));
  }
  const mRows = matrix.length;
  const mCols = matrix[0].length;
  // Calculate top/left padding to center the matrix
  const padTop = Math.floor((size - mRows) / 2);
  const padLeft = Math.floor((size - mCols) / 2);

  const newMatrix = Array.from({ length: size }, () => Array(size).fill(false));
  for (let i = 0; i < mRows; i++) {
    for (let j = 0; j < mCols; j++) {
      const ni = i + padTop;
      const nj = j + padLeft;
      if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
        newMatrix[ni][nj] = matrix[i][j];
      }
    }
  }
  return newMatrix;
}
