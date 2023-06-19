<template>

  <router-view v-if="!loading && !error" />
  <q-layout view="hHh lpR fFf">
    <q-page-container>
    <q-page v-if="loading" >
      <div class="row justify-center q-pa-md">
    <q-spinner color="primary" class="row justify-center q-pa-md" size="100" >

    </q-spinner>
  </div>
    <div class="row justify-center text-h4">Chargement</div>


  </q-page>
  <q-page v-if="error" >
    <q-banner inline-actions class="text-white bg-red">
      Impossible de charger les données.
      <template v-slot:action>
        <q-btn flat color="white" label="Réessayer ?"  @click="fetchData" />
      </template>
    </q-banner>
    <div class="row justify-center text-h4">Une erreur s'est produite</div>
  </q-page>
</q-page-container>
  </q-layout>

</template>

<script setup lang="ts">

import {onMounted, ref} from 'vue'
import axios  from 'axios';
import { colors } from 'quasar';
import {setData, loading} from '../src/data/GeoData'


const error = ref(false)
onMounted(()=>{
fetchData()
})


function fetchData() {
  error.value=false
  loading.value = true
  axios.get('data.json').then((r)=> setData(r.data)).catch(e=>{
    loading.value = false
    error.value = true
  })
}
</script>
