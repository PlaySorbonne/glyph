"use client";

import { nameFormat } from "@/utils/zod";
import { useEffect, useState } from "react";

export default function UserInput({ name }: { name: string }) {
  const [input, setInput] = useState("");

  let isValid = nameFormat.safeParse(input).success;

  const validater = /[a-zA-Z0-9_.-]/g;

  useEffect(() => {
    const filteredInput = input.match(validater)?.splice(0,19)?.join("") || "";
    if (filteredInput !== input) {
      setInput(filteredInput);
    }
  }, [input]);

  return (
    <div>
      <input
        type="text"
        id={name}
        name={name}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={
          isValid || input.length === 0
            ? { borderWidth: "2px" }
            : {
                borderColor: "red",
                borderWidth: "2px",
                backgroundColor: "#ffe6e6",
              }
        }
      />
    </div>
  );
}
