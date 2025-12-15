// Google Maps integration
import { CAMPUS_CENTER, MAP_OPTIONS } from './locations.js';

export class MapManager {
  constructor(mapElementId) {
    this.mapElement = document.getElementById(mapElementId);
    this.map = null;
    this.overlays = [];
    this.markers = [];
  }

  async initialize() {
    // Map is initialized via HTML script tag with callback
    this.map = new google.maps.Map(this.mapElement, {
      center: CAMPUS_CENTER,
      ...MAP_OPTIONS
    });
  }

  addDoubleClickListener(callback) {
    google.maps.event.addListener(this.map, 'dblclick', (event) => {
      callback(event.latLng.lat(), event.latLng.lng());
    });
  }

  showOverlay(bounds, isCorrect) {
    const color = isCorrect ? '#00FF00' : '#FF0000';
    const opacity = 0.4;

    const rectangle = new google.maps.Rectangle({
      bounds: {
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west
      },
      fillColor: color,
      fillOpacity: opacity,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: this.map
    });

    this.overlays.push(rectangle);
    this.animateOverlay(rectangle);

    return rectangle;
  }

  animateOverlay(rectangle) {
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.05;
      rectangle.setOptions({ fillOpacity: opacity });
      if (opacity >= 0.4) {
        clearInterval(fadeIn);
      }
    }, 30);
  }

  clearOverlays() {
    this.overlays.forEach((overlay) => overlay.setMap(null));
    this.overlays = [];
  }

  addMarker(lat, lng, label) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      label: label,
      animation: google.maps.Animation.DROP
    });

    this.markers.push(marker);
    return marker;
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }
}
