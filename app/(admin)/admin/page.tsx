"use client";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"labs" | "programs">("labs");
  const [labsList, setLabsList] = useState<any[]>([]);
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [academicYearsList, setAcademicYearsList] = useState<any[]>([]);

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingLabId, setEditingLabId] = useState<string | null>(null);
  const [editingProgId, setEditingProgId] = useState<string | null>(null);

  const [labForm, setLabForm] = useState({
    lab_name: "",
    lab_code: "",
    weeks: 12,
    program_id: 1,
    department_id: 1,
    academic_year_id: 1,
  });
  const [progForm, setProgForm] = useState({ code: "", name: "" });

  useEffect(() => {
    const unsubLabs = onSnapshot(collection(db, "labs"), (snapshot) => {
      setLabsList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      setProgramsList(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });
    const unsubDepts = onSnapshot(collection(db, "departments"), (snapshot) => {
      setDepartmentsList(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });
    const unsubYears = onSnapshot(
      collection(db, "academicYears"),
      (snapshot) => {
        setAcademicYearsList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
    );
    return () => {
      unsubLabs();
      unsubProgs();
      unsubDepts();
      unsubYears();
    };
  }, []);

  const openLabModal = (lab?: any) => {
    if (lab) {
      setEditingLabId(lab.id);
      setLabForm({
        lab_name: lab.lab_name,
        lab_code: lab.lab_code,
        weeks: lab.weeks,
        program_id: lab.program_id,
        department_id: lab.department_id,
        academic_year_id: lab.academic_year_id,
      });
    } else {
      setEditingLabId(null);
      setLabForm({
        lab_name: "",
        lab_code: "",
        weeks: 12,
        program_id: 1,
        department_id: 1,
        academic_year_id: 1,
      });
    }
    setIsLabModalOpen(true);
  };

  const saveLab = async () => {
    if (editingLabId) {
      await updateDoc(doc(db, "labs", editingLabId), labForm);
    } else {
      await addDoc(collection(db, "labs"), labForm);
    }
    setIsLabModalOpen(false);
  };

  const deleteLab = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure?")) await deleteDoc(doc(db, "labs", id));
  };

  const openProgModal = (prog?: any) => {
    if (prog) {
      setEditingProgId(prog.id);
      setProgForm({ code: prog.code, name: prog.name });
    } else {
      setEditingProgId(null);
      setProgForm({ code: "", name: "" });
    }
    setIsProgModalOpen(true);
  };

  const saveProg = async () => {
    if (editingProgId) {
      await updateDoc(doc(db, "programs", editingProgId), progForm);
    } else {
      await addDoc(collection(db, "programs"), progForm);
    }
    setIsProgModalOpen(false);
  };

  const deleteProg = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure?")) await deleteDoc(doc(db, "programs", id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("labs")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "labs" ? "bg-white shadow text-blue-600" : "text-gray-600"}`}
          >
            Labs
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "programs" ? "bg-white shadow text-blue-600" : "text-gray-600"}`}
          >
            Programs
          </button>
        </div>
      </div>
      {activeTab === "labs" && (
        <div>
          <button
            onClick={() => openLabModal()}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Lab
          </button>
          <div className="space-y-4">
            {labsList.map((lab) => (
              <div
                key={lab.id}
                className="p-4 border rounded-xl flex justify-between cursor-pointer hover:shadow"
                onClick={() => router.push(`/admin/labs/${lab.id}`)}
              >
                <div>
                  <h3 className="font-bold">
                    {lab.lab_name} ({lab.lab_code})
                  </h3>
                  <p className="text-sm text-gray-500">Weeks: {lab.weeks}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLabModal(lab);
                    }}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => deleteLab(lab.id, e)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "programs" && (
        <div>
          <button
            onClick={() => openProgModal()}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Program
          </button>
          <div className="space-y-4">
            {programsList.map((prog) => (
              <div
                key={prog.id}
                className="p-4 border rounded-xl flex justify-between"
              >
                <div>
                  <h3 className="font-bold">
                    {prog.name} ({prog.code})
                  </h3>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => openProgModal(prog)}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => deleteProg(prog.id, e)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLabModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingLabId ? "Edit Lab" : "Add Lab"}
            </h2>
            <input
              type="text"
              placeholder="Lab Name"
              className="w-full mb-2 p-2 border rounded"
              value={labForm.lab_name}
              onChange={(e) =>
                setLabForm({ ...labForm, lab_name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Lab Code"
              className="w-full mb-2 p-2 border rounded"
              value={labForm.lab_code}
              onChange={(e) =>
                setLabForm({ ...labForm, lab_code: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Weeks"
              className="w-full mb-4 p-2 border rounded"
              value={labForm.weeks}
              onChange={(e) =>
                setLabForm({ ...labForm, weeks: Number(e.target.value) })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsLabModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveLab}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isProgModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingProgId ? "Edit Program" : "Add Program"}
            </h2>
            <input
              type="text"
              placeholder="Program Name"
              className="w-full mb-2 p-2 border rounded"
              value={progForm.name}
              onChange={(e) =>
                setProgForm({ ...progForm, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Program Code"
              className="w-full mb-4 p-2 border rounded"
              value={progForm.code}
              onChange={(e) =>
                setProgForm({ ...progForm, code: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsProgModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveProg}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
