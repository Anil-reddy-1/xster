"use client";

import { DndContext, useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

type Lab = {
  id: string;
  lab_name: string;
  lab_code: string;
};

type LabQuestion = {
  id: string;
  lab_id: string;
  question_text: string;
  answer: string;
  display_order: number;
};

function DraggableBox({ position }: { position: { x: number; y: number } }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });

  const style = {
    transform: transform
      ? `translate(${position.x + transform.x}px, ${position.y + transform.y}px)`
      : `translate(${position.x}px, ${position.y}px)`,
    transition: isDragging ? "none" : "transform 0.2s ease",
  };

  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [labQuestions, setLabQuestions] = useState<LabQuestion[]>([]);

  const fetchLabs = async () => {
    const res = await fetch("/api/db/labs", { cache: "no-store" });
    if (!res.ok) return;
    const rows = (await res.json()) as Lab[];
    rows.sort((a, b) => a.lab_name.localeCompare(b.lab_name));
    setLabs(rows);
  };

  const fetchQuestions = async (labId: string) => {
    const res = await fetch(
      `/api/db/labQuestions?field=lab_id&value=${labId}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return;
    const rows = (await res.json()) as LabQuestion[];
    rows.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setLabQuestions(rows);
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    if (!selectedLab) {
      setLabQuestions([]);
      return;
    }
    fetchQuestions(selectedLab.id);
  }, [selectedLab]);

  const filteredLabs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return labs;
    }
    return labs.filter(
      (lab) =>
        lab.lab_name.toLowerCase().includes(term) ||
        lab.lab_code.toLowerCase().includes(term),
    );
  }, [labs, search]);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return labQuestions;
    }
    return labQuestions.filter((question) => {
      const order = String(question.display_order || "");
      return (
        question.question_text.toLowerCase().includes(term) ||
        question.answer.toLowerCase().includes(term) ||
        order.includes(term)
      );
    });
  }, [labQuestions, search]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-152 h-104 z-10 mr-20 absolute -right-256 top-10 rounded-xl border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-900/95"
    >
      <div
        {...listeners}
        {...attributes}
        className="w-full h-full p-4 cursor-grab mb-2 overflow-y-auto"
      >
        <div className="header flex justify-between mb-4 gap-2">
          <button
            onClick={() => {
              setSelectedLab(null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="px-3 py-1 border rounded border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Labs
          </button>
          <input
            type="text"
            name="search"
            id="search"
            className="border rounded-xl px-3 py-1 w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            placeholder={selectedLab ? "Search questions" : "Search labs"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>

        {!selectedLab && (
          <div>
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="p-2 border-b border-slate-200 text-slate-800 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSelectedLab(lab)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {lab.lab_name} ({lab.lab_code})
              </div>
            ))}
          </div>
        )}

        {selectedLab && (
          <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
              {selectedLab.lab_name}
            </h2>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div className="flex justify-between gap-3" key={question.id}>
                  <div className="p-2 border-b border-slate-200 min-w-0 text-slate-800 dark:border-slate-700 dark:text-slate-100">
                    {question.display_order}. {question.question_text}
                  </div>
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="copy-button shrink-0"
                  >
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                      onClick={() => {
                        navigator.clipboard.writeText(question.answer || "");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                {labQuestions.length === 0
                  ? "No questions found for this lab."
                  : "No matching questions for this search."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HiddenBox() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <DndContext
      onDragEnd={(event) => {
        const { delta } = event;

        setPosition((prev) => ({
          x: prev.x + delta.x,
          y: prev.y + delta.y,
        }));
      }}
    >
      <DraggableBox position={position} />
    </DndContext>
  );
}

export default HiddenBox;
