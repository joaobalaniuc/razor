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
  sessionStorage.lat = lat;
  sessionStorage.lng = lng;

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
      localStorage.auto_imei = sessionStorage.autoImei_0;
    }
    sessionStorage.auto_id = localStorage.auto_id;
    sessionStorage.auto_imei = localStorage.auto_imei;
  }
});

function autoList() {

  var fn = Hello();

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoList();},1000);
    return false;
  }

  // DATA TO SEND
  var data = ajaxUserData();

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_list.php",
    data: data
  })
  .done(function (res) {

    ajaxLog(fn, res);
    if (!ajaxError(res)) {

      var x = 0;
      $.each(res, function(i, val) {
        sessionStorage.setItem("autoId_"+i, val.auto_id);
        sessionStorage.setItem("autoName_"+i, val.auto_name);
        sessionStorage.setItem("autoImei_"+i, val.auto_imei);
        sessionStorage.setItem("autoType_"+i, val.auto_type);
        x = 1;
      });
      //
      localStorage.auto_id = sessionStorage.autoId_0;
      localStorage.auto_imei = sessionStorage.autoImei_0;
      //
      sessionStorage.auto_id = localStorage.auto_id;
      sessionStorage.auto_imei = localStorage.auto_imei;
      //
      autoListSession();
    }

  }); // after ajax
}

function autoListSession(halt) {

  var fn = Hello(halt);

  if ($("#autoList").length==0) {
    return false;
  }
  $("#autoList").html("");

  var i;
  for (i = 0; i < 10; i++) {
    if (sessionStorage.getItem("autoId_"+i)) {

      var muted = "";
      if (sessionStorage.getItem("autoImei_"+i) == "null") {
        //muted="muted";
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
      html += '<a href="#" data-id="'+sessionStorage.getItem("autoId_"+i)+'" data-imei="'+sessionStorage.getItem("autoImei_"+i)+'" class="'+css+'">';
      html += '<div class="item-content '+muted+'">';
      html += '<div class="item-media">'+ico+'</div>';
      html += '<div class="item-inner">';
      html += '<div class="item-title" style="font-weight:500">'+sessionStorage.getItem("autoName_"+i)+'</div>';
      html += '</div>';
      html += '</div>';
      html += '</a>';
      html += '</li>';
      $("#autoList").append(html);
    }
  }
  if (typeof halt !== "undefined") {
    return false;
  }
  if (typeof sessionStorage.auto_imei !== "undefined" && sessionStorage.auto_imei != "null") {
    autoCheck(sessionStorage.auto_imei);
  }
  autoRead(sessionStorage.auto_id, autoReadCbHome);
}

function autoRead(auto_id, cb) {

  var fn = Hello(auto_id);

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoRead(auto_id);},1000);
    return false;
  }

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_id = auto_id;

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_read.php",
    data: data
  })
  .done(function (res) {
    txtPhone();
    ajaxLog(fn, res);
    if (!ajaxError(res)) { if (typeof cb === "function") { cb(res); } }
  }); // after ajax
}

function autoReadCbHome(data) {

  var fn = Hello();

  var res = data;
  var auto = res["auto"];
  var adm = res["adm"];

  if (auto) {
    sessionStorage.auto_id = auto.auto_id;
    sessionStorage.auto_name = auto.auto_name;
    sessionStorage.auto_imei = auto.auto_imei;
    console.log(fn+" *** auto_name: "+sessionStorage.auto_name);

    // Sou proprietário do veiculo
    if (auto.cli_id == localStorage.cli_id) {
      console.log(fn+" *** i'm owner");
      $(".verify-owner").each(function(i) { $(this).show(); });
    }
    // Dados do veiculo
    $(".auto_name").each(function(i) { $(this).html(auto["auto_name"]); });
    if (auto["auto_brand"] && auto["auto_model"]) {
      $(".auto_model").each(function(i) { $(this).html(auto["auto_brand"]+" "+auto["auto_model"]); });
    }
    $(".auto_edit").each(function(i) { $(this).attr("data-id", auto["auto_id"]); });
    $(".auto_phone").each(function(i) { $(this).html(auto["auto_phone"]); });

    // Ainda não sincronizou veiculo
    if (auto.auto_imei==null) { app.router.navigate("/sync/"); }
  }

  // Ainda não cadastrou um veiculo
  else { app.router.navigate("/auto/"); }

  // Adm list
  if (adm) { admListSession(adm); }
}

