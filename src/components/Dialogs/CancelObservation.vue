<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :block="true"
        color="red"
        icon="mdi-cancel"
        variant="plain"
      />
    </template>

    <template #default="{ isActive }">
      <v-card title="Annuler la sortie en cours">
        <v-card-text>
          Souhaitez-vous annuler la sortie en cours ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="isActive.value = false"
          >
            Non
          </v-btn>
          <v-btn
            color="green"
            prepend-icon="mdi-check"
            @click="cancelObservation"
          >
            Oui
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

  const emit = defineEmits(['cancelObservation'])

  function cancelObservation() {
      emit('cancelObservation')
  }
</script>
