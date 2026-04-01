import { adminDb } from "@/lib/firebase/admin";
import React from "react"

export default async function page({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  
  // Use adminDb to fetch questions this is a server component
  const numericWeekId = isNaN(Number(weekId)) ? weekId : Number(weekId);
  const qSnap = await adminDb.collection("weekQuestions").where("week_id", "==", numericWeekId).get();
  
  const questions = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as any);
  questions.sort((a: any, b: any) => a.display_order - b.display_order);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Questions for Week {weekId}</h1>
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q: any) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{q.display_order}. {q.question_text}</h3>
              {q.answer && (
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 font-mono whitespace-pre-wrap mt-3">
                  {q.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 border rounded-xl border-dashed">
            No questions found for this week.
          </div>
        )}
      </div>
    </div>
  );
}

