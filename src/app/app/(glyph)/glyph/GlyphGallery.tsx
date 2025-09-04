"use client";

import { useState, useEffect, useMemo } from "react";

// Type pour les données d'un glyph
interface GlyphData {
  quest_title: string;
  glyph: boolean[][];
  found_on: Date | string;
  id: number;
  coords?: [number, number]; // Position dans la grille 29x29
  [key: string]: any; // Pour d'autres propriétés optionnelles
}

interface GlyphGalleryProps {
  glyphs: GlyphData[];
  highlight?: number; // ID du glyph à faire clignoter
}

// Fonction pour placer un glyph dans la grille 29x29 à des coordonnées spécifiques
function placeGlyphInGrid(
  grid: (number | null)[][],
  glyph: boolean[][],
  glyphId: number,
  coords: [number, number] = [0, 0]
): (number | null)[][] {
  const newGrid = grid.map(row => [...row]);
  const [startRow, startCol] = coords;
  
  for (let i = 0; i < glyph.length; i++) {
    for (let j = 0; j < glyph[i].length; j++) {
      const gridRow = startRow + i;
      const gridCol = startCol + j;
      
      // Vérifier que nous sommes dans les limites de la grille 29x29
      if (gridRow >= 0 && gridRow < 29 && gridCol >= 0 && gridCol < 29) {
        if (glyph[i][j]) {
          // Si la cellule est active, on place l'ID du glyph
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
  onCellClick
}: {
  glyphs: GlyphData[];
  highlightedId?: number;
  onCellClick: (glyphId: number) => void;
}) {
  // Créer la grille composite avec tous les glyphs superposés
  const compositeGrid = useMemo(() => {
    // Initialiser une grille 29x29 vide (null = pas de glyph)
    let grid: (number | null)[][] = Array.from(
      { length: 29 }, 
      () => Array(29).fill(null)
    );
    
    // Placer chaque glyph dans la grille
    // On traite les glyphs dans l'ordre pour que les derniers soient "au-dessus"
    glyphs.forEach(glyphData => {
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
    <div
      style={{
        display: 'grid',
        gap: '1px',
        gridTemplateColumns: `repeat(29, 1fr)`,
        width: '580px',
        height: '580px',
        margin: '0 auto',
        backgroundColor: '#e0e0e0',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {compositeGrid.map((row, rowIndex) =>
        row.map((glyphId, colIndex) => {
          const isHighlighted = glyphId === highlightedId;
          const hasGlyph = glyphId !== null;
          
          // Trouver le glyph correspondant pour obtenir sa couleur/style
          const glyphData = glyphId !== null 
            ? glyphs.find(g => g.id === glyphId) 
            : null;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: hasGlyph 
                  ? (isHighlighted ? '#3498db' : '#2c3e50')
                  : '#f8f9fa',
                aspectRatio: '1 / 1',
                cursor: hasGlyph ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                animation: isHighlighted ? 'pulse 1s infinite' : 'none',
                border: hasGlyph ? '0.5px solid rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => {
                if (glyphId !== null) {
                  onCellClick(glyphId);
                }
              }}
              onMouseEnter={(e) => {
                if (hasGlyph && !isHighlighted) {
                  e.currentTarget.style.backgroundColor = '#34495e';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (hasGlyph && !isHighlighted) {
                  e.currentTarget.style.backgroundColor = '#2c3e50';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title={glyphData ? glyphData.quest_title : ''}
            />
          );
        })
      )}
    </div>
  );
}

// Composant pour la liste des glyphs sur le côté
function GlyphList({ 
  glyphs,
  highlightedId,
  onGlyphSelect
}: {
  glyphs: GlyphData[];
  highlightedId?: number;
  onGlyphSelect: (glyph: GlyphData) => void;
}) {
  return (
    <div style={{
      maxHeight: '580px',
      overflowY: 'auto',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>
        Glyphs collectés ({glyphs.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {glyphs.map(glyphData => {
          const isHighlighted = glyphData.id === highlightedId;
          return (
            <div
              key={glyphData.id}
              onClick={() => onGlyphSelect(glyphData)}
              style={{
                padding: '10px',
                backgroundColor: isHighlighted ? '#e3f2fd' : 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isHighlighted ? '2px solid #3498db' : '1px solid #ddd',
                animation: isHighlighted ? 'pulse 1s infinite' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isHighlighted) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isHighlighted) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' }}>
                {glyphData.quest_title}
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                ID: #{glyphData.id} | Position: [{glyphData.coords?.[0] ?? 0}, {glyphData.coords?.[1] ?? 0}]
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
  onClose
}: {
  glyphData: GlyphData | null;
  onClose: () => void;
}) {
  if (!glyphData) return null;

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>
            {glyphData.quest_title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#7f8c8d',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7f8c8d'}
          >
            ×
          </button>
        </div>

        {/* Afficher le glyph individuel */}
        <div style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <div
            style={{
              display: 'grid',
              gap: '1px',
              gridTemplateColumns: `repeat(${glyphData.glyph[0]?.length || 1}, 1fr)`,
              width: '200px',
              margin: '0 auto',
            }}
          >
            {glyphData.glyph.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    backgroundColor: cell ? '#2c3e50' : '#ecf0f1',
                    aspectRatio: '1 / 1',
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div style={{ color: '#34495e' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#2c3e50' }}>ID de la quête :</strong> #{glyphData.id}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#2c3e50' }}>Position dans la grille :</strong> [{glyphData.coords?.[0] ?? 0}, {glyphData.coords?.[1] ?? 0}]
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#2c3e50' }}>Trouvé le :</strong> {formatDate(glyphData.found_on)}
          </div>
          
          {/* Afficher d'autres propriétés si elles existent */}
          {Object.keys(glyphData).map(key => {
            if (!['quest_title', 'glyph', 'found_on', 'id', 'coords'].includes(key)) {
              return (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#2c3e50', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')} :
                  </strong> {String(glyphData[key])}
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

  // Injection des styles pour l'animation
  useEffect(() => {
    const styleId = 'glyph-gallery-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!glyphs || glyphs.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#7f8c8d'
      }}>
        Aucun glyph à afficher
      </div>
    );
  }

  const handleCellClick = (glyphId: number) => {
    const glyph = glyphs.find(g => g.id === glyphId);
    if (glyph) {
      setSelectedGlyph(glyph);
    }
  };

  const handleGlyphSelect = (glyph: GlyphData) => {
    setSelectedGlyph(glyph);
    setHoveredGlyphId(glyph.id);
    // Reset hover after a short delay
    setTimeout(() => setHoveredGlyphId(null), 2000);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {/* Grille composite principale */}
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
            Grille Composite
          </h2>
          <CompositeGlyphDisplay
            glyphs={glyphs}
            highlightedId={highlight || hoveredGlyphId || undefined}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Liste des glyphs */}
        <div style={{ minWidth: '300px', maxWidth: '400px' }}>
          <GlyphList
            glyphs={glyphs}
            highlightedId={highlight || hoveredGlyphId || undefined}
            onGlyphSelect={handleGlyphSelect}
          />
        </div>
      </div>

      <GlyphModal
        glyphData={selectedGlyph}
        onClose={() => setSelectedGlyph(null)}
      />
    </>
  );
}