"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";

export default function Setting(
  props: { label: string } & (
    | { type: "link"; href: string }
    | { type: "children"; children: React.ReactNode; popup?: boolean }
    | {
        type: "button";
        onClick: (e: MouseEvent) => void;
      }
  )
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (props.type !== "button") {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full border-b border-gray-200">
      <div
        className="py-4 px-4 flex justify-between items-center cursor-pointer"
        onClick={props.type === "button" ? props.onClick : handleToggle}
      >
        <span style={{
          fontWeight: 500,
        }}>{props.label}</span>
        {props.type !== "button" && (
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
      {isOpen && props.type === "children" && !props.popup && (
        <div className="px-4 py-2">{props.children}</div>
      )}
      {isOpen && props.type === "children" && props.popup && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
        >
          <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{props.label}</h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {props.children}
          </div>
        </div>
      )}
      {props.type === "link" && (
        <Link href={props.href} className="block px-4 py-2 bg-gray-50">
          {props.label}
        </Link>
      )}
    </div>
  );
}
