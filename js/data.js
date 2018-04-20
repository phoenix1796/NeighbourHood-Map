// Location list for venues
var locationList = [
  {
    title: 'World of Wonders',
    location: {
      lat: 28.564019,
      lng: 77.325897,
    },
    fsId: '4d1dac25e56f6ea8d18c5d1d',
  },
  {
    title: 'Noida Sec-18 Metro station',
    location: {
      lat: 28.570823,
      lng: 77.326112,
    },
    fsId: '4c06593d91d776b0cfadf8f9',
  },
  {
    title: 'The Great India Place Mall',
    location: {
      lat: 28.567493,
      lng: 77.326337,
    },
    fsId: '4cab04a614c33704cb89e63b',
  },
  {
    title: 'Noida Sec-16 Metro station',
    location: {
      lat: 28.578285,
      lng: 77.317636,
    },
    fsId: '4c3825e16ec69c74b6a104a9',
  },
  {
    title: 'Max Super Speciality hospital',
    location: {
      lat: 28.574271,
      lng: 77.322936,
    },
    fsId: '4cb93b95f50e224b6e7aecfb',
  },
  {
    title: 'Noida Public Library',
    location: {
      lat: 28.580659,
      lng: 77.311757,
    },
    fsId: '5aa6ba5c23a2e65c68c616a3',
  },
];

// GoogleMap Styles array
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
        visibility: 'on',
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
        visibility: 'on',
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
