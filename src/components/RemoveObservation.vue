<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-if="mode === 'condensed'"
        v-bind="props"
        size="small"
        variant="text"
        color="red"
        density="compact"
        icon="mdi-delete"
      />
      <v-btn
        v-else
        v-bind="props"
        color="red"
        size="small"
        prepend-icon="mdi-delete"
      >
        Supprimer
      </v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="Supprimer l'observation">
        <v-card-text>
          Souhaitez-vous vraiment supprimer cette observation ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="isActive.value = false"
          >
            Annuler
          </v-btn>
          <v-btn
            :disabled="observationLoader"
            :loading="observationLoader"
            color="green"
            prepend-icon="mdi-check"
            @click="removeObservation"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

const emit = defineEmits(['removeObservation'])

defineProps({
  observationLoader: {type: Boolean, default: null},
  mode: {type: String, default: null}
})

function removeObservation() {
  emit('removeObservation')
}
</script>
