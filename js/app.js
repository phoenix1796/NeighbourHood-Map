'use strict';
window.onload = function() {
  // Initialize Materialize.css Sidenav
  // M.AutoInit();
  $('.sidenav').sidenav();
};
var GMapVm;

function startApp() {
  // Initialize & bind Application ViewModel
  ko.applyBindings(new AppViewModel());
}

function googleMapsSuccess() {
  GMapVm = new GoogleMapsVM(locationList);
  // Create instance of Map
  GMapVm.map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 28.564019,
      lng: 77.325897,
    },
    styles: mapStyles,
    zoom: 13,
  });

  startApp();
}

function AppViewModel() {
  var self = this;
  // List of locations to be converted into markers
  this.locations = locationList;

  // Initialize function for Application ViewModel
  self.init = function() {
    // Create Markers from using the locations array
    self.locations = GMapVm.locations.map(locInfo => {
      locInfo.marker = GMapVm.createMarker(locInfo);
      return locInfo;
    });

    // Fit map to bounds
    GMapVm.map.fitBounds(GMapVm.mapBounds);
  };

  // Called when all search results have been rendered by ko.ForEach
  // Provides a list DOM Elements to search :self.searchSet
  self.searchRendered = function() {
    self.searchSet = document.querySelectorAll('.search-results span');
  };

  // Filter function, for search results & markers
  self.search = function(data, event) {
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
      self.searchSet.forEach(function(element, i) {
        fadeIn(element);
        self.markers[i].setMap(self.map);
      });
    }
  };

  // Highlight marker using icon change & animation
  self.focusMarker = function(marker) {
    marker.setIcon(self.highlightedIcon);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  // Defocus from marker
  self.defocusMarker = function(marker) {
    marker.setIcon(self.defaultIcon);
    marker.setAnimation(null);
  };

  self.init();
}
