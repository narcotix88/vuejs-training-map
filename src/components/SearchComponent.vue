<template>
  <q-dialog v-model="filter_visible">
    <q-card :style="searchw">
      <q-card-section>
        <div class="text-h6">Recherche avancée</div>
        <q-separator></q-separator>
      </q-card-section>
      <q-card-section>
        <filter-component @close="filter_visible = false"></filter-component>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-card :style="searchw">
    <q-card-section>
      <div class="row">
        <q-input
          class="col-10"
          v-model="search_term"
          clearable
          label="Chercher"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
        <q-btn
          class="col-2"
          flat
          color="primary"
          dense
          @click="
            () => {
              filter_visible = true;
              search_term = undefined;
            }
          "
          icon="mdi-filter"
          >FILTRER</q-btn
        >
      </div>
      <div class="row" ref="filterElement">
        <div class="col-10 q-gutter-md">
          <div class="q-gutter-xs">
            <q-chip
              removable
              dense
              v-if="filter_dep !== 'Tout'"
              @remove="filter_dep = 'Tout'"
              color="negative"
              text-color="white"
              icon="mdi-map-marker"
            >
              {{ filter_dep }}
            </q-chip>
            <q-chip
              dense
              removable
              v-if="room_filters.capacity != 1"
              @remove="room_filters.capacity = 1"
              color="primary"
              text-color="white"
              icon="mdi-account-multiple"
            >
              Capacité > {{ room_filters.capacity }}
            </q-chip>
            <q-chip
              removable
              dense
              v-if="room_filters.computer != false"
              @remove="room_filters.computer = false"
              color="secondary"
              text-color="white"
              icon="mdi-desktop-classic"
            >
              Informatique
            </q-chip>
            <q-chip
              removable
              dense
              v-if="room_filters.projection != false"
              @remove="room_filters.projection = false"
              color="info"
              text-color="white"
              icon="mdi-projector"
            >
              Projection
            </q-chip>

            <q-chip
              removable
              dense
              v-if="room_filters.type !== 'Tout'"
              @remove="room_filters.type = 'Tout'"
              color="warning"
              text-color="white"
              icon="mdi-office-building"
            >
              {{ room_filters.type }}
            </q-chip>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="searching">
      <q-separator></q-separator>

      <q-list
        style="max-height: 70vh; overflow: auto"
        v-if="f_places?.length > 0"
      >
        <q-item
          clickable
          v-ripple
          @click="open(p.id)"
          v-for="p in f_places"
          :key="p.id"
        >
          {{ p.name }}</q-item
        >
      </q-list>

      <span v-if="f_places?.length == 0">Aucun résultat</span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { places } from 'src/data/GeoData';
import FilterComponent from './FilterComponent.vue';
import { room_filters, filter_dep, setCurrentPlace } from 'src/data/GeoData';

const $q = useQuasar();
const searchw = computed(() => {
  if ($q.screen.lt.sm) {
    return 'width: 80vw';
  }
  if ($q.screen.lt.md) {
    return 'width: 80vw';
  }

  return 'width: 40vw';
});

const search_term = ref('');

const filter_visible = ref(false);

const f_places = computed(() => {
  if (search_term.value == '' || search_term.value == null) {
    return undefined;
  }
  return places.value.filter((p) =>
    p.name.toUpperCase().includes(search_term.value.toUpperCase())
  );
});

const searching = computed(() => {
  if (search_term.value == '') {
    return false;
  }
  if (search_term.value == null) {
    return false;
  }
  return true;
});

function open(pid) {
  search_term.value = '';
  setCurrentPlace(pid);
}
</script>
