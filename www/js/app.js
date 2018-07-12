// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'br.com.nickford.razor', // App bundle ID
  name: 'Razor', // App name
  theme: 'md', // Automatic theme detection
  cache: false, // Disable caching
  cacheDuration: 0, // Set caching expire time to 0
  domCache: false,
  routes: routes, // App routes
  // Others
  statusbar: {
    iosOverlaysWebView: true,
  },
  smartSelect: {
    closeOnSelect: true,
    openIn: 'popup'
  }
});

// Init/Create views
var indexView = app.views.create('#view-index');

//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

  // App config
  localStorage.appname = "Razor";
  localStorage.version = "1.0.0";

  // Server
  localStorage.server = "http://nickford.com.br/razor/";
  localStorage.server_img = "/upload/";

  // Dev
  sessionStorage.debug = 1;

  // Ajax timeout
  localStorage.timeout = 7000; // ajax

  // Login?
  if (typeof localStorage.cli_id === "undefined") { localStorage.cli_id = 0; }

  console.log(localStorage);
  console.log(sessionStorage);
}

var phonegap = {

  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },

  // Bind Event Listeners
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("online", onOnline, false);
    function onOnline() { sessionStorage.online = true; }
    document.addEventListener("offline", onOffline, false);
    function onOffline() { sessionStorage.online = false; }
  },

  // deviceready Event Handler
  onDeviceReady: function () {

    // device info
    sessionStorage.device_model = device.model;
    sessionStorage.device_platform = device.platform;
    sessionStorage.device_version = device.version;
    sessionStorage.device_manufacturer = device.manufacturer;
    sessionStorage.device_cordova = device.cordova;
    sessionStorage.device_uuid = device.uuid;
    sessionStorage.device_serial = device.serial;

    // push
    phonegap.push = PushNotification.init({
      "android": {},
      "ios": {
        "sound": true,
        "vibration": true,
        "badge": true
      },
      "windows": {}
    });
    phonegap.push.on("registration", function(data) {
      localStorage.dev_push = data.registrationId;
      //alert(JSON.stringify(data));
    });
    phonegap.push.on("error", function(e) {
      //alert("push error = " + e.message);
    });
    phonegap.push.on("notification", function(data) {
      //alert("notification event = "+JSON.stringify(data));
    });

    // geo coords
    function geo(position) { sessionStorage.user_lat = position.coords.latitude; sessionStorage.user_lng = position.coords.longitude; }
    function geoError(error) { /*alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');*/ }
    //navigator.geolocation.watchPosition(geo, geoError, { timeout: 30000 });

    // razor data
    start();



    nois();





    phonegap.receivedEvent('deviceready');

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    console.log('Received Event: ' + id);
  }
};

function ws(str) {
  var data = { data:str };
  $.ajax({
    url: localStorage.server + "/ws.php",
    data: data,
    beforeSend: function() {}, // não usar preloader
    error: function() { alert("fail"); } // não usar fail default (alert)
  })
  .done(function (res) {
    alert(JSON.stringify(res.data));
  }); // after ajax
}

/*
var number = "28999652165";
var message = "teste";
//CONFIGURATION
var options = {
replaceLineBreaks: false, // true to replace \n by a new line, false by default
android: {
intent: 'INTENT'  // send SMS with the native android SMS messaging
//intent: '' // send SMS without open any other app
}
};
var success = function () { alert('Message sent successfully'); };
var error = function (e) { alert('Message Failed:' + e); };
//sms.send(number, message, options, success, error);
//alert(2);
*/

function nois() {


  alert(0);
  // Get a reference to the plugin.
  var bgGeo = BackgroundGeolocation;
  alert(BackgroundGeolocation);
  alert(navigator.BackgroundGeolocation);

  //This callback will be executed every time a geolocation is recorded in the background.
  var callbackFn = function(location) {
    alert("aaa");
    alert('- Location: '+ JSON.stringify(location));
    var coords = location.coords;
    var lat    = coords.latitude;
    var lng    = coords.longitude;
    console.log('- Location: ', JSON.stringify(location));
    ws("coords:"+lat+","+lng);
  };
  alert(1);
  // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
  var failureFn = function(errorCode) {
    alert(errorCode);
    ws("err:"+errorCode);
    console.warn('- BackgroundGeoLocation error: ', errorCode);
  }
  alert(2);
  // Listen to location events & errors.
  bgGeo.on('location', callbackFn, failureFn);
  // Fired whenever state changes from moving->stationary or vice-versa.
  bgGeo.on('motionchange', function(isMoving) {
    console.log('- onMotionChange: ', isMoving);
  });
  alert(3);
  // Fired whenever a geofence transition occurs.
  bgGeo.on('geofence', function(geofence) {
    ws("geofence");
    console.log('- onGeofence: ', geofence.identifier, geofence.location);
  });
  // Fired whenever an HTTP response is received from your server.
  bgGeo.on('http', function(response) {
    console.log('http success: ', response.responseText);
  }, function(response) {
    console.log('http failure: ', response.status);
  });
  alert(4);
  // BackgroundGeoLocation is highly configurable.
  bgGeo.ready({
    // Geolocation config
    desiredAccuracy: 0,
    distanceFilter: 10,
    stationaryRadius: 25,
    // Activity Recognition config
    activityRecognitionInterval: 10000,
    stopTimeout: 5,
    // Application config
    debug: true,  // <-- Debug sounds & notifications.
    stopOnTerminate: false,
    startOnBoot: true,
    // HTTP / SQLite config
    url: "http://nickford.com.br/razor/ws.php",
    method: "GET",
    autoSync: true,
    maxDaysToPersist: 3
  }, function(state) {
    // This callback is executed when the plugin is ready to use.
    console.log("BackgroundGeolocation ready: ", state);
    if (!state.enabled) {
      bgGeo.start();
    }
  });
  alert(5);
  // The plugin is typically toggled with some button on your UI.
  function onToggleEnabled(value) {
    if (value) {
      bgGeo.start();
    } else {
      bgGeo.stop();
    }
  }
}
