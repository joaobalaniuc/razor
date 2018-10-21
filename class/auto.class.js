function autoList() {

  var fn = Hello();

  if (sessionStorage.online == "false") {
    setTimeout(function() {autoList();},1000);
    return false;
  }

  for (i=0;i<=10;i++) {
    sessionStorage.removeItem("autoId_"+i);
    sessionStorage.removeItem("autoName_"+i);
    sessionStorage.removeItem("autoImei_"+i);
    sessionStorage.removeItem("autoType_"+i);
    sessionStorage.removeItem("autoPhone_"+i);
  }

  // DATA TO SEND
  var data = ajaxUserData();

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_list.php",
    data: data
  })
  .done(function (res) {

    ajaxLog(fn, res);
    if (!ajaxError(res)) {

      if (typeof res[0] !== "undefined") {
        var x = 0;
        $.each(res, function(i, val) {
          sessionStorage.setItem("autoId_"+i, val.auto_id);
          sessionStorage.setItem("autoName_"+i, val.auto_name);
          sessionStorage.setItem("autoImei_"+i, val.auto_imei);
          sessionStorage.setItem("autoType_"+i, val.auto_type);
          sessionStorage.setItem("autoPhone_"+i, val.auto_phone);
          sessionStorage.setItem("autoPass_"+i, val.auto_password);
          x = 1;
        });
        //
        localStorage.auto_id = sessionStorage.autoId_0;
        localStorage.auto_imei = sessionStorage.autoImei_0;
        localStorage.auto_phone = sessionStorage.autoPhone_0;
        localStorage.auto_pass = sessionStorage.autoPass_0;
        //
        sessionStorage.auto_id = localStorage.auto_id;
        sessionStorage.auto_imei = localStorage.auto_imei;
        sessionStorage.auto_phone = localStorage.auto_phone;
        sessionStorage.auto_pass = localStorage.auto_pass;
        //
        autoListSession();
      } // auto > 0
      else {
        $("[href='#tab-conf']").addClass("disabled");
        $("[href='#tab-menu']").addClass("disabled");
        app.router.navigate("/auto/");
      } // auto = null
    } // res success

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
        ico = '<i class="fas fa-car"></i>';
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
    if (auto["auto_type"]=="carro") {
      $(".auto_type").each(function(i) { $(this).html('<i class="fas fa-car"></i>') });
    }
    else {
      $(".auto_type").each(function(i) { $(this).html('<i class="material-icons">motorcycle</i>') });
    }
    if (auto.auto_param_mode == "monitor") {
      $("#modeMonitorOn").show();
      $("#modeTrackerOn").hide();
    }
    if (auto.auto_param_cutoff == "1") {
      $("#modeCutOn").show();
      $("#modeCutOff").hide();
    }
    // Ainda não sincronizou veiculo
    if (auto.auto_phone==null) { app.router.navigate("/sync/"); }
  }

  // Ainda não cadastrou um veiculo
  else { app.router.navigate("/auto/"); }

  // Adm list
  if (adm) { admListSession(adm); }
}

function autoCheck(auto_imei) {

  if ($("#map").is(":hidden") || app.views.main.router.url !== "/home/") {
    setTimeout(function() {autoCheck(auto_imei);},1000);
    return false;
  }

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
    beforeSend: function() {}, // não usar preloader
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
          $(".auto_gprs").each(function(i) { $(this).html('<span class="txt-green shad-green">ON</span> &nbsp; <span style="color:rgba(255, 255, 255, 0.54)">('+res["log"]["log_gpstime"]+")</span>"); });
        }
        else {
          sessionStorage.removeItem("gprs");
          $(".auto_gprs").each(function(i) { $(this).html("OFF"); });
        }

        // geo
        var lat = parseFloat(log.log_lng);
        var lng = parseFloat(log.log_lat);
        if (lat != sessionStorage.auto_lat && lng != sessionStorage.auto_lng) {

          console.log(fn+" *** new geolocation = "+lat+"/"+lng);

          sessionStorage.auto_lat = lat;
          sessionStorage.auto_lng = lng;

          if (typeof marker === "undefined") {
            map.easeTo({
              center: [lat, lng],
              zoom: 15
            });
            var el = document.createElement('div');
            el.className = 'pulse';
            marker = new mapboxgl.Marker(el)
            .setLngLat([0, 0])
            .addTo(map);

            /*marker = new mapboxgl.Marker()
            .setLngLat([0, 0])
            .addTo(map);*/
          }
          else {
            map.easeTo({
              center: [lat, lng]
            });
          }
          marker.setLngLat([lat, lng]).addTo(map);
        }
      }

      setTimeout(function() {
        autoCheck(auto_imei);
      }, 10000);

    } // res not null
  }); // after ajax
}

function autoInsert($el) {

  var fn = Hello();

  // DATA TO SEND
  var data_form = $el.serialize();
  var data_auto = {
    auto_brand: $el.find(".brands option:selected").text(),
    auto_model: $el.find(".cars option:selected").text(),
    auto_year: $el.find(".years option:selected").text(),
  };
  var data_user = ajaxUserData();
  var data_user = $.param(data_user); // serialize
  var data_auto = $.param(data_auto);
  var data = data_form + "&" + data_user + "&" + data_auto;
  console.log(fn+" --> sending data: "+data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_insert.php",
    data: data,
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) {
        // INSERT
        if (res.id) {
          sessionStorage.auto_id = res.id;
          sessionStorage.auto_name = $el.find("[name=auto_name]").val().toUpperCase();
          sessionStorage.removeItem("auto_imei");
          app.router.navigate("/sync/");
        }
        // UPDATE
        else {
          window.location.href="index.html";
        }
      }
    }
  }); // after ajax
}

function autoReadCbEdit(data) {

  var fn = Hello();

  var res = data;
  var auto = res["auto"];
  var adm = res["adm"];

  if (auto) {
    // Dados do veiculo
    $("[name=auto_name]").val(auto["auto_name"]);
    $("[name=auto_brand_id]").append("<option selected value='"+auto["auto_brand_id"]+"'>"+auto["auto_brand"]+"</option>");
    $("[name=auto_model_id]").html("<option selected value='"+auto["auto_model_id"]+"'>"+auto["auto_model"]+"</option>");
    $("[name=auto_year_id]").html("<option selected value='"+auto["auto_year_id"]+"'>"+auto["auto_year"]+"</option>");
    //
    $(".auto_brand").html(auto["auto_brand"]);
    $(".auto_model").html(auto["auto_model"]);
    $(".auto_year").html(auto["auto_year"]);
    //
    if (auto["auto_type"]=="moto") {
      $(".tab1").removeClass("tab-link-active");
      $(".tab2").addClass("tab-link-active");
    }
  }

  //brands();
  //brands("moto");

}

function autoDelete() {

  var fn = Hello();

  // DATA TO SEND
  var data = ajaxUserData();
  data.auto_id = sessionStorage.auto_id;
  console.log(fn+" --> sending data...");
  console.log(data);

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

function autoUpdate(data_auto) {

  var fn = Hello();

  // DATA TO SEND
  var data_user = ajaxUserData();
  var data_user = $.param(data_user); // serialize
  var data_auto = $.param(data_auto);
  var data = data_user + "&" + data_auto;
  console.log(fn+" --> sending data...");
  console.log(data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_update.php",
    data: data
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) { }
    } // res not null
  }); // after ajax
}
