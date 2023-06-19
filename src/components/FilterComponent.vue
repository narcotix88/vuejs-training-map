<template>
  <div class="q-pa-md">
    <q-select
      label="Département"
      v-model="filter_dep"
      :options="['Tout', '78', '91', '92', '95']"
    ></q-select>

    <q-select
      label="Type de salle"
      v-model="room_filters.type"
      :options="all_types"
    ></q-select>

    <q-checkbox
      v-model="room_filters.projection"
      label="Equipement de projection"
    />
    <q-checkbox v-model="room_filters.computer" label="Equipement informatique">
    </q-checkbox>

    <q-input
      v-model.number="tmp_capacity"
      type="number"
      prefix="Nombre de places : "
      :rules="[
        (v) => {
          return v > 0;
        },
      ]"
      error-message="La capacité doit être supérieure à 1"
    >
    </q-input>
  </div>
  <div class="q-pa-md row">
    <q-btn
      class="col"
      color="secondary"
      :disabled="!filtered"
      @click="resetFilters"
      >Réinitialiser</q-btn
    >
  </div>
  <div class="q-pa-md row">
    <q-btn class="col" color="primary" @click="emit('Close')">Fermer</q-btn>
  </div>
</template>

<script setup lang="ts">
import {
  filter_dep,
  room_filters,
  filtered,
  resetFilters,
  all_types,
} from 'src/data/GeoData';
import { defineEmits, watch, ref, onMounted } from 'vue';
const emit = defineEmits(['Close']);

const tmp_capacity = ref(1);

watch(tmp_capacity, (n, o) => {
  if (n > 0) {
    room_filters.value.capacity = n;
  } else {
    room_filters.value.capacity = 1;
  }
});

onMounted(() => {
  tmp_capacity.value = room_filters.value.capacity;
});
</script>
