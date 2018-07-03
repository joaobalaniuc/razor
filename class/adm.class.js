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
    if (adm[i]["cli_phone"] != localStorage.cli_phone) {
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
