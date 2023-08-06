$(document).ready(function () {
  const checkedAmenities = {};

  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }

    let checkedAmenityText = '';
    for (const [key] of Object.entries(checkedAmenities)) {
      if (checkedAmenityText !== '') {
        checkedAmenityText += ', ';
      }
      checkedAmenityText += checkedAmenities[key];
    }
    if (checkedAmenityText === '') {
      $('div.amenities h4').html('&nbsp;');
    } else {
      if (checkedAmenityText.length > 32) { checkedAmenityText = checkedAmenityText.slice(0, 29) + '...'; }
      $('div.amenities h4').text(checkedAmenityText);
    }
  });

  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (resp) {
      const stat = resp.status;
      if (stat === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (places) {
      for (const id in places) {
        const place = places[id];
        const article = '<article><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div><div class="information"><div class="max_guest">' + displayProperLabelByCount('Guest', place.max_guest) + '</div><div class="number_rooms">' + displayProperLabelByCount('Bedroom', place.number_rooms) + '</div><div class="number_bathrooms">' + displayProperLabelByCount('Bathroom', place.number_bathrooms) + '</div></div><div class="description">' + place.description + '</div></article>';
        $('.places').append(article);
      }
    }
  });

  function displayProperLabelByCount (label, count) {
    if (count === 1) {
      return count + ' ' + label;
    } else {
      return count + ' ' + label + 's';
    }
  }
});
