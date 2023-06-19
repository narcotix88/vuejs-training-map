
import { Place, Room ,GeoData} from './GeodataType';

import { computed, ComputedRef, ref, Ref } from 'vue';
import Map from 'ol/Map.js';
import { updateMarkers } from './MapData';


 const data: Ref<GeoData> = ref({'all_types':[], 'places':[]})

 export const loading: Ref<boolean> = ref(true)


export const all_types = ref(data.value.all_types);

export const detail_dialog = ref(false);

export const currentMap: Ref<Map | undefined> = ref(undefined);

export const filter_dep: Ref<string> = ref('Tout');

export const room_filters: Ref<{
  type: string;
  capacity: number;
  projection: boolean;
  computer: boolean;
}> = ref({
  type: 'Tout',
  capacity: 1,
  projection: false,
  computer: false,
});

export const places = computed(() => {
  //let res: Place[] = structuredClone(data.places);
  let res: Place[] = JSON.parse(JSON.stringify(data.value.places));
  if (filter_dep.value != 'Tout') {
    console.log('filterdep');
    res = res.filter((p) => p.dep == filter_dep.value);
  }
  for (const p of res) {
    if (room_filters.value.type != 'Tout') {
      p.rooms = p.rooms.filter((r) => r.type == room_filters.value.type);
    }
    if (room_filters.value.capacity !== 1) {
      p.rooms = p.rooms.filter(
        (r) => r.capacity >= room_filters.value.capacity
      );
    }
    if (room_filters.value.projection == true) {
      p.rooms = p.rooms.filter((r) => r.projection == true);
    }
    if (room_filters.value.computer == true) {
      p.rooms = p.rooms.filter((r) => r.computer == true);
    }
  }
  res = res.filter((r) => r.rooms.length > 0);
  if (currentMap.value != undefined) {
    updateMarkers(res, currentMap.value);
  }
  return res;
});

export const current_place: Ref<Place | null> = ref(null);

export function setCurrentRoom(room: Room) {
  getPlaceById(room.place).rooms.forEach((r) => (r.exp = false));
  room.exp = true;
  setCurrentPlace(room.place);
}

export function setCurrentPlace(place_id: string) {
  current_place.value = getPlaceById(place_id);
  detail_dialog.value = true;
}

export function resetFilters() {
  room_filters.value.type = 'Tout';
  filter_dep.value = 'Tout';
  room_filters.value.capacity = 1;
  room_filters.value.projection = false;
  room_filters.value.computer = false;
}

export const filtered: ComputedRef<boolean> = computed(() => {
  return (
    room_filters.value.type !== 'Tout' ||
    filter_dep.value != 'Tout' ||
    room_filters.value.computer != false ||
    room_filters.value.projection != false ||
    room_filters.value.capacity != 1
  );
});

export const room_filtered: ComputedRef<boolean> = computed(() => {
  return (
    room_filters.value.type !== 'Tout' ||
    room_filters.value.computer != false ||
    room_filters.value.projection != false ||
    room_filters.value.capacity != 1
  );
});

export function SetCurrentMap(m: Map) {
  currentMap.value = m;
  updateMarkers(places.value, m);
}

function getPlaceById(pid: string): Place {
  const place: Place[] | undefined = places.value.filter((p) => {
    return p.id == pid;
  });
  if (place != undefined) {
    return place[0];
  } else {
    throw 'not found';
  }
}


export function setData(k:GeoData) {
  k.all_types.forEach((t:string)=> {
    data.value.all_types.push(t)
  })
  k.places.forEach((t:Place)=>{
    data.value.places.push(t)
  })
 loading.value = false
}
