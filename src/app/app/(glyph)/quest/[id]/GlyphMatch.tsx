"use client";

import PixelMatch from "@/app/app/components/PixelMatch";
import { glyphArrayToString } from "@/utils";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

// FIXME used useCallback but not sure yet it is the best way. Maybe useRef/startTransition could be better
export default function GlyphMatch({
  questId,
  glyphSize,
}: {
  questId: string;
  glyphSize: [number, number];
}) {
  const router = useRouter();
  const [lastCheckedCoords, setLastCheckedCoords] = useState<
    [number, number] | undefined
  >();

  const handleGlyphChange = useCallback(
    (glyph: boolean[][], coords: [number, number]) => {
      setLastCheckedCoords(coords);

      fetch(`/api/quest/${questId}/glyph/check`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: glyphArrayToString(glyph),
      })
        .then((response) => response.json())
        .then(
          (data: { error: string } | { success: boolean; message: string }) => {
            if ("error" in data) {
              console.error("Error checking glyph:", data.error);
            } else {
              console.log("Glyph check result:", data);
              if (data.success) {
                router.refresh();
              }
            }
            setLastCheckedCoords(undefined);
          }
        )
        .catch((error) => {
          console.error("Error during glyph check:", error);
          setLastCheckedCoords(undefined);
        });
    },
    [questId, router]
  );

  return (
    <div>
      <PixelMatch
        size={glyphSize}
        onChange={handleGlyphChange}
        lastCheckedCoords={lastCheckedCoords}
      />
    </div>
  );
}
