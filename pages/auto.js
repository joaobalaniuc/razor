$$(document).on('page:init', '.page[data-name="auto"]', function (e) {
  if (typeof sessionStorage.auto_edit !== "undefined") {
    autoRead(sessionStorage.auto_edit, autoReadCbEdit);
    $("#carro, #moto").prepend("<input type='hidden' name='auto_id' value='"+sessionStorage.auto_edit+"' />");
    $('[data-name="auto"] [type=submit]').html("Salvar alterações");
    $('[data-name="auto"] .title').html("Editar veículo");
  }
  brands();
  brands("moto");
  sessionStorage.removeItem("auto_edit");
});

// SUBMIT FORM
$$(document).on("submit", '[data-name="auto"] form', function(e){
  e.preventDefault();
  autoInsert($(this));
});

// BUTTON EDIT
$$(document).on('click', '.auto_edit', function () {
  var id = $(this).attr("data-id");
  sessionStorage.auto_edit = id;
  app.router.navigate("/auto/");
});

// CHANGE
$$(document).on('change', '#carro .brands', function(e){
  var id = $(this).val();
  $("#carro .cars").html("");
  $("#carro .years").html("");
  cars(id);
});
$$(document).on('change', '#carro .cars', function(e){ var id = $(this).val(); years(id); });
//
$$(document).on('change', '#moto .brands', function(e){
  var id = $(this).val();
  $("#moto .cars").html("");
  $("#moto .years").html("");
  cars(id, "moto");
});
$$(document).on('change', '#moto .cars', function(e){ var id = $(this).val(); years(id, "moto"); });

// BRANDS
function brands(tipo) {

  var fn = Hello(tipo);

  if (typeof tipo === "undefined") { var tipo = "carro"; }
  var $el = $("#"+tipo+" .brands");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/marcas.json",
    complete: function() {} // não apagar preloader
  })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>"); });
  }); // after ajax
}

// MODELS
function cars(id, tipo) {

  var fn = Hello(id);

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .cars");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") {
    console.log(fn+" *** brand id not found");
    return false;
  }
  app.preloader.show("green");

  // RUN AJAX
  $.ajax({ url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculos/"+id+".json", })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>"); });
  }); // after ajax
}

// ANO/COMBUSTIVEL
function years(id, tipo) {

  var fn = Hello(id);

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .years");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") {
    console.log(fn+" *** car id not found");
    return false;
  }
  var brand_id = $("#"+tipo+" .brands").val();

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({ url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculo/"+brand_id+"/"+id+".json", })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.name+"</option>"); });
  }); // after ajax
}

// INSERT
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

  app.preloader.show("green");

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
