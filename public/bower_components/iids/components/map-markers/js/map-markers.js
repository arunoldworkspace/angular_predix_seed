
'use strict';
define([
  'jquery',
  'map-markers-component/map-d3-overlay',
  'map-popovers',
  'ge-bootstrap',
  'map-core-component/pubsub'],

function Markers($, mapOverlay, popovers) {

  var addMarkers = function(collection,map,markerOptions,name,indexOptions){

    if(!name){
      name = 'Markers';
    }

    //Merge options with defaults
    $.extend(true,popovers.popupOptions,markerOptions);

    var mapDSoverlay = new mapOverlay(collection, map, name, true, indexOptions).done(function(){
      popovers.addPopovers(map, mapDSoverlay.overlay(), mapDSoverlay.feature(), collection);
      $.publish("markerLayerInitialised", [mapDSoverlay]);
    });
    return mapDSoverlay;

  };

  return( {addMarkers: addMarkers } );
});
