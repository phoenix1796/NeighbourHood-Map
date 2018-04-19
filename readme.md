# Solitude Spotter

Web application listing best spots to be alone.

> Most webapps try to get people together. <br>
> Whereas sometimes, you need solitude to connect with your inner self.

## Tech Used:

1.  KnockoutJS
2.  MaterializeCSS
3.  Jquery

## API Used:

1.  FourSquare API
2.  GoogleMaps API

## Project Requirements / Features:

1.  Markers and list are updated in tandem using various helper functions (No observables used for markers)

> Things that should not be handled by Knockout: anything the Maps API is used for, creating markers, tracking click events on markers, making the map, refreshing the map. Note 1: Tracking click events on list items should be handled with Knockout. Note 2: Creating your markers as a part of your ViewModel is allowed (and recommended). Creating them as Knockout observables is not.

2.  AJAX calls used to FourSquareAPI & failure handled with .fail() function signalling the user about it.
3.  Added Marker focus animations & highlight mechanics
4.  Added & removed classes from DOM elements within the ViewModel, no other direct DOM manipulation done
5.  Displayed more than 5 venues
6.  Added focus marker functionality when either the marker or the list is selected

## Setup:

To run this application just host it on , any server and open index.html

## References:

* https://github.com/otsop110/neighbourhood-map

### This application lists out some popular spots, with just enough levels of surrounding activity to allow you to listen to your inner voice & not be distracted by the utter loss of external stimuli.

_Introvert Apps_ <br>
_May the force be with you young padawan._
