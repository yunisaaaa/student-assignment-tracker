import { ref as dbRef, onValue, get, push, update, remove } from 'firebase/database';
import { db } from '@/firebase';
import type { Assignment } from '@/types/assignment';

const ASSIGNMENTS_PATH = 'assignments';

export type AssignmentData = Omit<Assignment, 'id'>;

function assignmentsRef() {
  return dbRef(db, ASSIGNMENTS_PATH);
}

export async function fetchAssignments() {
  const snapshot = await get(assignmentsRef());
  const data = snapshot.val() as Record<string, AssignmentData> | null;
  if (!data) return [] as Assignment[];
  return Object.entries(data).map(([key, val]) => ({
    id: key,
    ...val,
  }));
}

export function listenToAssignments(callback: (assignments: Assignment[]) => void) {
  return onValue(assignmentsRef(), (snapshot) => {
    const data = snapshot.val() as Record<string, AssignmentData> | null;
    if (!data) {
      callback([]);
      return;
    }
    const list: Assignment[] = Object.entries(data).map(([key, val]) => ({
      id: key,
      ...val,
    }));
    callback(list);
  });
}

export function addAssignment(data: AssignmentData) {
  return push(assignmentsRef(), data);
}

export function toggleAssignmentStatus(id: string, currentStatus: Assignment['status']) {
  const newStatus = currentStatus === 'Completed' ? 'Not started' : 'Completed';
  return update(dbRef(db, `${ASSIGNMENTS_PATH}/${id}`), { status: newStatus });
}

export function deleteAssignment(id: string) {
  return remove(dbRef(db, `${ASSIGNMENTS_PATH}/${id}`));
}
