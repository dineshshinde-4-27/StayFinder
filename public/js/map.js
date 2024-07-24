console.log(mapToken);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: coordinates.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoomsatellite-streets-v12'
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5> ${coordinates.title}<p>Exacat location will provided after booking</p></h5>`
    )
  )
  .addTo(map);
