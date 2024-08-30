"use client";

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { Url } from 'url';

export default function Setting(
  props: { label: string } & (
    | { type: "link"; href: Url | string }
    | { type: "children"; children: React.ReactNode }
    | {
        type: "button";
        onClick: (e: MouseEvent) => void;
      }
  )
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (props.type !== 'button') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full border-b border-gray-200">
      <Link
        href={props.type === "link" ? props.href : ""}
        className="py-4 px-4 flex justify-between items-center cursor-pointer"
        onClick={props.type === 'button' ? props.onClick : handleToggle}
      >
        <span>{props.label}</span>
        {props.type !== 'button' && (
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>
      {isOpen && props.type === 'children' && (
        <div className="px-4 py-2 bg-gray-50">{props.children}</div>
      )}
    </div>
  );
}
