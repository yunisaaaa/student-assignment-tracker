<template>
  <article class="assignment-card">
    <div class="assignment-card__heading">
      <div>
        <p>{{ assignment.subject }}</p>
        <h2>{{ assignment.title }}</h2>
      </div>
      <ion-badge :color="statusColor">{{ assignment.status }}</ion-badge>
    </div>
    <div class="assignment-card__meta">
      <span><strong>Deadline:</strong> {{ assignment.deadline }}</span>
    </div>
    <p v-if="assignment.notes" class="assignment-card__notes"><strong>Notes:</strong> {{ assignment.notes }}</p>
    <div class="assignment-card__actions">
      <ion-button fill="outline" size="small" @click="$emit('toggle-status', assignment.id)">{{ actionLabel }}</ion-button>
      <ion-button fill="clear" color="danger" size="small" @click="$emit('remove', assignment.id)">Remove</ion-button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonBadge, IonButton } from '@ionic/vue';
import type { Assignment } from '@/types/assignment';
import { getNextStatus } from '@/services/assignmentService';

const props = defineProps<{ assignment: Assignment }>();
defineEmits<{ 'toggle-status': [id: string]; remove: [id: string] }>();
const statusColor = computed(() => props.assignment.status === 'Completed' ? 'success' : props.assignment.status === 'In progress' ? 'warning' : 'medium');
const actionLabel = computed(() => {
  const next = getNextStatus(props.assignment.status);
  if (next === 'Completed') return 'Mark complete';
  if (next === 'Not started') return 'Reopen';
  return 'Move to In progress';
});
</script>

<style scoped>
.assignment-card { background: var(--ion-card-background, #fff); border: 1px solid var(--tracker-border); border-left: 4px solid var(--tracker-green-700); border-radius: 14px; box-shadow: 0 8px 22px rgba(32, 42, 39, .05); box-sizing: border-box; min-width: 0; padding: clamp(14px, 3vw, 20px); width: 100%; }
.assignment-card__heading { align-items: flex-start; display: flex; gap: 16px; justify-content: space-between; }
.assignment-card p { color: var(--tracker-muted); font-size: 13px; margin: 0 0 5px; }
.assignment-card h2 { color: #202124; font-family: var(--tracker-font-display); font-size: clamp(16px, 2vw, 19px); line-height: 1.25; margin: 0; overflow-wrap: anywhere; }
.assignment-card__meta { color: var(--tracker-muted); font-size: 14px; margin-top: 18px; }
.assignment-card__meta strong, .assignment-card__notes strong { color: var(--tracker-green-950); }
.assignment-card__notes { border-top: 1px solid var(--tracker-border); line-height: 1.5; margin-top: 14px !important; padding-top: 14px; }
.assignment-card__actions { border-top: 1px solid var(--tracker-border); display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 12px; }
@media (max-width: 420px) { .assignment-card__heading { align-items: stretch; flex-direction: column; gap: 10px; } .assignment-card ion-badge { align-self: flex-start; } }
</style>