'use strict';

function GoogleMapsVM(GMap, Locations) {
  let self = this;
  // GoogleMap Object
  this.map = GMap;
  // Map bounds to determine proper Zoom level according to markers
  this.mapBounds = new google.maps.LatLngBounds();
  // markers
  this.locations = Locations;
  // Info window for Third Party APIs
  this.infoWindow = new google.maps.InfoWindow();
  // Marker icons
  this.defaultIcon = new google.maps.MarkerImage('img/detect_icon_32.png');
  this.highlightedIcon = new google.maps.MarkerImage('img/detect_icon_64.png');
  // Create marker, set event listeners and adjust map bounds
  this.createMarker = function(markerInfo) {
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
    marker.addListener('click', function() {
      // Open InfoWindow
      self.populateInfoWindow(this);
    });
    marker.addListener('mouseover', function() {
      // Highlight Marker , except for Animation
      // Bounce animation wasn't user friendly
      this.setIcon(self.highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(self.defaultIcon);
    });
    return marker;
  };

  // FourSquare API Access credentials
  this.fourApi = {
    id: 'GZSHOASSQUPFKECGWUK2OJZVG0U2DRMK5PEMQYZARXVGXRT1',
    secret: 'EUCRPWN5E3CI2JIWEATKRHZZYCLSPHTBMK5P0MTEH24VREQH',
    baseURL: 'https://api.foursquare.com/v2/venues/',
    version: '20180418',
  };

  // Populate content in the InfoWindow &
  // Attach it to the provided marker.
  this.populateInfoWindow = function(marker) {
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
        .done(function(data) {
          let venue = data.response.venue;
          let content = '<div style="text-align: center;">';
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
            "<b>Who's here right now ?</b><br> " +
            '<span>' +
            venue.hereNow.summary +
            '(' +
            venue.hereNow.count +
            ')</span><br>';

          // Add FourSquare venue URL to content
          content +=
            '<span>Find more at <a href="' +
            venue.shortUrl +
            '" target="_blank"><img height=24 src="img/fs.jpg"></a></span><br>';
          content += '</div>';
          // Set InfoWindow content
          self.infoWindow.setContent(content);
        })
        // Called when request to FourSquare API was unsuccessfull (STATUS_CODE other than 200)
        .fail(function(err) {
          // Set content as error Status text
          let content = err.statusText;
          // Append custom message
          // In case no status text received
          content += '<br> Please try again after some time.';
          self.infoWindow.setContent(content);
        });

      // Added listener to detach infoWindow from currentMarker ,
      // when it is closed,
      self.infoWindow.addListener('closeclick', function() {
        self.infoWindow.close();
        self.infoWindow.marker = null;
      });
    }
  };
}
