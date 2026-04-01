"use client";
import HiddenBox from "@/components/HiddenBox";
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <iframe
        src="https://ubuntu.com/server/docs/reference/high-availability/"
        className="min-w-full min-h-190 z-0"
      ></iframe>
      {show && <HiddenBox />}
      <button
        className="fixed bottom-10 right-10 z-10 bg-blue-500 text-white p-2 rounded-lg"
        onClick={() => {
          setShow(!show);
        }}
      >
        O
      </button>
    </div>
  );
}
