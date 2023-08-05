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
      $('div.amenities h4').text(checkedAmenityText);
    }
  });
});
