import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {
  labs,
  weekQuestions,
} from "@/components/constants";

const labQuestions = weekQuestions.map((q: any) => ({
  id: q.id,
  lab_id: String(q.lab_id),
  question_text: q.question_text,
  answer: q.answer,
  display_order: q.display_order ?? 0,
  copy_text: q.copy_text ?? null,
}));

export async function GET() {
  try {
    const batch = adminDb.batch();

    const addCollection = (collectionName: string, data: any[]) => {
      const colRef = adminDb.collection(collectionName);
      data.forEach((item) => {
        const docRef = colRef.doc(item.id.toString());
        batch.set(docRef, item);
      });
    };

    addCollection(
      "labs",
      labs.map((lab: any) => ({
        id: lab.id,
        lab_name: lab.lab_name,
        lab_code: lab.lab_code,
      })),
    );
    addCollection("labQuestions", labQuestions);

    await batch.commit();

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
