<template>
  <p class="mt-2">
    Filtrer par type de sortie
  </p>
  <v-btn-toggle
    elevation="1"
    style="width: 100%"
    color="themeLightgreenColor"
    :divided="true"
    v-model="type"
  >
    <v-btn
      :value="1"
      width="50%"
    >
      <v-icon>
        mdi-home
      </v-icon>
      <span>Affût</span>
    </v-btn>
    <v-btn
      :value="2"
      width="50%"
    >
      <v-icon>
        mdi-walk
      </v-icon>
      <span>Promenade</span>
    </v-btn>
  </v-btn-toggle>
</template>
<script setup>
const type = defineModel({type: Number, required: false})
</script>
