'use strict';

window.onload = function() {
  // Initialize Materialize.css Sidenav
  $('.sidenav').sidenav();
};

function startApp() {
  // Create instance of Map
  let GMapVm = new GoogleMapsViewModel('map', locationList);

  // Initialize & bind Application ViewModel
  let AppVm = new AppViewModel(GMapVm);
  ko.applyBindings(AppVm);
}

// GMapVm is accessible to all internal functions as a variable
// But , inside foreach we require it to be bound to this.
function AppViewModel(GMapVm) {
  var self = this;
  // Attach to this , so that it is accessible by data-bind
  this.GMapVm = GMapVm;
  // List of locations to be converted into markers
  this.locations = ko.observableArray([]);

  // Search filter to filter location list
  this.searchFilter = ko.observable('');

  // Initialize function for Application ViewModel
  self.init = function() {
    // Create Markers from GMapVm locations array
    GMapVm.locations.forEach(locInfo => {
      locInfo.marker = GMapVm.createMarker(locInfo);
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
      this.locations().forEach(location => {
        location.marker.setMap(GMapVm.map);
      });
      return this.locations();
    }

    // Return filtered list if,
    // Search Term is not empty
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

  // Initialize App View Model
  self.init();
}
