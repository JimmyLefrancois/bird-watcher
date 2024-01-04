<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-check"
        color="themeLightgreenColor"
        elevation="2"
        :block="true"
        text="Finaliser la sortie"
      />
    </template>

    <template #default="{ isActive }">
      <v-card title="Terminer la sortie en cours">
        <v-card-text>
          Souhaitez-vous finaliser la sortie en cours ?
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
            color="green"
            prepend-icon="mdi-check"
            @click="endObservation"
          >
            Finaliser
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

  const emit = defineEmits(['endObservation'])

  function endObservation() {
      emit('endObservation')
  }
</script>
