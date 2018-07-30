$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  //===========================
  // MAPBOX
  //===========================
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hb2JhbGFuaXVjIiwiYSI6ImNqaXFnb2RyMjA0b3ozdm12NmNva2hjNXUifQ.SSIY_rae1SE0Xsb_XYyn1Q';
  var lat = 0;
  var lng = 0;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 0,
    center: [lat, lng]
  });
  sessionStorage.auto_lat = lat;
  sessionStorage.auto_lng = lng;
  if (typeof marker !== "undefined") {
    delete marker;
  }
  //===========================
  // GPS
  //===========================
  if (isApp) {
    if (typeof localStorage.dev_push === "undefined" && typeof sessionStorage.turnon === "undefined") {
      setTimeout(function() {
        app.router.navigate("/turnon/");
      }, 1000);
      return false;
    }
  }
  //===========================
  // INICIANDO AGORA
  //===========================
  if (typeof sessionStorage.autoId_0 === "undefined") {
    if (typeof sessionStorage.auth_token === "undefined") { Auth(autoList); }
    else { autoList(); }
  }
  //===========================
  // APP EM USO
  //===========================
  else {
    if (typeof sessionStorage.auth_token === "undefined") { Auth(autoListSession); }
    else { autoListSession(); }
    if (typeof localStorage.auto_id === "undefined") {
      localStorage.auto_id = sessionStorage.autoId_0;
      localStorage.auto_imei = sessionStorage.autoImei_0;
    }
    sessionStorage.auto_id = localStorage.auto_id;
    sessionStorage.auto_imei = localStorage.auto_imei;
  }
});

$$(document).on('click', '#icons a', function (e) {
  var msg0 = $(this).attr("data-msg0");
  var msg1 = $(this).attr("data-msg1");
  alert("sms("+msg0+","+msg1+")");
  torpedo(msg0, msg1);
});
function torpedo(msg0, msg1) {
  var number = sessionStorage.auto_phone;
  var pass = sessionStorage.auto_pass;
  var message = msg0 + pass + " " + msg1;
  var options = {
    replaceLineBreaks: false, // true to replace \n by a new line, false by default
    android: {
      intent: 'INTENT'  // send SMS with the native android SMS messaging
      //intent: '' // send SMS without open any other app
    }
  };
  /*var success = function () { alert('Message sent successfully'); };
  var error = function (e) { alert('Message Failed:' + e); };*/
  sms.send(number, message, options, function () { alert('Message sent successfully'); }, function (e) { alert('Message Failed:' + e); });
}
