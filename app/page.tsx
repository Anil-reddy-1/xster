"use client";
import HiddenBox from "../components/HiddenBox";
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState(false);
  const [pass, setPass] = useState(false);
  const [password, setPassword] = useState("");
  const expectedKey = process.env.NEXT_PUBLIC_MY_KEY || "";

  const toggleInput = () => {
    if (pass) {
      setPass(false);
      setPassword("");
      setShow(false);
      return;
    }
    setPass(true);
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setShow(value === expectedKey);
  };

  return (
    <div>
      <iframe
        src="https://ubuntu.com/server/docs/reference/high-availability/migrate-from-crmsh-to-pcs/"
        className="min-w-full min-h-190 z-0"
      ></iframe>
      {show && <HiddenBox />}
      <button
        aria-label="panel-toggle"
        className="fixed bottom-6 right-6 z-10 h-5 w-5 rounded-full border border-slate-500/30 bg-slate-700/15 text-[0] shadow-sm backdrop-blur-sm transition hover:bg-slate-700/25 dark:border-slate-300/20 dark:bg-slate-100/10 dark:hover:bg-slate-100/20"
        onClick={toggleInput}
      >
        .
      </button>
      {pass && (
        <div className="fixed bottom-12 right-6 z-10">
          <input
            type="password"
            name="password"
            id="p"
            value={password}
            placeholder="..."
            className="w-24 rounded-lg border border-slate-500/30 bg-slate-800/20 px-2 py-1 text-[11px] text-slate-200 placeholder:text-slate-300/60 backdrop-blur-md outline-none transition focus:w-32 focus:border-slate-300/40 dark:border-slate-300/25 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-400"
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
