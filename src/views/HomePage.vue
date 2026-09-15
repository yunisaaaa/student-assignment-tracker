<template>
  <ion-page>
    <ion-header class="app-header"><ion-toolbar><div class="brand" slot="start"><span class="brand-mark">S</span><span>Student Assignment Tracker</span></div></ion-toolbar></ion-header>
    <ion-content>
      <main class="page-content">
        <section class="intro"><div class="intro__copy"><p class="eyebrow">Stay on top of your work</p><h1>Assignments</h1><p>Record each task, its deadline, and the notes you need to finish it.</p></div></section>
        <section class="tracker-layout">
          <ion-card class="form-card"><ion-card-header><ion-card-title>New assignment</ion-card-title></ion-card-header><ion-card-content><AssignmentForm @save="saveAssignment" /></ion-card-content></ion-card>
          <AssignmentList :assignments="assignments" @toggle-status="toggleStatus" @remove="removeAssignment" />
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { toastController } from '@ionic/vue';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/vue';
import AssignmentForm, { type Assignment } from '@/components/AssignmentForm.vue';
import AssignmentList from '@/components/AssignmentList.vue';
import { listenToAssignments, addAssignment, toggleAssignmentStatus, deleteAssignment } from '@/services/assignmentService';

const assignments = ref<Assignment[]>([]);
let unsubscribe: (() => void) | undefined;

onMounted(() => {
  unsubscribe = listenToAssignments((list) => {
    assignments.value = list;
  });
});

onUnmounted(() => {
  unsubscribe?.();
});

async function showToast(message: string, color: 'success' | 'danger' = 'success') {
  const toast = await toastController.create({
    message,
    duration: 3000,
    position: 'bottom',
    color,
  });
  await toast.present();
}

async function saveAssignment(data: Omit<Assignment, 'id'>) {
  try {
    await addAssignment(data);
    await showToast('Assignment saved to Firebase.');
  } catch (error) {
    await showToast(`Could not save: ${(error as Error).message}`, 'danger');
  }
}

async function toggleStatus(id: string) {
  const assignment = assignments.value.find((item) => item.id === id);
  if (!assignment) return;
  try {
    await toggleAssignmentStatus(id, assignment.status);
  } catch (error) {
    await showToast(`Could not update: ${(error as Error).message}`, 'danger');
  }
}

async function removeAssignment(id: string) {
  try {
    await deleteAssignment(id);
  } catch (error) {
    await showToast(`Could not remove: ${(error as Error).message}`, 'danger');
  }
}
</script>

<style scoped>
.app-header ion-toolbar { --background: var(--tracker-green-700); --color: #fff; --min-height: 72px; padding: 0 clamp(12px, 4vw, 40px); }
.brand { align-items: center; color: #fff; display: flex; font-family: var(--tracker-font-display); font-size: clamp(15px, 2.5vw, 18px); font-weight: 700; gap: 10px; }
.brand-mark { align-items: center; background: #d9f0e1; border-radius: 9px; color: var(--tracker-green-800); display: inline-flex; font-size: 16px; height: 32px; justify-content: center; width: 32px; }
.page-content { box-sizing: border-box; margin: 0 auto; max-width: 1100px; padding: clamp(24px, 5vw, 52px) clamp(16px, 4vw, 40px) 64px; width: 100%; }
.intro { margin-bottom: clamp(24px, 4vw, 40px); }
.intro { align-items: center; background: var(--tracker-green-050); border: 1px solid var(--tracker-border); border-radius: 20px; display: flex; justify-content: space-between; overflow: hidden; padding: clamp(24px, 5vw, 42px); position: relative; }
.eyebrow { color: var(--tracker-green-700); font-size: 12px; font-weight: 700; letter-spacing: .08em; margin: 0; text-transform: uppercase; }
.intro h1 { color: var(--tracker-green-950); font-family: var(--tracker-font-display); font-size: clamp(30px, 5vw, 42px); line-height: 1.1; margin: 8px 0; }
.intro > p:last-child { color: var(--tracker-muted); margin: 0; }
.intro__copy > p:last-child { color: var(--tracker-muted); margin: 0; max-width: 560px; }
.tracker-layout { align-items: start; display: grid; gap: clamp(18px, 3vw, 32px); grid-template-columns: minmax(min(100%, 300px), 0.85fr) minmax(0, 1.5fr); }
.form-card { margin: 0; }
.form-card { --background: #fff; --border-radius: 16px; --box-shadow: 0 10px 30px rgba(18, 59, 42, .07); }
.form-card ion-card-title { color: var(--tracker-green-950); font-family: var(--tracker-font-display); }
@media (max-width: 760px) { .page-content { padding-bottom: 48px; } .tracker-layout { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 520px) { .app-header ion-toolbar { --min-height: 62px; } .intro { border-radius: 16px; } }
</style>
