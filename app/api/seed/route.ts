import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {
  programs,
  departments,
  academicYears,
  labs,
  labWeeks,
  weekQuestions,
} from "@/components/constants";

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

    addCollection("programs", programs);
    addCollection("departments", departments);
    addCollection("academicYears", academicYears);
    addCollection("labs", labs);
    if (typeof labWeeks !== "undefined") addCollection("labWeeks", labWeeks);
    if (typeof weekQuestions !== "undefined") addCollection("weekQuestions", weekQuestions);

    await batch.commit();

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
