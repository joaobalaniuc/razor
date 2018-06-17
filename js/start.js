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
  localStorage.timeout = 5000; // ajax

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



    // GPS enabled?
    /*
    if (device.platform != "iOS") {
      cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
        if (!enabled) { geoIP(); }
      }, function (error) {
        alert("The following error occurred: " + error);
      });
    }
    */
    phonegap.receivedEvent('deviceready');

    // SPLASHSCREEN (CONFIG.XML BUGFIX)
    setTimeout(function () {
      //navigator.splashscreen.hide();
      //StatusBar.hide();
    }, 500);

    

    start();
    //geo();

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    /*var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');*/
    console.log('Received Event: ' + id);
  }
};
