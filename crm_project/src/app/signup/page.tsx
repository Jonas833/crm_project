"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api_helper";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [password, setPw] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup(e: any) {
    e.preventDefault();
    try {
      await apiPost("/signup", { email, username, password });
      setMsg("Company erstellt!");
    } catch {
      setMsg("Fehler beim Signup");
    }
  }

  return (
    <div>
      <h1>Company Signup</h1>
      <form onSubmit={handleSignup}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Username" value={username} onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="Passwort" value={password} onChange={e => setPw(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
