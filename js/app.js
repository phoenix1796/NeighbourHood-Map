window.onload = function () {
  // Initialize Materialize.css components
  M.AutoInit();
  // Initialize & bind Application ViewModel
  ko.applyBindings(AppViewModel);
};


function AppViewModel() {
  var self = this;
  // List of locations to be converted into markers
  self.locations = locationList;
  // GoogleMap Object
  self.map = {};
  // Array {GoogleMapApi Marker Object}
  self.markers = [];
  // Info window for Third Party APIs
  self.infoWindow = new google.maps.InfoWindow();
  // Map bounds to determine proper Zoom level according to markers
  self.mapBounds = new google.maps.LatLngBounds();
  // Default marker icon
  self.defaultIcon = new google.maps.MarkerImage('/img/detect_icon_32.png');
  // Highlighted marker icon
  self.highlightedIcon = new google.maps.MarkerImage('/img/detect_icon_64.png');
  // FourSquare API Access credentials
  self.fourApi = {
    id: 'GZSHOASSQUPFKECGWUK2OJZVG0U2DRMK5PEMQYZARXVGXRT1',
    secret: 'EUCRPWN5E3CI2JIWEATKRHZZYCLSPHTBMK5P0MTEH24VREQH',
    baseURL: 'https://api.foursquare.com/v2/venues/',
    version: '20180418'
  };
  // Initialize function for Application ViewModel
  self.init = function () {
    // Create instance of Map
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 28.564019,
        lng: 77.325897,
      },
      styles: mapStyles,
      zoom: 13,
    });

    // Create Markers from using the locations array
    self.markers = self.locations.map(locInfo => self.createMarker(locInfo));

    // Fit map to bounds
    self.map.fitBounds(self.mapBounds);
  };

  // Called when all search results have been rendered by ko.ForEach
  // Provides a list DOM Elements to search :self.searchSet
  self.searchRendered = function () {
    self.searchSet = document.querySelectorAll('.search-results span');
  };

  // Filter function, for search results & markers
  self.search = function (data, event) {
    //Convert search term to lowercase for easier searching
    var searchTerm = event.currentTarget.value.toLowerCase();

    // Check if searchTerm is non-empty
    if (searchTerm != '') {
      //Loop over searchSet DOM Elements
      for (var i = 0; i < self.searchSet.length; ++i) {
        // Convert individual terms to lower case, for easier searching
        term = self.searchSet[i].innerText.toLowerCase();

        // Check If searchTerm exists as a substring in current term.
        if (term.indexOf(searchTerm) !== -1) {
          // Animate fadeIn
          fadeIn(self.searchSet[i]);
          // Place marker on map
          self.markers[i].setMap(self.map);
        } else {
          // Animate fadeOut
          fadeOut(self.searchSet[i]);
          // Hide marker from map
          self.markers[i].setMap(null);
        }
      }
    } else {
      // If SearchTerm is empty: No Input
      // Display all elements
      self.searchSet.forEach(function (element, i) {
        fadeIn(element);
        self.markers[i].setMap(self.map);
      });
    }
  };

  // Highlight marker using icon change & animation
  self.focusMarker = function (marker) {
    marker.setIcon(self.highlightedIcon);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  // Defocus from marker
  self.defocusMarker = function (marker) {
    marker.setIcon(self.defaultIcon);
    marker.setAnimation(null);
  };

  // Create marker, set event listeners and adjust map bounds
  self.createMarker = function (markerInfo) {
    var marker = new google.maps.Marker({
      position: markerInfo.location,
      map: self.map,
      title: markerInfo.title,
      animation: google.maps.Animation.DROP,
      icon: self.defaultIcon,
    });
    // Set FourSquare Venue Id
    marker.fsId = markerInfo.fsId;
    // Extend map bounds, to set appropriate Zoom level
    self.mapBounds.extend(marker.position);

    // Marker eventListeners
    marker.addListener('click', function () {
      // Open InfoWindow
      self.populateInfoWindow(this);
    });
    marker.addListener('mouseover', function () {
      // Highlight Marker , except for Animation
      // Bounce animation wasn't user friendly
      this.setIcon(self.highlightedIcon);
    });
    marker.addListener('mouseout', function () {
      this.setIcon(self.defaultIcon);
    });
    return marker;
  };

  // Populate content in the InfoWindow &
  // Attach it to the provided marker.
  self.populateInfoWindow = function (marker) {
    // Change only when another marker clicked
    if (self.infoWindow.marker != marker) {
      // Set content to progress bar.
      self.infoWindow.setContent(
        '<div style="width:4em;" class="progress"><div class="indeterminate"></div></div>'
      );
      // Attach InfoWindow to marker & open.
      self.infoWindow.marker = marker;
      self.infoWindow.open(self.map, marker);

      // GET data from FourSquareAPI
      $.get(self.fourApi.baseURL + marker.fsId, {
          client_id: self.fourApi.id,
          client_secret: self.fourApi.secret,
          v: self.fourApi.version,
        })
        // Called when request was successfull
        .done(function (data) {
          let venue = data.response.venue;
          let content = '';
          // Added venue photo if present
          if (venue.bestPhoto) {
            content +=
              '<img src="' +
              venue.bestPhoto.prefix +
              '200x200' +
              venue.bestPhoto.suffix +
              '"><br>';
          }

          // Added number of people around the venue
          content +=
            "Who's here right now ?<br> " +
            '<span>' +
            venue.hereNow.summary +
            '(' +
            venue.hereNow.count +
            ')</span><br>';

          // Add FourSquare venue URL to content
          content +=
            '<span>Find more at <a href=' +
            venue.shortUrl +
            'target="_blank"><img height=24 src="img/fs.jpg"></a></span><br>';
          // Set InfoWindow content
          self.infoWindow.setContent(content);
        })
        // Called when request to FourSquare API was unsuccessfull (STATUS_CODE other than 200)
        .fail(function (err) {
          // Set content as error Status text
          let content = err.statusText;
          // Append custom message
          // In case no status text received
          content += '<br> Please try again after some time.';
          self.infoWindow.setContent(content);
        });

      // Added listener to detach infoWindow from currentMarker ,
      // when it is closed,
      self.infoWindow.addListener('closeclick', function () {
        self.infoWindow.close();
        self.infoWindow.marker = null;
      });

    }
  };

  self.init();
}

