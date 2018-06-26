$$(document).on('page:init', '.page[data-name="home"]', function (e) {
  //===========================
  // MAPBOX
  //===========================
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hb2JhbGFuaXVjIiwiYSI6ImNqaXFnb2RyMjA0b3ozdm12NmNva2hjNXUifQ.SSIY_rae1SE0Xsb_XYyn1Q';
  var lat = -40.3010497;
  var lng = -20.3160678;
  var map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/mapbox/streets-v10',
    //style: 'mapbox://styles/mapbox/basic-v9',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 15,
    center: [lat, lng]
  });
  var marker = new mapboxgl.Marker()
  .setLngLat([lat, lng])
  .addTo(map);

  //===========================
  // INICIANDO AGORA
  //===========================
  if (typeof sessionStorage.autoId_0 === "undefined") {
    autoList();
  }
  //===========================
  // APP EM USO
  //===========================
  else {
    autoListSession();
    if (typeof localStorage.auto_id === "undefined") {
      localStorage.auto_id = sessionStorage.autoId_0;
    }
    sessionStorage.auto_id = localStorage.auto_id;
    autoRead(sessionStorage.auto_id);
  }
});

function autoList() {

  console.log("autoList()");

  // DATA TO SEND
  var data_user = {
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data = data_user;

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_list.php",
    data: data,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: localStorage.timeout
  })
  .always(function () {
    app.preloader.hide();
  })

  .fail(function () {
    app.dialog.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.');
  })

  .done(function (res) {
    if (res !== null) {
      console.log(res);
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }
      var x = 0;
      $.each(res, function(i, val) {
        sessionStorage.setItem("autoId_"+i, val.auto_id);
        sessionStorage.setItem("autoName_"+i, val.auto_name);
        sessionStorage.setItem("autoDev_"+i, val.dev_id);
        sessionStorage.setItem("autoType_"+i, val.auto_type);
        x = 1;
      });
      if (typeof localStorage.auto_id === "undefined") {
        localStorage.auto_id = sessionStorage.autoId_0;
        sessionStorage.auto_id = localStorage.auto_id;
      }
      autoListSession();

    } // res not null
  }); // after ajax
}

function autoListSession() {

  console.log("autoListSession()");

  if ($("#autoList").length==0) {
    return false;
  }
  $("#autoList").html("");

  var i;
  for (i = 0; i < 10; i++) {
    if (sessionStorage.getItem("autoId_"+i)) {

      var muted = "";
      if (sessionStorage.getItem("autoDev_"+i) == "null") {
        muted="muted";
      }

      var ico = "";
      if (sessionStorage.getItem("autoType_"+i) == "moto") {
        ico = '<i class="iicon material-icons">motorcycle</i>';
      }
      else {
        ico = '<i class="iicon material-icons">directions_car</i>';
      }
      var css = "";
      if (sessionStorage.auto_id == sessionStorage.getItem("autoId_"+i)) {
        css = "tab-link-active";
      }
      var html = "";
      html += '<li>';
      html += '<a href="#" data-id="'+sessionStorage.getItem("autoId_"+i)+'" class="'+css+'">';
      html += '<div class="item-content '+muted+'">';
      html += '<div class="item-media">'+ico+'</div>';
      html += '<div class="item-inner">';
      html += '<div class="item-title">'+sessionStorage.getItem("autoName_"+i)+'</div>';
      html += '</div>';
      html += '</div>';
      html += '</a>';
      html += '</li>';
      $("#autoList").append(html);
    }
  }
  autoRead(sessionStorage.auto_id);
}

function autoRead(auto_id) {

  console.log("autoRead("+auto_id+")");

  // DATA TO SEND
  var data_user = {
    auto_id: auto_id,
    //
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data = data_user;
  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_read.php",
    data: data,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: localStorage.timeout
  })
  .always(function () {
    app.preloader.hide();
  })

  .fail(function () {
    app.dialog.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.');
  })

  .done(function (res) {
    if (res !== null) {
      console.log(res);
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }
      res = res[0];
      if (res) {
        sessionStorage.auto_id = res.auto_id;
        sessionStorage.auto_name = res.auto_name;

        alert(auto_name);

        if (res.dev_id==null) {
          app.router.navigate("/sync/");
        }
      }
      else {
        app.router.navigate("/auto/");
      }
    } // res not null
  }); // after ajax
}
