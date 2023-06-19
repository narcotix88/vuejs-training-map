<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Lieux de formation </q-toolbar-title>

        <q-btn dense flat round icon="mdi-magnify" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="q-pa-md">
        <div class="row">
          <div class="text-h6 col-10">Lieux de formation</div>
          <q-btn
            class="col-2"
            flat
            rounded
            icon="close"
            @click="leftDrawerOpen = false"
          ></q-btn>
        </div>
      </div>
      <RomListComponent :places="places" />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <div class="q-pa-md">
        <div class="row">
          <div class="text-h6 col-10">Filtrer</div>
          <q-btn
            class="col-2"
            flat
            rounded
            icon="close"
            @click="rightDrawerOpen = false"
          ></q-btn>
        </div>
      </div>
      <FilterComponent />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import RomListComponent from 'src/components/RomListComponent.vue';
import FilterComponent from 'src/components/FilterComponent.vue';
import { places } from 'src/data/GeoData';

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
