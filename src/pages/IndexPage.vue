<template>
  <q-page class="row">
    <q-dialog
      v-model="detail_dialog"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="mdialog" :style="searchw">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-img :src="'img/'+current_place?.id + '.png'"  >

          <template v-slot:error>
            <q-img src="p.jpg">

            </q-img>
      </template></q-img>
        <q-card-section>
          <div class="row">
          <div class="text-h6 col">{{ current_place?.name }} </div>
          <q-btn
            flat
            icon="mdi-navigation"
            @click="goTo(current_place?.longitude, current_place?.latitude)"
            dense
            >Itinéraire</q-btn
          >
</div>
          <q-chip v-if="current_place?.internal_food" dense icon="mdi-silverware"
            >Restauration scolaire</q-chip
          >
          <q-chip v-if="current_place?.food_space" dense icon="mdi-table-picnic"
            >Espace repas</q-chip
          >
          <q-chip v-if="current_place?.parking > 0" v dense icon="mdi-parking">
            <span v-if="current_place?.parking == 1"
              >(Formateur seulement)</span
            >
            <span v-if="current_place?.parking == 2"
              >Parking</span
            >
          </q-chip>

        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ current_place?.address }} - {{ current_place?.city }} <br />
          <q-icon
            v-if="current_place?.public_transport"
            name="mdi-bus"
          ></q-icon>
          {{ current_place?.public_transport_comment }}
          <br />
        </q-card-section>
        <q-card-section v-if="room_filtered">
          Vos filtres...
          <div class="q-gutter-xs">
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
              Equipement informatique
            </q-chip>
            <q-chip
              removable
              dense
              v-if="room_filters.projection != false"
              @remove="room_filters.projection = false"
              color="secondary"
              text-color="white"
              icon="mdi-projector"
            >
              Equipement de projection
            </q-chip>

            <q-chip
              removable
              dense
              v-if="room_filters.type != 'Tout'"
              @remove="room_filters.type = 'Tout'"
              color="warning"
              text-color="white"
              icon="mdi-map-marker"
            >
              {{ room_filters.type }}
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Salles</div>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              :label="r.name"
              :caption="r.type"
              v-for="r in current_rooms"
              :key="r.name"
              v-model="r.exp"
            >
              <q-card>
                <q-card-section>
                  <q-chip icon="mdi-account-group"
                    >{{ r.capacity }} places</q-chip
                  >
                  <q-chip v-if="r.wifi" icon="wifi">Wifi</q-chip>
                  <q-chip v-if="r.disabled" icon="fa-solid fa-wheelchair"
                    >Accès PMR</q-chip
                  >
                  <q-chip v-if="r.projection" icon="mdi-projector"
                    >Projection</q-chip
                  >
                  <q-chip v-if="r.visio" icon="mdi-laptop"
                    >Visioconférence</q-chip
                  >
                  <q-chip v-if="r.computer" icon="mdi-desktop-classic"
                    >Equipement informatique</q-chip
                  >
                </q-card-section>
                <q-card-section>{{ r.computer_info }}</q-card-section>

                <q-card-actions>
                  <q-space></q-space><q-btn color="primary" label="Réserver" :href="bookNormalize(r)" target="_blank"
                /></q-card-actions>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div ref="mapItem" style="width: 100vw; height: 100hw"></div>
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-banner
        v-if="places.length == 0"
        inline-actions
        dense
        rounded
        class="bg-primary text-white"
      >
        Aucune salle trouvée...
        <template v-slot:action>
          <q-btn
            flat
            color="white"
            @click="resetFilters"
            label="Réinitialiser"
          />
        </template>
      </q-banner>
    </q-page-sticky>
    <q-page-sticky position="top" :offset="[18, 18]">
      <search-component></search-component>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { CreateMap } from 'src/data/MapData';
import { Room } from 'src/data/GeodataType';

import {
  SetCurrentMap,
  room_filtered,
  room_filters,
  detail_dialog,
  current_place,
  setCurrentPlace,
  places,
} from 'src/data/GeoData';
import 'ol/ol.css';
import { useQuasar } from 'quasar';
import { resetFilters } from 'src/data/GeoData';
import SearchComponent from 'src/components/SearchComponent.vue';

const $q = useQuasar();

const searchw = computed(() => {
  if ($q.screen.lt.sm) {
    return 'width: 80vw';
  }
  if ($q.screen.lt.md) {
    return 'width: 90vw';
  }

  return 'width: 40vw';
});
const current_rooms = computed(() => {
  if (current_place == null || current_place == undefined) {
    return [];
  }
  return current_place.value?.rooms.filter((r) => r.visible == true);
});

const mapItem = ref();
function goTo(long: number, lat: number) {
  console.log('geo:' + lat + ',' + long);
  window.location = 'geo:' + lat + ',' + long;
}

function bookNormalize(r: Room) {
  if (r.book) {
    if (r.book.startsWith('mailto')) {
    return r.book + '?subject=Réservation salle - '+ r.name + ' - Lieu : ' + r.place_name
  }
  return r.book
  }

}

onMounted(() => {
  SetCurrentMap(
    CreateMap(mapItem.value, (e) => {
      setCurrentPlace(e);
    })
  );
});
</script>
<style></style>
