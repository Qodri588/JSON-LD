$(function() {

  // start a prototype function to make it easier to capitalize everything using JS
  String.prototype.capitalize = function() {
    var split = this.split(''),
        upper = false;
    $(split).each(function(i) {
      if (upper == false) {
        split[i] = this.toUpperCase();
        upper = true;
      }
      if (this == ' ') {
        upper = false;
      }
    });
    var join = split.join('');
    return join;
  };
  Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
      if (obj.hasOwnProperty(key))
        size++;
    }
    return size;
  };

  //function to populate the form selector based
  //on the forms that are available.

  $('form').each(function() {
    if ($(this).attr('id') != 'selector') {
      var option = $(this).attr('id'),
          friendlyOption = option.replace('_', " ");
      $('select#form-selector').append('<option value="' + option + '">' + friendlyOption.capitalize() + '</option>');
    };
  });
  $('option').each(function() {
    //console.log($(this).html());
    if (!$(this).html() || $(this).html() === "") {
      $(this).html($(this).val());
    }
  });
  var selected,
      old,
      days = [];

  //changes the displayed form based on the selection

  var $timeKeeper = $('#timeKeeper').html();
  /* if the openDays checkbox is checked then start the process to add
   * the hour selections
   */

  $('.openDays').change(function() {
    if ($(this).is(':checked')) {
      // instantiate the days object/array
      days = [];
      // start building the days object
      $(this).after($timeKeeper);
      $('.openDays', selected).each(function() {
        if ($(this).is(':checked')) {
          days.push($(this).data('day'));
        }
      });
    } else {
      // if the checkbox is unchecked then remove the day from the object
      $('.openHours, .closeHours', $(this).parent()).remove();
      var p = $.inArray($(this).data('day'), days);
      days.splice(p, 1);
    }
  });

  // this is going to add the times to the days object
  $(document).on('change', '.openHours select, .closeHours select, .openDays', function() {
    var hourObj = hourCheck(days, selected),
        prevDayHours;
    var dayList = '',
        $openingHours = $('.openingHours', selected);
    // map the keys of the hourObj and add a 'used' property
    // the used property will let us know if that key is added to the string
    var hourKeys = Object.keys(hourObj).map(function(key) {
      return {
        key : key,
        used : false
      };
    });

    // iterate through the keys
    hourKeys.forEach(function(keyObj, i) {

      // if this key has been used already get outta here
      if (keyObj.used) {
        return;
      }
      var size = hourKeys.length;
      var currentTime = hourObj[keyObj.key];
      // the time string for this key

      keyObj.used = true;
      // set this key as used
      dayList += keyObj.key;
      // go ahead and add this key to the main string

      // iterate through the keys again to see if any other time strings match the current one
      hourKeys.forEach(function(k) {
        // if this key has been used or is the same one we're on in the outer
        // forEach, return out
        if (k.used || k.key === keyObj.key) {
          return;
        }

        // check if the currentTime and the inner iteration key have the same time
        if (currentTime === hourObj[k.key]) {
          dayList += ', ' + k.key;
          // add it to the main string
          k.used = true;
          // set it as used
        }
      });

      dayList += ' ' + currentTime;
      // add the time to the string

      if (i < size - 1) {
        dayList += ' ';
        // throw a space in there if it's not the last item in the list
      }
    });
    dayList = dayList.trim();
    // trim it just in case

    $openingHours.val(dayList);
    $openingHours.change();

  });

  // this function creates an object from the days/times selected
  function hourCheck(days, selected) {
    var hours = {},
        $days = $(days);
    $days.each(function() {
      var _this = this;
      var openTime,
          closedTime,
          time;
      $('.days', selected).each(function() {
        if ($(this).hasClass(_this)) {
          openTime = $('.openHours select', this).val();
          closedTime = $('.closeHours select', this).val();
          time = openTime + '-' + closedTime;
          hours[_this] = time;
        }
      });
    });
    return hours;
  }


  $('.mapHelp').tooltipster({
    content : $('<p><strong>How to obtain a Google map URL of your business:</strong></p><br/><ol><li>Go to google.com/maps and search for your business by name.</li><li>Next, click on the <strong>gear icon</strong> at the bottom-right of the page</li><li>Select &ldquo;Share and embed map&rdquo;</li><li>Then copy and paste the URL or use the short URL.</li></ol>'),
    trigger : 'click'
  });

  var sameAsField = $('#sameAsHidden').html(),
      $label = $('label[for=sameAs]', selected),
      $sameAsField = $('.sameAsField', selected),
      sameAsUrls = [],
      sameAsCount = 0,
      sameAsString = "";

  $('.addUrl').click(function(e) {
    e.preventDefault();
    if ($('.url', selected).next('.sameAsField').length === 0) {
      $label.css('display', 'initial');
      $label.after(sameAsField);
      $sameAsField.last().attr('name', 'sameAs_' + sameAsCount);
      $('.removeUrl', selected).css('display', 'initial');
      sameAsCount++;
    } else {
      $sameAsField.last().after(sameAsField);
      $sameAsField.last().attr('name', 'sameAs_' + sameAsCount);
      sameAsCount++;
    }
  });
  $('.removeUrl').click(function(e) {
    e.preventDefault();
    if ($sameAsField.length > 1) {
      $sameAsField.last().remove();
      sameAsCount--;
    } else {
      $sameAsField.last().remove();
      $('.url', selected).next('.sameAsField').remove();
      $('label[for=sameAs]', selected).css('display', 'none');
      $('.removeUrl', selected).css('display', 'none');
      sameAsCount--;
    }
  });

  $(document).on('blur', '.sameAsField', function() {
    sameAsString = '';
    $sameAsField.each(function(index) {
      sameAsUrls[index] = ($(this).val());
    });
    $(sameAsUrls).each(function(r) {
      if (r < sameAsUrls.length - 1) {
        sameAsString += sameAsUrls[r] + ";;";
      }
      if (r == sameAsUrls.length - 1) {
        sameAsString += sameAsUrls[r];
      }
    });
    if (sameAsString.length > 0) {
      $('.sameAsData').val(sameAsString);
      $('.sameAsData').change();
    }
  });
  $("#reset").click(function() {
    $("pre").html("");
    sameAsCount = 0;
    $('input,textarea,select', selected).each(function() {
      if ($(this).attr('type') != 'hidden') {
        $(this).val("");
      }
    });
    $('#formholder form:not(#selector)').each(function() {
      $(this).css('display', 'none');
    });
  });

  $("#selector").change(function() {
    old = selected;
    selected = "#" + $("#selector option:selected").val();
    if (old) {//closes the old form
      $(old).slideToggle();
    }
    $(selected).slideToggle();
    $("pre").html("");
    // clears out the <pre> container for the next one
    //cycles through the elements of the form and
    //clears the value on change.
    $('input,textarea').each(function() {
      if ($(this).attr('type') != 'hidden') {
        $(this).val("");
      };
    });

    //this function clears the <pre> and all fields

    //instantiate the object
    var element = {},
        $input = $(selected + ' input,' + selected + ' textarea,' + selected + ' select'),
        $rating = $('.rating', selected),
        $reviews = $('.reviews', selected),
        $contact = $('.contactType', selected),
        $phone = $('.telephone', selected),
        $address = $('.address', selected),
        $city = $('.addressLocality', selected),
        $poBox = $('.po-box', selected),
        $offerDesc = $('.offerDesc', selected),
        $offerURL = $('.offerURL', selected),
        $offerPrice = $('.offerPrice', selected),
        $locationName = $('.location-name', selected),
        $locationURL = $('.location-url', selected);
    $geoLat = $('.geoLat', selected);
    $geoLong = $('.geoLong', selected);

    // fire when a key is pressed in an input or textarea
    $(document).on('keyup', $input, function() {

      // this iterates through the whole form.  @TODO see if there's a better way
      element = {};
      // this is highly inefficient, but it keeps things in order
      $input.each(function(e) {
        //selects the data-path attr and splits it if necessary.
        //the first is checked to see if it's alreay the key
        //and the second is used as the inner array
        if ($(this).data('path')) {
          var path = $(this).data('path').split('.');

          currentData = element;

          for (var i = 0; i < path.length - 1; i++) {
            if (!currentData[path[i]]) {
              //if the first part of data-path doesn't exist then it becomes
              //the key for this array
              currentData[path[i]] = {};
            }
            currentData = currentData[path[i]];
          }

          //if it's empty, then it doesn't exist
          currentData[path[path.length - 1]] = null;
          if ($(this).val().length > 0) {
            if (path == 'sameAs') {
              currentData[path[path.length - 1]] = $(this).val().split(';;');
            } else if (path == '@type') {
              currentData[path[path.length - 1]] = $(this).val().split(' ').join('');
            } else {
              currentData[path[path.length - 1]] = $(this).val();
            }
          }
          if (currentData[path[path.length - 1]] === null) {
            //get rid of the data that doesn't exist
            delete currentData[path[path.length - 1]];
          }
          //clear the empty values
          if (!$rating.val() && !$reviews.val()) {
            delete element.aggregateRating;
          }

          if (!$contact.val() && !$phone.val()) {
            delete element.contactPoint;
          }

          if (!$address.val() && !$city.val() && !$poBox.val()) {
            delete element.address;
            if (!$locationName.val() && !$locationURL.val()) {
              delete element.location;
            }
          }

          if (!$offerDesc.val() && !$offerURL.val() && !$offerPrice.val()) {
            delete element.offers;
          }

          if (!$geoLat.val() && !$geoLong.val()) {
            delete element.geo;
          }

          //prep it for output
          $(".json").val("<scri" + "pt type='application/ld+json'> \n" + JSON.stringify(element, null, 2) + "\n </scri" + "pt>");
        }
      });
    });
  });
});
