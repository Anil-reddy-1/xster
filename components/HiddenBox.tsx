"use client";

import { DndContext, useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { labs, weekQuestions } from "./constants";

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

  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [LabWeeks, setLabWeeks] = useState<any[]>([]);

  const selectLab = (lab: any) => {
    setSelectedLab(lab);
    console.log("Selected Lab:", lab);
    const weeks = weekQuestions.filter((w) => w.lab_id === lab.id);
    setLabWeeks(weeks);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-150 h-100 z-10 mr-20 bg-white border opacity-80 absolute -right-250 top-10 rounded-xl shadow-lg"
    >
      <div
        {...listeners}
        {...attributes}
        className=" w-150 h-100 p-4 cursor-grab mb-2 overflow-y-auto"
      >
        <div className="header flex justify-between mb-4">
          <button
            onClick={() => {
              setSelectedLab(null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Labs
          </button>
          <input
            type="text"
            name="search"
            id="search"
            className="border rounded-xl pl-3"
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>

        {!selectedLab && (
          <div>
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="p-2 border-b"
                onClick={() => selectLab(lab)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {lab.lab_name}
              </div>
            ))}
          </div>
        )}

        {selectedLab && (
          <div>
            <h2 className="text-lg font-bold mb-2">{selectedLab.lab_name}</h2>
            {LabWeeks.length > 0 ? (
              LabWeeks.map((week) => (
                <div className="flex justify-between " key={week.id}>
                  <div className="p-2 border-b">{week.question_text}</div>
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="copy-button"
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(week.answer);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No questions found for this lab.</p>
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
