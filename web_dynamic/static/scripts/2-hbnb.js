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
});
