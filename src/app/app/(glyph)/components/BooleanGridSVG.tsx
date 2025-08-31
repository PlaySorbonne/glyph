import React from "react";

export function BooleanGridSVG({
  grid,
  color = "currentColor",
  className,
  style,
  width,
  height,
}: {
  grid: boolean[][];
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}) {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${cols} ${rows}`}
      className={className}
      style={style}
      width={width}
      height={height}
    >
      {grid.map((row, y) =>
        row.map(
          (cell, x) =>
            cell && (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            )
        )
      )}
    </svg>
  );
}

export default BooleanGridSVG;