// Location list for venues
var locationList = [{
    title: 'World of Wonders',
    location: {
      lat: 28.564019,
      lng: 77.325897
    },
    fsId: '4d1dac25e56f6ea8d18c5d1d',
  },
  {
    title: 'Noida Sec-18 Metro station',
    location: {
      lat: 28.570823,
      lng: 77.326112
    },
    fsId: '4c06593d91d776b0cfadf8f9',
  },
  {
    title: 'The Great India Place Mall',
    location: {
      lat: 28.567493,
      lng: 77.326337
    },
    fsId: '4cab04a614c33704cb89e63b',
  },
  {
    title: 'Noida Sec-16 Metro station',
    location: {
      lat: 28.578285,
      lng: 77.317636
    },
    fsId: '4c3825e16ec69c74b6a104a9',
  },
  {
    title: 'Max Super Speciality hospital',
    location: {
      lat: 28.574271,
      lng: 77.322936
    },
    fsId: '4cb93b95f50e224b6e7aecfb',
  },
  {
    title: 'Noida Public Library',
    location: {
      lat: 28.580659,
      lng: 77.311757
    },
    fsId: '5aa6ba5c23a2e65c68c616a3',
  },
];


// Animation functions

function fadeIn(el) {
  setTimeout(function () {
    el.classList.remove('hidden');
    el.classList.remove('vis-hidden');
  }, 200);
}

function fadeOut(el) {
  el.classList.add('vis-hidden');
  setTimeout(function () {
    el.classList.add('hidden');
  }, 200);
}

// GoogleMap Styles array
var mapStyles = [{
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{
      color: '#f7f1df',
    }, ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{
      color: '#d0e3b4',
    }, ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{
      visibility: 'off',
    }, ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{
      visibility: 'on',
    }, ],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }, ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [{
      color: '#fbd3da',
    }, ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#bde6ab',
    }, ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      visibility: 'off',
    }, ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{
      visibility: 'on',
    }, ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#ffe15f',
    }, ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#efd151',
    }, ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#ffffff',
    }, ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{
      color: 'black',
    }, ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#cfb2db',
    }, ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#a2daf2',
    }, ],
  },
];