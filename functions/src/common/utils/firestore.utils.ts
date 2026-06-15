import { Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';

export function convertTimestamps(data: any): any {
  if (!data || typeof data !== 'object') return data;

  const converted = { ...data };

  for (const key in converted) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamps(converted[key]);
    }
  }

  return converted;
}

export function mapToEntity<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) return null;

  const data = doc.data();

  return {
    id: doc.id,
    ...convertTimestamps(data),
  } as T;
}
