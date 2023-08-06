$(document).ready(function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};

  $('.amenities input[type="checkbox"]').change(function () {
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

  $('.locations input[type="checkbox"]').change(function () {
    const locationId = $(this).data('id');
    const locationName = $(this).data('name');
    const parentUl = $(this).closest('ul');
    const listClass = parentUl.attr('class');

    if (listClass === 'states') {
      if ($(this).is(':checked')) {
        checkedStates[locationId] = locationName;
      } else {
        delete checkedStates[locationId];
      }
    } else if (listClass === 'cities') {
      if ($(this).is(':checked')) {
        checkedCities[locationId] = locationName;
      } else {
        delete checkedCities[locationId];
      }
    }

    let checkedLocationText = '';
    const checkedLocations = $.extend({}, checkedStates, checkedCities);
    for (const [key] of Object.entries(checkedLocations)) {
      if (checkedLocationText !== '') {
        checkedLocationText += ', ';
      }
      checkedLocationText += checkedLocations[key];
    }
    if (checkedLocationText === '') {
      $('div.locations h4').html('&nbsp;');
    } else {
      if (checkedLocationText.length > 32) { checkedLocationText = checkedLocationText.slice(0, 29) + '...'; }
      $('div.locations h4').text(checkedLocationText);
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
        const article = '<article id=' + place.id + '><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div><div class="information"><div class="max_guest">' + displayProperLabelByCount('Guest', place.max_guest) + '</div><div class="number_rooms">' + displayProperLabelByCount('Bedroom', place.number_rooms) + '</div><div class="number_bathrooms">' + displayProperLabelByCount('Bathroom', place.number_bathrooms) + '</div></div><div class="description">' + place.description + '</div></article>';
        $('.places').append(article);
        handleReviews(place, function (reviews) {
          const review = '<div class="reviews"><h2>' + displayReviewsByCount(reviews.length) + '<span class="reviews-toggle" data-place="' + place.id + '">show</span></h2></div>';
          $('article#' + place.id).append(review);
          $('span').on('click', function () {
          });
        });
      }
    }
  });

  $(document).on('click', '.reviews-toggle', function () {
    const buttonState = $(this).text();
    const placeId = $(this).data('place');

    if (buttonState === 'show') {
      $.ajax({
        type: 'GET',
        url: 'http://0.0.0.0:5001/api/v1/places/' + placeId + '/reviews',
        success: function (reviews) {
          let reviewContent = '<ul>';
          $.each(reviews, function (index, element) {
            reviewContent += '<li><h3>Posted on ' + formatDate(element.updated_at) + '</h3><p>' + element.text + '</p>' + '</li>';
          });
          reviewContent += '</ul>';
          $('article#' + placeId + ' .reviews').append(reviewContent);
        }
      });
      $(this).text('hide');
    } else if (buttonState === 'hide') {
      $('article#' + placeId + ' .reviews ul').remove();
      $(this).text('show');
    }
  });

  $('button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities: Object.keys(checkedAmenities), states: Object.keys(checkedStates), cities: Object.keys(checkedCities) }),
      contentType: 'application/json',
      success: function (places) {
        $('.places').empty();
        for (const id in places) {
          const place = places[id];
          const article = '<article id=' + place.id + '><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div><div class="information"><div class="max_guest">' + displayProperLabelByCount('Guest', place.max_guest) + '</div><div class="number_rooms">' + displayProperLabelByCount('Bedroom', place.number_rooms) + '</div><div class="number_bathrooms">' + displayProperLabelByCount('Bathroom', place.number_bathrooms) + '</div></div><div class="description">' + place.description + '</div></article>';
          $('.places').append(article);
          handleReviews(place, function (reviews) {
            const review = '<div class="reviews"><h2>' + displayReviewsByCount(reviews.length) + '<span class="reviews-toggle" data-place="' + place.id + '">show</span></h2></div>';
            $('article#' + place.id).append(review);
            $('span').on('click', function () {
            });
          });
        }
      }
    });
  });

  function displayProperLabelByCount (label, count) {
    if (count === 1) {
      return count + ' ' + label;
    } else {
      return count + ' ' + label + 's';
    }
  }

  function handleReviews (place, callback) {
    $.ajax({
      type: 'GET',
      url: 'http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews',
      success: function (reviews) {
        callback(reviews);
      }
    });
  }

  function displayReviewsByCount (count) {
    if (count === 1) {
      return count + ' Review';
    } else {
      return count + ' Reviews';
    }
  }

  function formatDate (dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    return day + ' ' + month + ' ' + year;
  }
});
