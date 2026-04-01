import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function isSupportedCollection(name: string) {
  return name === "labs" || name === "labQuestions";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await context.params;
  if (!isSupportedCollection(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const doc = await adminDb.collection(collection).doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await context.params;
  if (!isSupportedCollection(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const data = await request.json();
    await adminDb.collection(collection).doc(id).update(data);
    const updated = await adminDb.collection(collection).doc(id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await context.params;
  if (!isSupportedCollection(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    if (collection === "labs") {
      const batch = adminDb.batch();
      const labQuestions = await adminDb
        .collection("labQuestions")
        .where("lab_id", "==", id)
        .get();
      labQuestions.forEach((qDoc) => batch.delete(qDoc.ref));
      batch.delete(adminDb.collection("labs").doc(id));
      await batch.commit();
      return NextResponse.json({ success: true });
    }

    await adminDb.collection(collection).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
