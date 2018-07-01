$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  /*if (sessionStorage.smartselect_bugfix=="1") {
    console.log("smart select bugfix");
    return false;
  }*/
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

  console.log("autoList()");

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoList();},1000);
    return false;
  }

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

    } // res not null
  }); // after ajax
}


function autoListSession(halt) {

  console.log("autoListSession()");

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
      html += '<div class="item-title">'+sessionStorage.getItem("autoName_"+i)+'</div>';
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
  if (typeof sessionStorage.auto_imei !== "undefined") {
    autoCheck(sessionStorage.auto_imei);
  }
  autoRead(sessionStorage.auto_id);
}

function autoRead(auto_id) {

  console.log("autoRead("+auto_id+")");

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoRead(auto_id);},1000);
    return false;
  }

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
    txtPhone();
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
      auto = res["auto"];
      adm = res["adm"];

      if (auto) {
        sessionStorage.auto_id = auto.auto_id;
        sessionStorage.auto_name = auto.auto_name;
        console.log("*** auto_name: "+sessionStorage.auto_name);

        // Sou proprietário do veiculo
        if (auto.cli_id == localStorage.cli_id) {
          console.log("*** i'm owner");
          $(".verify-owner").each(function(i) { $(this).show(); });
        }
        // Dados do veiculo
        $(".auto_name").each(function(i) { $(this).html(auto["auto_name"]); });
        if (auto["auto_brand"] && auto["auto_model"]) {
          $(".auto_model").each(function(i) { $(this).html(auto["auto_brand"]+" "+auto["auto_model"]); });
        }
        $(".auto_phone").each(function(i) { $(this).html(auto["auto_phone"]); });

        // Ainda não sincronizou veiculo
        if (auto.auto_imei==null) { app.router.navigate("/sync/"); }
      }

      // Ainda não cadastrou um veiculo
      else { app.router.navigate("/auto/"); }

      // Adm list
      if (adm) { admList(adm); }

    } // res not null
  }); // after ajax
}

function autoCheck(auto_imei) {

  console.log("autoCheck("+auto_imei+")");

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoCheck(auto_imei);},1000);
    return false;
  }

  // DATA TO SEND
  var data_user = {
    auto_imei: auto_imei,
    //
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data = data_user;
  //app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_check.php",
    data: data,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: localStorage.timeout
  })
  .always(function () {

  })

  .fail(function () {
    setTimeout(function() {
      autoCheck(auto_imei);
    }, 5000);
    notificationConex.open();
  })

  .done(function (res) {
    if (res !== null) {
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }

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

          console.log("*** new geolocation = "+lat+"/"+lng);
          console.log(log);
          console.log(gprs);

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

function admList(adm) {

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
    html += '<div class="swipeout-actions-right">';
    html += '<a href="#" data-confirm="Remover '+name+'?" class="swipeout-delete" style="">Delete</a>';
    html += '</div>';
    html += '</li>';

    $("#admList").append(html);
    txtPhone();
  });


}

function admInsert(adm_phone) {

  console.log("admInsert("+adm_phone+")");

  if (sessionStorage.online == "false") {
    return false;
  }

  // DATA TO SEND
  var data_user = {
    auto_id: sessionStorage.auto_id,
    adm_phone: adm_phone,
    //
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data = data_user;
  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/adm_insert.php",
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
    app.dialog.alert("Ocorreu um erro interno. Tente novamente mais tarde.", 'Ops!');
  })

  .done(function (res) {
    if (res !== null) {
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }
      if (res.success) {
        console.log("*** Adm inserted");
        var adm = [{
          cli_phone: adm_phone,
          cli_name: res["cli_name"]
        }];
        admList(adm);
      }
    } // res not null
  }); // after ajax
}

function admDelete(adm_phone) {

  console.log("admDelete("+adm_phone+")");

  if (sessionStorage.online == "false") {
    return false;
  }

  // DATA TO SEND
  var data_user = {
    auto_id: sessionStorage.auto_id,
    adm_phone: adm_phone,
    //
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data = data_user;
  //app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/adm_delete.php",
    data: data,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: localStorage.timeout
  })
  .always(function () {
    //app.preloader.hide();
  })

  .fail(function () {
    app.dialog.alert("Ocorreu um erro interno. Tente novamente mais tarde.", 'Ops!');
  })

  .done(function (res) {
    if (res !== null) {
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }
      if (res.success) {
        console.log("*** Adm deleted");
      }
    } // res not null
  }); // after ajax
}