function autoCheck(auto_imei) {

  var fn = Hello(auto_imei);

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoCheck(auto_imei);},1000);
    return false;
  }

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_imei = auto_imei;

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_check.php",
    data: data,
    error: function() {} // não usar fail default (alert)
  })
  .fail(function () {
    setTimeout(function() {
      autoCheck(auto_imei);
    }, 5000);
    notificationConex.open();
  })
  .done(function (res) {

    ajaxLog(fn, res);
    if (!ajaxError(res)) {

      log = res["log"];
      gprs = res["gprs"];

      if (log) {

        // gprs status?
        if (gprs) {
          sessionStorage.gprs = gprs.server_ip;
          $(".auto_gprs").each(function(i) { $(this).html('<span class="txt-green shad-green">ON</span>'); });
        }
        else {
          sessionStorage.removeItem("gprs");
          $(".auto_gprs").each(function(i) { $(this).html("OFF"); });
        }

        // geo
        var lat = parseFloat(log.log_lng);
        var lng = parseFloat(log.log_lat);
        if (lat != sessionStorage.lat && lng != sessionStorage.lng) {

          console.log(fn+" *** new geolocation = "+lat+"/"+lng);

          sessionStorage.lat = lat;
          sessionStorage.lng = lng;

          if (typeof marker === "undefined") {
            map.easeTo({
              center: [lat, lng],
              zoom: 15
            });
            marker = new mapboxgl.Marker()
            .setLngLat([0, 0])
            .addTo(map);
          }
          else {
            map.easeTo({
              center: [lat, lng]
            });
          }
          marker.setLngLat([lat, lng]).addTo(map);
        }
        setTimeout(function() {
          autoCheck(auto_imei);
        }, 10000);
      }

    } // res not null
  }); // after ajax
}

function admListSession(adm) {

  var fn = Hello();

  $.each(adm, function(i, val) {

    var html = "";
    var muted = "";
    var icon = "user-circle";
    var title = "";

    if (!adm[i]["cli_name"]) {
      title = "-";
      muted = "muted";
      icon = "question";
      name = "este admin";
    }
    else {
      title = adm[i]["cli_name"];
      name = adm[i]["cli_name"];
    }

    html += '<li class="swipeout deleted-callback" data-phone="'+adm[i]["cli_phone"]+'">';
    html += '<div class="item-content swipeout-content" style="">';
    html += '<div class="item-media"><i class="fas fa-'+icon+'"></i>';
    html += '</div>';
    html += '<div class="item-inner">';
    html += '<div class="item-title">'+title+'</div>';
    html += '<div class="item-subtitle cel '+muted+'">'+adm[i]["cli_phone"]+'</div>';
    html += '</div>';
    html += '</div>';
    if (adm[i]["cli_phone"]!=localStorage.cli_phone) {
      html += '<div class="swipeout-actions-right">';
      html += '<a href="#" data-confirm="Remover '+name+'?" class="swipeout-delete" style="">Delete</a>';
    }
    html += '</div>';
    html += '</li>';

    $("#admList").append(html);
    txtPhone();
  });


}

function admInsert(adm_phone) {

  var fn = Hello(adm_phone);

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_id = sessionStorage.auto_id;
  data.adm_phone = adm_phone;

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/adm_insert.php",
    data: data
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) {
        var adm = [{
          cli_phone: adm_phone,
          cli_name: res["cli_name"]
        }];
        admListSession(adm);
      }
    } // res not null
  }); // after ajax
}

function admDelete(adm_phone) {

  var fn = Hello(adm_phone);

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_id = sessionStorage.auto_id;
  data.adm_phone = adm_phone;

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/adm_delete.php",
    data: data
  })
  .done(function (res) {
    ajaxLog(fn, res);
    ajaxError(res);
  }); // after ajax
}

function autoDelete() {

  var fn = Hello();

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_id = sessionStorage.auto_id;

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_delete.php",
    data: data
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) {
        sessionStorage.clear();
        window.location.href="index.html";
      }
    } // res not null
  }); // after ajax
}
