"use client";

import { useMemo, useState } from "react";
import { fillMatrixToSize, glyphArrayToString } from "@/utils";

export interface PixelMatchType {
  size?: [number, number]; // Now a tuple: [rows, cols]
  onChange?: (glyph: boolean[][], lastCheckedCoords: [number, number]) => void; // Callback when the glyph changes, client function !!
  defaultGlyph?: boolean[][]; // May be not a square
  locked?: boolean;
  name?: string;
  coords?: [number, number];
  lastCheckedCoords?: [number, number]; // New prop
}

export default function PixelMatch({
  size,
  onChange,
  defaultGlyph,
  locked = false,
  name,
  coords = [0, 0],
  lastCheckedCoords,
}: PixelMatchType) {
  if (!size && defaultGlyph && defaultGlyph.length > 0)
    size = [defaultGlyph.length, defaultGlyph[0].length];
  else if (!size) size = [29, 29];
  size[0] = Math.max(size[0], 1);
  size[1] = Math.max(size[1], 1);

  const glyph = useMemo(
    () => fillMatrixToSize(defaultGlyph ?? [], size, coords),
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
        /**
         * We use setTimeout here to avoid a React state update conflict between
         * parent and child components. The issue occurs because:
         * 1. This function updates local state with setCurrentPattern
         * 2. It then needs to notify the parent via onChange callback
         * 3. The parent (GlyphMatch) updates its own state immediately
         *
         * This creates a situation where we're updating state in a parent component
         * while the child is still rendering (forbidden in React's concurrent mode).
         *
         * By wrapping the onChange callback in setTimeout, we defer it to the next
         * event loop tick, ensuring that:
         * 1. The current render cycle completes first
         * 2. The local state update is processed
         * 3. Only then the parent's state update is triggered
         *
         **/
        setTimeout(() => {
          onChange(newPattern, [rowIndex, colIndex]);
        }, 0);
      }

      return newPattern;
    });
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "0.25rem",
        gridTemplateColumns: `repeat(${size[1]}, 1fr)`,
        width: `100%`,
        margin: "0 auto",
      }}
    >
      {currentPattern.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isLastChecked =
            lastCheckedCoords &&
            rowIndex === lastCheckedCoords[0] &&
            colIndex === lastCheckedCoords[1];

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                height: "auto",
                border: "1px solid #d1d5db",
                backgroundColor: isLastChecked
                  ? "rgba(128, 128, 128, 0.8)"
                  : cell
                  ? "rgba(0, 0, 0, 0.8)"
                  : locked
                  ? "transparent"
                  : "rgba(255, 255, 255, 0.8)",
                cursor: locked ? "default" : "pointer",
                transition: "background-color 150ms",
                aspectRatio: "1 / 1",
              }}
              data-name={`cell-${rowIndex}-${colIndex}`}
              onClick={() => toggleCell(rowIndex, colIndex)}
            />
          );
        })
      )}
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
