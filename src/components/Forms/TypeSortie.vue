<template>
  <v-btn-toggle
    elevation="1"
    style="width: 100%"
    class="mb-3"
    color="themeLightgreenColor"
    :divided="true"
    mandatory
    :error-messages="v$.type.$errors.map(e => e.$message)"
    @blur="v$.type.$touch()"
    @update:model-value="setType"
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
import {ref} from "vue";
import {helpers, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const emits = defineEmits(['setTypeSortie'])

const props = defineProps({
  scope: {
    type: String,
    default: null
  },
  observation: {
    type: Object,
    default: null
  }
})

const type = ref(null)

if (props.observation) {
  type.value = props.observation.type
}

const rules = {
  type: {required: helpers.withMessage('Ce champs est obligatoire.', required)}
}

const v$ = useVuelidate(rules, {type}, { $scope: props.scope })

function setType() {
  emits('setTypeSortie', type)
}
</script>
