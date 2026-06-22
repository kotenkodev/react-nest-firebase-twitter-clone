import { Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';

export function convertTimestamps(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;

  const converted = { ...(data as Record<string, unknown>) };

  for (const key in converted) {
    const value = converted[key];
    if (value instanceof Timestamp) {
      converted[key] = value.toDate();
    } else if (typeof value === 'object' && value !== null) {
      converted[key] = convertTimestamps(value);
    }
  }

  return converted;
}

export function mapToEntity<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) return null;

  const data = doc.data();

  return {
    id: doc.id,
    ...(convertTimestamps(data) as Record<string, unknown>),
  } as T;
}
