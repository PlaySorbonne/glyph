"use client";

import PixelMatch from "@/app/app/components/PixelMatch";
import { glyphArrayToString } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GlyphMatch({
  questId,
  glyphSize,
}: {
  questId: string;
  glyphSize: [number, number];
}) {
  const router = useRouter();
  const [lastCheckedCoords, setLastCheckedCoords] = useState<[number, number] | undefined>();

  function handleGlyphChange(glyph: boolean[][], coords: [number, number]) {
    setLastCheckedCoords(coords);
    
    fetch(`/api/quest/${questId}/glyph/check`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: glyphArrayToString(glyph),
    })
      .then((response) => response.json())
      .then((data: { error: string } | { success: boolean; message: string }) => {
        if ("error" in data) {
          console.error("Error checking glyph:", data.error);
        } else {
          console.log("Glyph check result:", data);
          if (data.success) {
            alert(data.message);
            router.refresh();
          }
        }
        setLastCheckedCoords(undefined); // Clear the last checked coords after response
      })
      .catch((error) => {
        console.error("Error during glyph check:", error);
        setLastCheckedCoords(undefined); // Clear on error too
      });
  }

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
