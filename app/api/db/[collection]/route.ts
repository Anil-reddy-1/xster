import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function isSupportedCollection(name: string) {
  return name === "labs" || name === "labQuestions";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const { collection } = await context.params;
  if (!isSupportedCollection(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const field = url.searchParams.get("field");
    const value = url.searchParams.get("value");

    let query: FirebaseFirestore.Query = adminDb.collection(collection);
    if (field && value !== null) {
      query = query.where(field, "==", value);
    }

    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const { collection } = await context.params;
  if (!isSupportedCollection(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const docRef = await adminDb.collection(collection).add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
