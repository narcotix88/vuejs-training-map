import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';

import { Place } from './GeodataType';

export function CreateMap(
  mapItem: HTMLElement,
  callback: (arg0: string) => any
): Map {
  const map = new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    moveTolerance: 1,
    target: mapItem,
    view: new View({
      center: [225369.546496334, 6247004.404217467],
      zoom: 10,
    }),
  });

  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
  });
  map.on('singleclick', async function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });

    if (!feature) {
      console.log('NOTING');
      return;
    }

    evt.preventDefault();
    callback(feature.values_.id);
  });
  return map;
}

const styles = {
  route: new Style({
    stroke: new Stroke({
      width: 6,
      color: [237, 212, 0, 0.8],
    }),
  }),
  icon: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'pin.png',
      width: 50,
    }),
  }),
};

export function updateMarkers(places: Place[], map: Map) {
  map.getLayers().forEach((layer) => {
    if (layer.get('name') && layer.get('name') == 'pin') {
      map.removeLayer(layer);
    }
  });
  const markers = [];
  for (const m of places) {
    markers.push(
      new Feature({
        geometry: new Point(fromLonLat([m.longitude, m.latitude])),
        type: 'icon',
        id: m.id,
      })
    );
  }

  const layer = new VectorLayer({
    name: 'pin',
    source: new VectorSource({
      features: markers,
    }),
    style: function (feature) {
      return styles[feature.get('type')];
    },
  });

  map.addLayer(layer);
}
