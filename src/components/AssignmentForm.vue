<template>
  <form class="assignment-form" @submit.prevent="submitAssignment">
    <ion-item>
      <ion-select v-model="form.subject" label="Subject" label-placement="stacked" placeholder="Choose a subject" required>
        <ion-select-option value="Capstone 2">Capstone 2</ion-select-option>
        <ion-select-option value="IT Seminar">IT Seminar</ion-select-option>
        <ion-select-option value="Systems Integration & Architecture 2">Systems Integration &amp; Architecture 2</ion-select-option>
        <ion-select-option value="Information Assurance and Security">Information Assurance and Security</ion-select-option>
        <ion-select-option value="Integrative Programming and Tech 2">Integrative Programming and Tech 2</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-input v-model="form.title" label="Title" label-placement="stacked" placeholder="Enter title" required />
    </ion-item>
    <ion-item>
      <ion-input class="deadline-input" v-model="form.deadline" :min="today" label="Deadline" label-placement="stacked" type="date" required />
    </ion-item>
    <p v-if="form.deadline && form.deadline < today" class="deadline-error">Please choose today or a future date.</p>
    <ion-item>
      <ion-select v-model="form.status" label="Status" label-placement="stacked">
        <ion-select-option value="Not started">Not started</ion-select-option>
        <ion-select-option value="In progress">In progress</ion-select-option>
        <ion-select-option value="Completed">Completed</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-textarea v-model="form.notes" label="Notes" label-placement="stacked" placeholder="Add reminders or useful details" :auto-grow="true" />
    </ion-item>
    <ion-button expand="block" type="submit">Save assignment</ion-button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { IonButton, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea } from '@ionic/vue';
import type { Assignment } from '@/types/assignment';

const emit = defineEmits<{ save: [assignment: Omit<Assignment, 'id'>] }>();
const form = reactive<Omit<Assignment, 'id'>>({ subject: '', title: '', deadline: '', status: 'Not started', notes: '' });
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

function submitAssignment() {
  if (!form.subject || !form.title || !form.deadline || form.deadline < today) return;
  emit('save', { ...form });
  form.subject = '';
  form.title = '';
  form.deadline = '';
  form.notes = '';
}
</script>

<style scoped>
.assignment-form { display: grid; gap: clamp(8px, 2vw, 12px); min-width: 0; }
.assignment-form ion-item { --background: var(--tracker-green-050); --border-color: var(--tracker-border); --border-radius: 10px; --padding-start: 12px; }
.assignment-form ion-input,
.assignment-form ion-select,
.assignment-form ion-textarea {
  --color: #202124;
  --placeholder-color: var(--tracker-muted);
  --highlight-color-focused: var(--tracker-green-700);
}
.assignment-form ion-input::part(native),
.assignment-form ion-textarea::part(native) { color: #202124; }
.assignment-form ion-input::part(label),
.assignment-form ion-select::part(label),
.assignment-form ion-textarea::part(label) { color: var(--tracker-green-800); }
.deadline-input { --color: #202124; --placeholder-color: #202124; color-scheme: light; }
.deadline-input::part(native) { color: #202124; color-scheme: light; opacity: 1; }
.deadline-input::part(native)::-webkit-calendar-picker-indicator { filter: none; opacity: 1; }
.deadline-error { color: #b42318; font-size: 13px; margin: -4px 0 0; }
.assignment-form ion-button { margin-top: 8px; width: 100%; }
</style>