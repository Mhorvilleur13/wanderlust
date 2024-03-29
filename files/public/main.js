// Foursquare API Info
const clientId = "SOX0AHLQXUCWV1FS0IS25SAKSMS5U02E0CI5HNDPHAAPSX13";
const clientSecret = "BWM33HYXWAV5CA5HUEWQM32JHTD3BUTA5JM3GJHMAHJCNF1X";
const url = "https://api.foursquare.com/v2/venues/explore?near=";
const getVenuePhotosUrl = (venueId) =>
  `https://api.foursquare.com/v2/venues/${venueId}/photos?&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20210810`;

// OpenWeather Info
const openWeatherKey = "9db98f9200028683d3a986447afb65eb";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

// Page Elements
const $input = $("#city");
const $submit = $("#button");
const $destination = $("#destination");
const $container = $(".container");
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function shuffle(array) {
  const newArray = array.sort(() => 0.5 - Math.random());
  return newArray;
}
// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20210810`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = shuffle(
        jsonResponse.response.groups[0].items.map((item) => item.venue)
      );

      return venues;
    }
  } catch (error) {}
};

const getVenuePhotos = async (id) => {
  const urlToFetch = getVenuePhotosUrl(id);
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venuePhotoObj = jsonResponse.response.photos.items[0];

      if (!venuePhotoObj) return null;

      return venuePhotoObj.prefix + "300x300" + venuePhotoObj.suffix;
    }
  } catch (error) {}
};

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch (error) {}
};

// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(async ($venue, index) => {
    const venue = venues[index];

    const venueIcon = venue.categories && venue.categories[0].icon;

    const venueIconSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    const venueImgSrc = await getVenuePhotos(venue.id);
    let venueContent = createVenueHTML(
      venue.name,
      venue.location,
      venue.location.crossStreet, // is not used
      venueIconSrc,
      venueImgSrc
    );
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
};

const renderForecast = (day) => {
  // Add your code here:
  const weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $venueDivs.forEach((venue) => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then((venues) => renderVenues(venues));
  getForecast().then((forecast) => renderForecast(forecast));
  return false;
};

$submit.click(executeSearch);
