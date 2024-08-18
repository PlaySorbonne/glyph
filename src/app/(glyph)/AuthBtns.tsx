"use client";

import { signIn, signOut } from "next-auth/react";

export function LoginBtn() {
  return (
    <button onClick={() => signIn()}>
      Login
    </button>
  );
} 

export function LogoutBtn() {
  return (
    <button onClick={() => signOut()}>
      Logout
    </button>
  );
} 