"use client";

import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LabWeeksPage({
  params,
}: {
  params: Promise<{ lab: string }>;
}) {
  const { lab: labIdParam } = use(params);
  const router = useRouter();

  const [currentLab, setCurrentLab] = useState<any>(null);
  const [weeksList, setWeeksList] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [weekForm, setWeekForm] = useState({
    week_no: 1,
    title: "",
    instructions: "",
  });

  useEffect(() => {
    // Initial fetch of lab and its weeks
    const fetchLab = async () => {
      const labSnap = await getDoc(doc(db, "labs", labIdParam));
      if (labSnap.exists()) {
        setCurrentLab({ id: labSnap.id, ...labSnap.data() });
      }
    };
    fetchLab();

    // Subscribe to weeks
    const curLabId = isNaN(Number(labIdParam))
      ? labIdParam
      : Number(labIdParam);
    const q = query(
      collection(db, "labWeeks"),
      where("lab_id", "==", curLabId),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const weeks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      weeks.sort((a: any, b: any) => a.week_no - b.week_no);
      setWeeksList(weeks);
    });

    return () => unsub();
  }, [labIdParam]);

  const openModal = (week?: any) => {
    if (week) {
      setEditingWeekId(week.id);
      setWeekForm({
        week_no: week.week_no,
        title: week.title,
        instructions: week.instructions,
      });
    } else {
      setEditingWeekId(null);
      const nextWeekNo =
        weeksList.length > 0
          ? Math.max(...weeksList.map((w: any) => w.week_no)) + 1
          : 1;
      setWeekForm({ week_no: nextWeekNo, title: "", instructions: "" });
    }
    setIsModalOpen(true);
  };

  const saveWeek = async () => {
    const curLabId = isNaN(Number(labIdParam))
      ? labIdParam
      : Number(labIdParam);
    if (editingWeekId) {
      await updateDoc(doc(db, "labWeeks", editingWeekId), weekForm);
    } else {
      await addDoc(collection(db, "labWeeks"), {
        lab_id: curLabId,
        ...weekForm,
      });
    }
    setIsModalOpen(false);
  };

  const deleteWeek = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this week?")) {
      await deleteDoc(doc(db, "labWeeks", id));
    }
  };

  if (!currentLab) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading lab details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 font-medium flex items-center"
      >
        &larr; Back to Labs
      </button>
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentLab.lab_name}{" "}
          <span className="font-normal text-gray-500 ml-2">
            ({currentLab.lab_code})
          </span>
        </h1>
        <p className="mt-2 text-gray-600">
          Total configured weeks: {currentLab.weeks}
        </p>
      </div>

      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-gray-700">
          Manage weeks and curriculum for this lab.
        </p>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
        >
          + Add Week
        </button>
      </div>

      <div className="space-y-4">
        {weeksList.length > 0 ? (
          weeksList.map((week) => (
            <div
              key={week.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition cursor-pointer"
              onClick={() =>
                router.push(`/admin/labs/${labIdParam}/${week.id}`)
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    Week {week.week_no}
                  </span>
                  <h3 className="font-bold text-lg text-gray-800">
                    {week.title}
                  </h3>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(week);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => deleteWeek(week.id, e)}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {week.instructions && (
                <p className="text-gray-600 text-sm mt-2">
                  {week.instructions}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 border rounded-xl border-dashed">
            No weeks added yet.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingWeekId ? "Edit Week" : "Add New Week"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Number
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={weekForm.week_no}
                  onChange={(e) =>
                    setWeekForm({
                      ...weekForm,
                      week_no: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={weekForm.title}
                  onChange={(e) =>
                    setWeekForm({ ...weekForm, title: e.target.value })
                  }
                  placeholder="e.g. Introduction to C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions / Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-24"
                  value={weekForm.instructions}
                  onChange={(e) =>
                    setWeekForm({ ...weekForm, instructions: e.target.value })
                  }
                  placeholder="Details for this week's lab..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
                onClick={saveWeek}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
