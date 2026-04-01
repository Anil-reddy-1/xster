"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  copy_text?: string | null;
};

type FormState = {
  question_text: string;
  answer: string;
  display_order: number;
  copy_text: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function LabQuestionsPage() {
  const router = useRouter();
  const params = useParams<{ lab: string }>();
  const labId = params?.lab || "";

  const [lab, setLab] = useState<Lab | null>(null);
  const [questions, setQuestions] = useState<LabQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    question_text: "",
    answer: "",
    display_order: 1,
    copy_text: "",
  });

  const fetchLabAndQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const [labRes, qRes] = await Promise.all([
        fetch(`/api/db/labs/${labId}`, { cache: "no-store" }),
        fetch(`/api/db/labQuestions?field=lab_id&value=${labId}`, {
          cache: "no-store",
        }),
      ]);

      if (!labRes.ok) {
        setLab(null);
      } else {
        const labData = (await labRes.json()) as Lab;
        setLab(labData);
      }

      if (qRes.ok) {
        const rows = (await qRes.json()) as LabQuestion[];
        rows.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setQuestions(rows);
      }
    } finally {
      setLoading(false);
    }
  }, [labId]);

  useEffect(() => {
    if (!labId) {
      setLoading(false);
      setLab(null);
      return;
    }
    fetchLabAndQuestions().catch((e: unknown) => {
      setError(getErrorMessage(e, "Failed to load lab data"));
      setLoading(false);
    });
  }, [labId, fetchLabAndQuestions]);

  const openModal = (qItem?: LabQuestion) => {
    setError("");
    if (qItem) {
      setEditingQuestionId(qItem.id);
      setForm({
        question_text: qItem.question_text || "",
        answer: qItem.answer || "",
        display_order: qItem.display_order || 1,
        copy_text: qItem.copy_text || "",
      });
    } else {
      setEditingQuestionId(null);
      setForm({
        question_text: "",
        answer: "",
        display_order: questions.length + 1,
        copy_text: "",
      });
    }
    setIsModalOpen(true);
  };

  const saveQuestion = async () => {
    setSaving(true);
    setError("");
    try {
      if (
        !form.question_text.trim() ||
        !form.answer.trim() ||
        !form.display_order
      ) {
        throw new Error(
          "Question number, question text, and answer are required.",
        );
      }

      const payload = {
        lab_id: labId,
        question_text: form.question_text.trim(),
        answer: form.answer,
        display_order: Number(form.display_order),
        copy_text: form.copy_text.trim() || null,
      };

      if (editingQuestionId) {
        const res = await fetch(`/api/db/labQuestions/${editingQuestionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to update question");
        }
      } else {
        const res = await fetch("/api/db/labQuestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to create question");
        }
      }

      await fetchLabAndQuestions();
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to save question"));
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) {
      return;
    }
    const res = await fetch(`/api/db/labQuestions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Failed to delete question");
      return;
    }
    await fetchLabAndQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7_0%,#fff_35%),radial-gradient(circle_at_bottom_right,#dbeafe_0%,#fff_40%)] px-4 py-8 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_top_left,#111827_0%,#020617_45%),radial-gradient(circle_at_bottom_right,#0b1120_0%,#030712_45%)]">
        <div className="mx-auto max-w-6xl">
          <div className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lab) {
    return <div className="p-6">Lab not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7_0%,#fff_35%),radial-gradient(circle_at_bottom_right,#dbeafe_0%,#fff_40%)] px-4 py-6 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_top_left,#111827_0%,#020617_45%),radial-gradient(circle_at_bottom_right,#0b1120_0%,#030712_45%)]">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/admin")}
          className="mb-4 inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back to Admin
        </button>

        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6 dark:border-slate-700/80 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Question Bank
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
                {lab.lab_name}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Code: {lab.lab_code}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Questions
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {questions.length}
                </p>
              </div>
              <button
                onClick={() => openModal()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                + Add Question
              </button>
            </div>
          </div>
        </div>

        {error && !isModalOpen ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {questions.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              No questions found for this lab.
            </div>
          ) : (
            questions.map((qItem) => (
              <div
                key={qItem.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Q{qItem.display_order}
                    </p>
                    <h3 className="line-clamp-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {qItem.question_text}
                    </h3>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => openModal(qItem)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(qItem.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {qItem.copy_text ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Copy text: {qItem.copy_text}
                  </div>
                ) : null}

                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono text-slate-700 whitespace-pre-wrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {qItem.answer}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingQuestionId ? "Edit Question" : "Add Question"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Question Number
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Question
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  rows={3}
                  value={form.question_text}
                  onChange={(e) =>
                    setForm({ ...form, question_text: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Answer
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono outline-none transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  rows={6}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Copy Text (optional)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  value={form.copy_text}
                  onChange={(e) =>
                    setForm({ ...form, copy_text: e.target.value })
                  }
                />
              </div>
              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
