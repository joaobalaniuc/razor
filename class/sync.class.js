var tempo;
var tempoJs;
var syncPlayTime;

function syncPlay(start) {

  var fn = Hello(start);

  if (typeof start !== "undefined") {tempo = 90;}

  if (tempo == 0) {
    var res = {};
    res.step_txt = "O rastreador demorou muito para responder.";
    syncShow("Error", res);
    return false;
  }

  // DATA TO SEND
  var data_user = ajaxUserData();
  var data_user = $.param(data_user); // serialize
  var data_form = $("#syncForm").serialize();
  var data = data_user + "&" + data_form + "&auto_id="+sessionStorage.auto_id;

  if (typeof start !== "undefined") {
    data = data + "&auto_start=1";
    $("#syncArea").html("");
    $("#syncArea").fadeIn("slow");
  }
  console.log(fn+" --> sending data: "+data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/sync.php",
    data: data,
    error: function() { }, // prevent dialog
    beforeSend: function() { } // prevent preloader
  })
  .fail(function () {
    setTimeout(function() {
      syncPlay();
    }, 5000);
    notificationConex.open();
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (typeof res.error !== "undefined") {
      res.step_txt = res.error;
      syncShow("Error", res);
      return false;
    }
    if (res.step_status == "1") {
      tempo = 90;
      syncShow("Page", res);
    }
    if (res.step_status == "2") {
      syncShow("Done");
    }
    // loop
    if (res.step_status == "1" || res.step_status == "0") {
      syncPlayTime = setTimeout(function() {
        syncPlay();
      },5000);
    }
  });
}
function syncShow(page, res) {

  var fn = Hello();
  var ts = Date.now();
  var file = "pages/sync"+page+".html?"+ts;

  // fadeout previous pages
  if ($("#syncArea").find("div").length > 0) {
    $("#syncArea").find("div").fadeOut("slow");
  }
  // load page
  setTimeout(function() {
    $("#syncArea").load(file, function() {
      if (typeof res !== "undefined") {
        $(this).find(".step").html(res.step);
        $(this).find(".step_txt").html(res.step_txt);
        $(this).find(".step_tot").html(res.step_tot);
        $(this).children(":first").addClass(res.step_css);
      }
      $(this).children(":first").fadeIn("slow", function() {
        if (page=="Page") {
          // Countdown
          clearTimeout(tempoJs);
          contagem_tempo();
        }
      }); // fadein page > div
    }); // load page
  }, 1000);

}

// Countdown
function contagem_tempo() {
  //console.log("ping");
  tempo = tempo - 1;
  if (tempo == -1) {tempo = 0;}
  if (tempo<11) {$(".sync_foot .tempo").addClass("red");}
  $(".sync_foot .tempo").html(tempo);
  if (tempo == 0) {
    clearTimeout(syncPlayTime);
    syncPlay();
  }
  if (tempo > 0) {
    tempoJs = setTimeout(function () {
      contagem_tempo();
    }, 1000);
  }
}
function syncForm() {

}
