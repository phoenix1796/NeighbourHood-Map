'use strict';
window.onload = function() {
  // Initialize Materialize.css Sidenav
  $('.sidenav').sidenav();
};
// Global variable for Google Maps View Model (refer Map.js)
var GMapVm;

function startApp() {
  // Initialize & bind Application ViewModel
  ko.applyBindings(new AppViewModel());
}

function googleMapsSuccess() {
  // Create instance of Map
  let map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 28.564019,
      lng: 77.325897,
    },
    styles: mapStyles,
    zoom: 13,
  });
  GMapVm = new GoogleMapsVM(map, locationList);

  startApp();
}

function AppViewModel() {
  var self = this;
  // List of locations to be converted into markers
  this.locations = ko.observableArray([]);

  this.searchFilter = ko.observable('');

  // Initialize function for Application ViewModel
  self.init = function() {
    // Create Markers from using the locations array
    GMapVm.locations.forEach(locInfo => {
      locInfo.marker = GMapVm.createMarker(locInfo);
      locInfo.visible = ko.observable(true);
      self.locations().push(locInfo);
    });

    // Fit map to bounds
    GMapVm.map.fitBounds(GMapVm.mapBounds);
  };

  // Filter function, for search results & markers
  self.searchList = ko.computed(function() {
    //Convert search term to lowercase for easier searching
    let searchTerm = this.searchFilter().toLowerCase();

    // Check if searchTerm is empty

    if (searchTerm == '') {
      // If SearchTerm is empty: No Input
      // Display all elements
      this.locations().forEach(location => location.marker.setMap(GMapVm.map));
      console.log(this.locations());
      return this.locations();
    }

    return this.locations().filter(function(location) {
      let term = location.title.toLowerCase();
      // Check If searchTerm exists as a substring in current term.
      if (term.indexOf(searchTerm) !== -1) {
        location.marker.setMap(GMapVm.map);
        return true;
      } else {
        location.marker.setMap(null);
        return false;
      }
    });
  }, this);

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
