<template>
  <div class="connection">
    <ion-button size="small" :color="status.color">{{ status.label }}</ion-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onValue, ref as dbRef, type Unsubscribe } from 'firebase/database';
import { IonButton } from '@ionic/vue';
import { db } from '@/firebase';

const browserOnline = ref(navigator.onLine);
const firebaseConnected = ref(false);
let unsubscribeConnection: Unsubscribe | undefined;

function handleOnline() {
  browserOnline.value = true;
}
function handleOffline() {
  browserOnline.value = false;
}

onMounted(() => {
  unsubscribeConnection = onValue(dbRef(db, '.info/connected'), (snapshot) => {
    firebaseConnected.value = snapshot.val() === true;
  });
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  unsubscribeConnection?.();
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});

const status = computed(() => {
  if (!browserOnline.value) return { label: 'Offline', color: 'danger' };
  if (!firebaseConnected.value) return { label: 'Reconnecting…', color: 'warning' };
  return { label: 'Connected', color: 'success' };
});
</script>