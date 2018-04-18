function AppViewModel() {
  var self = this;
  self.locations = [
    { title: 'World of Wonders', location: { lat: 28.564019, lng: 77.325897 } },
    {
      title: 'Noida Sec-18 Metro station',
      location: { lat: 28.570823, lng: 77.326112 },
    },
    {
      title: 'The Great India Place Mall',
      location: { lat: 28.567493, lng: 77.326337 },
    },
    {
      title: 'Noida Sec-16 Metro station',
      location: { lat: 28.578285, lng: 77.317636 },
    },
    {
      title: 'Max Super Speciality hospital',
      location: { lat: 28.574271, lng: 77.322936 },
    },
    {
      title: 'Noida Public Library',
      location: { lat: 28.580659, lng: 77.311757 },
    },
  ];

  self.markers = [];
  self.infoWindow = new google.maps.InfoWindow();
  self.mapBounds = new google.maps.LatLngBounds();
  self.defaultIcon = createMarkerIcon('0091ff');
  self.highlightedIcon = createMarkerIcon('FFFF24');

  self.init = function() {
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 28.564019,
        lng: 77.325897,
      },
      styles: mapStyles,

      zoom: 13,
    });
    self.markers = self.locations.map(locInfo => self.createMarker(locInfo));
    self.map.fitBounds(self.mapBounds);
  };

  self.search = function(data, event) {
    var searchTerm = event.currentTarget.value;
    if (searchTerm != '') {
      for (var i = 0; i < self.markers.length; ++i) {
        self.markers[i].title;
      }
    }
  };

  self.focusMarker = function(marker) {
    marker.setIcon(self.highlightedIcon);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  self.defocusMarker = function(marker) {
    marker.setIcon(self.defaultIcon);
    marker.setAnimation(null);
  };

  self.createMarker = function(marker) {
    var marker = new google.maps.Marker({
      position: marker.location,
      map: self.map,
      title: marker.title,
      animation: google.maps.Animation.DROP,
      icon: self.defaultIcon,
    });
    self.mapBounds.extend(marker.position);

    marker.addListener('click', function() {
      self.populateInfoWindow(this);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(self.highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(self.defaultIcon);
    });
    return marker;
  };

  self.populateInfoWindow = function(marker) {
    if (self.infoWindow.marker != marker) {
      self.infoWindow.setContent(
        '<div style="width:4em;" class="progress"><div class="indeterminate"></div></div>'
      );
      self.infoWindow.marker = marker;
      self.infoWindow.open(self.map, marker);
      setTimeout(function() {
        self.infoWindow.setContent(`<div>${marker.title}</div>`);
      }, 1000);

      self.infoWindow.addListener('closeclick', function() {
        self.infoWindow.setMarker(null);
      });
    }
  };

  self.init();
}

ko.applyBindings(AppViewModel);

function createMarkerIcon(markerColor) {
  var markerIcon = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
      markerColor +
      '|40|_|%E2%80%A2',
    new google.maps.Size(25, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(25, 40)
  );
  return markerIcon;
}

var mapStyles = [
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f7f1df',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d0e3b4',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fbd3da',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#bde6ab',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffe15f',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#efd151',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: 'black',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#cfb2db',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#a2daf2',
      },
    ],
  },
];
