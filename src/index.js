'use strict';

var APP_ID = "amzn1.echo-sdk-ams.app.4b678114-e0a9-4c13-a82f-3d381641773b";

var http       = require('http'),
    AlexaSkill = require('./AlexaSkill'),
    APP_ID     = 'amzn1.echo-sdk-ams.app.4b678114-e0a9-4c13-a82f-3d381641773b',
    SC = require('./soundcloud_sdk.js'),
    SC_USER_ID    = '161649318',
    SC_CLIENT_ID  = '05aff6aeebc300b481835cf924c1865d';

var PLAYLIST_MAP = {
    OdeszaNoSleep: "206787028",
    // GalimatiasVoyage: "2619526011",
    Songs: "149439366"
    // ChetFaker: "15690151",
    // Flume: "165797011",
    // TaKu: "11055981",
    // Kai: "1000"
};

SC.initialize({
    client_id: SC_CLIENT_ID,
});

var userUrl = function() {
  return 'https://api.soundcloud.com/users/' + SOUNDCLOUD_USER_ID + '/playlists/?client_id=' + SOUNDCLOUD_CLIENT_ID;
};

var playlistUrl = function(playlistId) {
  return 'https://api.soundcloud.com/playlists/' + playlistId + '/?client_id=' + SOUNDCLOUD_CLIENT_ID;
};

var SoundCloudPlay = function(){
  AlexaSkill.call(this, APP_ID);
};

var player;

SoundCloudPlay.prototype = Object.create(AlexaSkill.prototype);
SoundCloudPlay.prototype.constructor = SoundCloudPlay;

SoundCloudPlay.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Hello from Sound Cloud. ' +
    'What playlist do you want to hear?';

  var reprompt = 'Which artist do you want to hear?';

  response.ask(output, reprompt);
};

// var handleListPlaylistRequest = function(intent, session, response){
//   var playlistNames = [];
//   data.forEach(function(playlist){
//     var playlistName = playlist.permalink.replace(/\.\s*/g, '').replace(/\-\s*/g, '');
//     playlistNames.push(playlistName);
//   });
//   return playlistNames;
// };

var handlePlayPlaylistRequest = function(intent, session, response){
  var playlistId = PLAYLIST_MAP[intent.slots.playlist.value];
  player = SC.stream('playlist/' + playlistId);
  speechText = "Playing " + intent.slots.playlist.value + " from Sound Cloud.";
  speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
  player.then(function(player){
    player.play();
  });
};

var handlePauseRequest = function(intent, session, response){
  player.then(function(player){
    player.pause();
  });
};


SoundCloudPlay.prototype.intentHandlers = {
  // WIP
  // ListPlaylistIntent: function(intent, session, response){
  //   var listPlaylists = handleListPlaylistRequest(intent, session, response);
  //   response.tell(listPlaylists);
  // },

  PlayPlaylistIntent: function(intent, session, response){
    handlePlayPlaylistRequest(intent, session, response);
  },

  PauseIntent: function(intent, session, response){
    handlePauseRequest(intent, session, response);
  },

  // Current soundcloud http api doesn't have next() method
  // Only the widget api has that
  // NextIntent: function(intent, session, response){
  //   handlePauseRequest(intent, session, response);
  // },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'What playlist do you want to hear?';
    response.ask(speechOutput);
  }
};
