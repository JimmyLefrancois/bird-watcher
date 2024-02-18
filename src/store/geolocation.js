import {defineStore} from "pinia";
import {ref} from "vue";

export const useGeolocationStore = defineStore('geolocation', () => {
  const watchId = ref(null)
  const latitude = ref(null)
  const longitude = ref(null)
  const geolocationPermission = ref(null)

  function successCallback(position) {
    geolocationPermission.value = true
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
    // Vous pouvez utiliser les coordonnées comme bon vous semble ici
  }

  function errorCallback(error) {
    console.error(`Erreur de géolocalisation: ${error.message}`);
  }

  function requestLocation() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        // Commencer à surveiller la position
        watchId.value = navigator.geolocation.watchPosition(successCallback, errorCallback);
      } else if (result.state === "denied") {
        // L'utilisateur a refusé la géolocalisation, traiter en conséquence
        console.log("L'utilisateur a refusé la géolocalisation");
      }
    });
  }

  function stopLocation() {
    if (watchId.value) {
      geolocationPermission.value = false
      navigator.geolocation.clearWatch(watchId.value);
      console.log("La géolocalisation a été arrêtée par l'utilisateur.");
    }
  }

  return {
    watchId,
    latitude,
    longitude,
    requestLocation,
    stopLocation,
    geolocationPermission
  }
})
