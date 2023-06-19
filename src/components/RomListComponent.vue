<template>
  <div v-for="p in places" :key="p.id">
    <q-item-label header>{{ p.name }}</q-item-label>
    <q-item
      clickable
      v-ripple
      v-for="r in p.rooms"
      :key="r.id"
      @click="setCurrentRoom(r)"
    >
      <q-item-section>
        <q-item-label>{{ r.name }}</q-item-label>
        <q-item-label caption>{{ r.type }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption>Capacité {{ r.capacity }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </div>
</template>

<script setup lang="ts">
import { computed, Prop } from 'vue';
import { Place } from '../data/GeodataType';
import { setCurrentRoom } from 'src/data/GeoData';

export interface RomListProps {
  places: Place[];
}
const props = withDefaults(defineProps<RomListProps>(), {});
</script>
