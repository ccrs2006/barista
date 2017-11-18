   // Initialize Firebase
  var config = {
      apiKey: "AIzaSyAeN_TFadUAu1YbATQVRBfDeWAyM5mBuRQ",
      authDomain: "barista-project-1504977810719.firebaseapp.com",
      databaseURL: "https://barista-project-1504977810719.firebaseio.com",
      projectId: "barista-project-1504977810719",
      storageBucket: "barista-project-1504977810719.appspot.com",
      messagingSenderId: "263140035198"
  };
    
    firebase.initializeApp(config);
    
    var database = firebase.database();
    var savedCafe;
    var ratios =  

    function sort() {
     ratios.sort(function(a, b){return b - a});
   };

    $('#info').on('click', '.new-info', function() {

      // changes the div to light brown when clicked      
    $(this).css("background", "blue");
    var index = $(this).index();

    database.ref().push(savedCafe[index]);
    // empties div so there are no repeats
    $(".innerDiv").empty();
      function InitialUpload(){database.ref().on("child_added", function(childSnapshot, prevChildKey){
 
         var cafeName = childSnapshot.val().name;

     $(".savedList").append("<div class='innerDiv'>"+"Name: " + cafeName + "</div>");

        console.log(cafeName);  
          });
          };

        InitialUpload();
          });

     //this button removes both firebase data and clears the div

    $(".removeData").on("click", function(){
      database.ref().remove();
      $(".innerDiv").empty();
    });

   $("#search-btn").on("click", function(event) {
     event.preventDefault();

     $('#map').removeClass('hidden');

     var map;
     var venueArray = [];
     savedCafe = [];
     var cityEntered = $("#user-input").val().trim();
    
      console.log(cityEntered);
      var $audioCharacter = document.createElement('audio');
      $audioCharacter.setAttribute('src', 'assets/audio/coffee.mp3');
      $audioCharacter.play();
      var searchQuery= $("#user-input").val().trim();
      var queryURL = "https://api.foursquare.com/v2/venues/search?v=20161016&near=" + searchQuery + "&query=coffee&intent=checkin&client_id=53JNXQGSILECYWHP02QFXIXCU4ZDZJEAHB1HJ1KQ0F0DV3SM&client_secret=QRHTGAG2MYTXX2UPY0UTBTWAXFIFQWYWCGJSJG2M4ANVG01C";
      $("#user-input").val("")
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      .done(function(response) {
        ratios = [];
        $("#info").empty();
        var info = response.response.venues;
        console.log(response.response.venues)
        for (var i = 0; i < info.length; i++) {
         var venue = info[i];
         var stats = venue.stats;
         var total = stats.tipCount / stats.checkinsCount;
         venue.total = total.toFixed(5);
         venueArray.push(venue);
       }
       
       info.sort(function(a, b) {
        return b.total - a.total;
      });
       for (var i = 0; i < info.length; i++) {
        var venue = info[i];
        savedCafe.push(venue);
        if (!venue.contact.formattedPhone) {
          venue.contact.formattedPhone = 'Unavailable';
        }
        console.log("******");
        console.log(venue.url);
        console.log("Web-site: " + "<a class='url-Remove' href=" + venue.url + "</a>");
        var newInfo = $('<div class="new-info col-xs-12">' 
          + "Name: " + venue.name 
          + "<br>" 
          + "Phone #: " + venue.contact.formattedPhone
          + "<br>" 
          + "Address: " + venue.location.formattedAddress 
          + "<br>"
          + "Tip Ratio: " + venue.total 
          + "<br>" 
          + "Website: <a href=" + venue.url + ">" + venue.url + "</a>" 
          + "</div>"
          );
        if (!venue.url) {
          newInfo.find('a').addClass('url-Remove');
        }
        $('#info').append(newInfo);
      };

  // Googlemaps API stuff
  var marker, j;
  var infowindow = new google.maps.InfoWindow();
  var newCenter = new google.maps.LatLng(venueArray[0].location.lat, venueArray[0].location.lng);
  map.setCenter(newCenter);
  map.setZoom(13);
  for (j = 0; j < venueArray.length; j++) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(venueArray[j].location.lat, venueArray[j].location.lng),
      map: map,
      html:
      '<div class="markerPop">'+
      venueArray[j].name + '<br>' +
      venueArray[j].location.formattedAddress + '<br>' +
      venueArray[j].contact.formattedPhone +
      '</div>'
    });
    
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.html);
      infowindow.open(map, this);
    });
  };
  });
      function initMap() {
        var uluru = { lat: 0, lng: 0 };
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: uluru
        }); 
      };
      initMap();
    });