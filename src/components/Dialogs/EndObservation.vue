<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-check"
        color="themeLightgreenColor"
        elevation="2"
        height="100%"
        :block="true"
        :disabled="observationLoader"
        :loading="observationLoader"
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
            :disabled="observationLoader"
            :loading="observationLoader"
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
  defineProps({
    observationLoader: {type: Boolean, default: null}
  })

  function endObservation() {
      emit('endObservation')
  }
</script>
