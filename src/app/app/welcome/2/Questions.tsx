"use client";

import { startTransition, useState, useTransition } from "react";

export default function Questions({questions, submit}: {
  questions: { question: string; reponses: string[] }[];
  submit: () => Promise<void>;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <div>
      <p>{questions[currentQuestion].question}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {questions[currentQuestion].reponses.map((reponse) => (
          <button
            key={reponse}
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
              } else {
                startTransition(() => {
                  submit();
                });
              }
            }}
            style={{
              padding: "1rem",
              margin: "0.5rem 0",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {reponse}
          </button>
        ))}
      </div>
    </div>
  );
}
