"use client";

import { useState, useEffect, useMemo } from "react";

// Type pour les données d'un glyph
interface GlyphData {
  quest_title: string;
  glyph: boolean[][];
  found_on: Date | string;
  id: number;
  coords?: [number, number];
  [key: string]: any;
}

interface GlyphGalleryProps {
  glyphs: (GlyphData | null)[];
  highlight?: number;
}

// Fonction pour placer un glyph dans la grille 29x29
function placeGlyphInGrid(
  grid: (number | null)[][],
  glyph: boolean[][],
  glyphId: number,
  coords: [number, number] = [0, 0]
): (number | null)[][] {
  const newGrid = grid.map((row) => [...row]);
  const [startRow, startCol] = coords;

  for (let i = 0; i < glyph.length; i++) {
    for (let j = 0; j < glyph[i].length; j++) {
      const gridRow = startRow + i;
      const gridCol = startCol + j;

      if (gridRow >= 0 && gridRow < 29 && gridCol >= 0 && gridCol < 29) {
        if (glyph[i][j]) {
          newGrid[gridRow][gridCol] = glyphId;
        }
      }
    }
  }

  return newGrid;
}

// Composant pour afficher la grille composite
function CompositeGlyphDisplay({
  glyphs,
  highlightedId,
  onCellClick,
}: {
  glyphs: GlyphData[];
  highlightedId?: number;
  onCellClick: (glyphId: number) => void;
}) {
  const compositeGrid = useMemo(() => {
    let grid: (number | null)[][] = Array.from({ length: 29 }, () =>
      Array(29).fill(null)
    );

    glyphs.forEach((glyphData) => {
      grid = placeGlyphInGrid(
        grid,
        glyphData.glyph,
        glyphData.id,
        glyphData.coords || [0, 0]
      );
    });

    return grid;
  }, [glyphs]);

  return (
    <div className="composite-grid-container">
      <div className="composite-grid">
        {compositeGrid.map((row, rowIndex) =>
          row.map((glyphId, colIndex) => {
            const isHighlighted = glyphId === highlightedId;
            const hasGlyph = glyphId !== null;
            const glyphData =
              glyphId !== null ? glyphs.find((g) => g.id === glyphId) : null;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${hasGlyph ? "has-glyph" : ""} ${
                  isHighlighted ? "highlighted" : ""
                }`}
                onClick={() => {
                  if (glyphId !== null) {
                    onCellClick(glyphId);
                  }
                }}
                title={glyphData ? glyphData.quest_title : ""}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// Composant pour la liste des glyphs
function GlyphList({
  glyphs,
  highlightedId,
  onGlyphSelect,
}: {
  glyphs: GlyphData[];
  highlightedId?: number;
  onGlyphSelect: (glyph: GlyphData) => void;
}) {
  return (
    <div className="glyph-list-container">
      <h3 className="glyph-list-title">Glyphs collectés ({glyphs.length})</h3>
      <div className="glyph-list">
        {glyphs.map((glyphData, i) => {
          const isHighlighted = glyphData.id === highlightedId;
          return (
            <div
              key={i}
              onClick={() => onGlyphSelect(glyphData)}
              className={`glyph-item ${isHighlighted ? "highlighted" : ""}`}
            >
              <div className="glyph-item-title">{glyphData.quest_title}</div>
              <div className="glyph-item-meta">
                ID: #{glyphData.id} | Position: [{glyphData.coords?.[0] ?? 0},{" "}
                {glyphData.coords?.[1] ?? 0}]
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant modal pour afficher les détails
function GlyphModal({
  glyphData,
  onClose,
}: {
  glyphData: GlyphData | null;
  onClose: () => void;
}) {
  if (!glyphData) return null;

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{glyphData.quest_title}</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-glyph-display">
          <div
            className="modal-glyph-grid"
            style={{
              gridTemplateColumns: `repeat(${
                glyphData.glyph[0]?.length || 1
              }, 1fr)`,
            }}
          >
            {glyphData.glyph.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`modal-grid-cell ${cell ? "active" : ""}`}
                />
              ))
            )}
          </div>
        </div>

        <div className="modal-details">
          <div className="detail-item">
            <strong>ID de la quête :</strong> #{glyphData.id}
          </div>
          <div className="detail-item">
            <strong>Position dans la grille :</strong> [
            {glyphData.coords?.[0] ?? 0}, {glyphData.coords?.[1] ?? 0}]
          </div>
          <div className="detail-item">
            <strong>Trouvé le :</strong> {formatDate(glyphData.found_on)}
          </div>

          {Object.keys(glyphData).map((key) => {
            if (
              !["quest_title", "glyph", "found_on", "id", "coords"].includes(
                key
              )
            ) {
              return (
                <div key={key} className="detail-item">
                  <strong className="detail-label">
                    {key.replace(/_/g, " ")} :
                  </strong>{" "}
                  {String(glyphData[key])}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// Composant principal GlyphGallery
export default function GlyphGallery({ glyphs, highlight }: GlyphGalleryProps) {
  const [selectedGlyph, setSelectedGlyph] = useState<GlyphData | null>(null);
  const [hoveredGlyphId, setHoveredGlyphId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  let filteredGlyphs = glyphs.filter((g): g is GlyphData => g !== null);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!glyphs || glyphs.length === 0) {
    return (
      <div className="empty-state">
        Aucun glyph à afficher
      </div>
    );
  }

  const handleCellClick = (glyphId: number) => {
    const glyph = filteredGlyphs.find((g) => g.id === glyphId);
    if (glyph) {
      setSelectedGlyph(glyph);
    }
  };

  const handleGlyphSelect = (glyph: GlyphData) => {
    setSelectedGlyph(glyph);
    setHoveredGlyphId(glyph.id);
    setTimeout(() => setHoveredGlyphId(null), 2000);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .gallery-container {
          display: flex;
          gap: 20px;
          padding: 20px;
          align-items: flex-start;
          justify-content: flex-start;
          min-height: 100vh;
        }

        /* Container de la grille composite */
        .composite-grid-container {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .composite-grid {
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(29, 1fr);
          width: min(90vw, 60vh, 600px);
          height: min(90vw, 60vh, 600px);
          background-color: #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Cellules de la grille */
        .grid-cell {
          background-color: #f8f9fa;
          aspect-ratio: 1 / 1;
          transition: all 0.2s ease;
        }

        .grid-cell.has-glyph {
          background-color: #2c3e50;
          cursor: pointer;
          border: 0.5px solid rgba(0, 0, 0, 0.1);
        }

        .grid-cell.has-glyph:hover:not(.highlighted) {
          background-color: #34495e;
          transform: scale(1.1);
        }

        .grid-cell.highlighted {
          background-color: #3498db !important;
          animation: pulse 1s infinite;
        }

        /* Liste des glyphs */
        .glyph-list-container {
          flex: 1;
          max-width: 400px;
          min-width: 300px;
          max-height: 70vh;
          overflow-y: auto;
          padding: 10px;
          border-radius: 8px;
        }

        .glyph-list-title {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 20px;
        }

        .glyph-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .glyph-item {
          padding: 10px;
          background-color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #ddd;
        }

        .glyph-item:hover:not(.highlighted) {
          background-color: #f0f0f0;
        }

        .glyph-item.highlighted {
          background-color: #e3f2fd;
          border: 2px solid #3498db;
          animation: pulse 1s infinite;
        }

        .glyph-item-title {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .glyph-item-meta {
          font-size: 12px;
          color: #7f8c8d;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
        }

        .modal-title {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
          line-height: 1.2;
          padding-right: 10px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #7f8c8d;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #2c3e50;
        }

        .modal-glyph-display {
          margin-bottom: 20px;
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }

        .modal-glyph-grid {
          display: grid;
          gap: 1px;
          width: 200px;
          margin: 0 auto;
        }

        .modal-grid-cell {
          background-color: #ecf0f1;
          aspect-ratio: 1 / 1;
        }

        .modal-grid-cell.active {
          background-color: #2c3e50;
        }

        .modal-details {
          color: #34495e;
          font-size: 16px;
        }

        .detail-item {
          margin-bottom: 12px;
        }

        .detail-item strong {
          color: #2c3e50;
        }

        .detail-label {
          text-transform: capitalize;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .gallery-container {
            flex-direction: column;
            align-items: center;
            padding: 10px;
          }

          .composite-grid-container {
            order: 2;
          }

          .composite-grid {
            width: min(90vw, 40vh, 400px);
            height: min(90vw, 40vh, 400px);
          }

          .glyph-list-container {
            order: 1;
            width: 100%;
            max-width: 100%;
            min-width: unset;
            max-height: 40vh;
          }

          .glyph-list-title {
            font-size: 18px;
          }

          .glyph-item {
            padding: 8px;
          }

          .glyph-item-title {
            font-size: 14px;
          }

          .glyph-item-meta {
            font-size: 11px;
          }

          .modal-content {
            padding: 16px;
          }

          .modal-title {
            font-size: 20px;
          }

          .modal-close {
            font-size: 20px;
          }

          .modal-glyph-grid {
            width: 150px;
          }

          .modal-details {
            font-size: 14px;
          }

          .modal-overlay {
            padding: 10px;
          }
        }
      `}</style>

      <div className="gallery-container">
        <CompositeGlyphDisplay
          glyphs={filteredGlyphs}
          highlightedId={highlight || hoveredGlyphId || undefined}
          onCellClick={handleCellClick}
        />

        <GlyphList
          glyphs={filteredGlyphs}
          highlightedId={highlight || hoveredGlyphId || undefined}
          onGlyphSelect={handleGlyphSelect}
        />
      </div>

      {mounted && (
        <GlyphModal
          glyphData={selectedGlyph}
          onClose={() => setSelectedGlyph(null)}
        />
      )}
    </>
  );
}