<template>
  <section class="assignment-list" aria-label="Saved assignments">
    <div class="list-heading">
      <div><p class="eyebrow">Your workload</p><h2>Saved assignments</h2></div>
      <span>{{ assignments.length }} total</span>
    </div>
    <div v-if="assignments.length" class="assignment-list__items">
      <AssignmentItem v-for="assignment in assignments" :key="assignment.id" :assignment="assignment" @toggle-status="$emit('toggle-status', $event)" @remove="$emit('remove', $event)" />
    </div>
    <p v-else class="empty-state">Your saved assignments will appear here.</p>
  </section>
</template>

<script setup lang="ts">
import AssignmentItem from '@/components/AssignmentItem.vue';
import type { Assignment } from './AssignmentForm.vue';

defineProps<{ assignments: Assignment[] }>();
defineEmits<{ 'toggle-status': [id: string]; remove: [id: string] }>();
</script>

<style scoped>
.assignment-list { display: grid; gap: 14px; min-width: 0; }
.list-heading { align-items: center; display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; }
.eyebrow { color: var(--tracker-green-700); font-size: 12px; font-weight: 700; letter-spacing: .08em; margin: 0 0 5px; text-transform: uppercase; }
.list-heading h2 { color: var(--tracker-green-950); font-family: var(--tracker-font-display); font-size: 22px; margin: 0; }
.list-heading span { color: var(--tracker-muted); font-size: 14px; }
.assignment-list__items { display: grid; gap: 14px; }
.empty-state { color: var(--tracker-muted); padding: 30px 0; text-align: center; }
</style>