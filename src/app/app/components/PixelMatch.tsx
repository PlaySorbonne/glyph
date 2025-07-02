import { useState, useEffect } from "react";
import { set } from "zod";

export interface PixelMatchType {
  inputMode: boolean;
  size?: number;
  onChange?: (glyph: boolean[][]) => void;
  defaultGlyph?: boolean[][];
  locked?: boolean;
}

export default function PixelMatch({
  inputMode,
  size = 29,
  onChange,
  defaultGlyph = [],
  locked = false,
}: PixelMatchType) {

  const [currentPattern, setCurrentPattern] = useState<boolean[][]>(() => {
    if (defaultGlyph.length > 0) {
      return defaultGlyph;
    }
    return Array.from({ length: size }, () => Array(size).fill(false));
  });
  const toggleCell = (index: number) => {
    setCurrentPattern((prev) => {
      const newPattern = [...prev];
      const row = Math.floor(index / size);
      const col = index % size;
      newPattern[row][col] = !newPattern[row][col];

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
        className="pixel-grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: `${size * 20}px`,
        }}
      >
        {currentPattern.map((active, index) => (
          <div
            key={index}
            className={`pixel-cell ${active ? "active" : ""}`}
            onClick={() => toggleCell(index)}
          />
        ))}
      </div>
    </div>
  );
}
