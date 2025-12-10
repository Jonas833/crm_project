"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api_helper";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUser] = useState("");
  const [password, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    try {
      const res = await apiPost("/signin", { username, password });
      localStorage.setItem("token", res.access_token);
      router.push("/home");
    } catch {
      setError("Login fehlgeschlagen");
    }
  }

  return (
    <div>
      <h1>Login Employee</h1>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUser(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPw(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <a href="/signup">Signup Company →</a>
    </div>
  );
}
