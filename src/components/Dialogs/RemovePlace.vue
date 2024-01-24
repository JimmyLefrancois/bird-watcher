<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-delete"
        color="red"
        variant="text"
        density="compact"
      />
    </template>

    <template #default="{ isActive }">
      <v-card title="Supprimer ce lieu">
        <v-card-text>
          Souhaitez-vous vraiment supprimer ce lieu ?
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
            :disabled="placeLoader"
            :loading="placeLoader"
            color="green"
            prepend-icon="mdi-check"
            @click="removePlace(isActive)"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

const emit = defineEmits(['removePlace'])

defineProps({
  placeLoader: {type: Boolean, default: null},
  mode: {type: String, default: null}
})

function removePlace(isActive) {
  emit('removePlace')
  isActive.value = false
}
</script>
