sessionStorage.auto_id_ignore = 1;

// SUBMIT FORM
$$('[data-name="auto"]').on("submit", "form", function(e){
  e.preventDefault();
  autoInsert($(this));
});

// CHANGE
$$('[data-name="auto"]').on("change", "#carro .brands", function(e){ var id = $(this).val(); cars(id); });
$$('[data-name="auto"]').on("change", "#carro .cars", function(e){ var id = $(this).val(); years(id); });
//
$$('[data-name="auto"]').on("change", "#moto .brands", function(e){ var id = $(this).val(); cars(id, "moto"); });
$$('[data-name="auto"]').on("change", "#moto .cars", function(e){ var id = $(this).val(); years(id, "moto"); });

brands();
brands("moto");

// BRANDS
function brands(tipo) {

  if (typeof tipo === "undefined") { var tipo = "carro"; }
  var $el = $("#"+tipo+" .brands");

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/marcas.json",
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
      $.each(res, function(key, val) {
        $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>");
      });
    } // res not null
  }); // after ajax
}

// MODELS
function cars(id, tipo) {

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .cars");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") {
    console.log("id not found");
  }
  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculos/"+id+".json",
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
      $.each(res, function(key, val) {
        $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>");
      });
    } // res not null
  }); // after ajax
}

// ANO/COMBUSTIVEL
function years(id, tipo) {

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .years");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") { console.log("car id not found"); }

  var brand_id = $("#"+tipo+" .brands").val();

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculo/"+brand_id+"/"+id+".json",
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
      $.each(res, function(key, val) {
        $el.append("<option value='"+val.id+"'>"+val.name+"</option>");
      });
    } // res not null
  }); // after ajax
}

// INSERT
function autoInsert($el) {

  // DATA TO SEND
  var data_form = $el.serialize();
  var data_auto = {
    auto_brand: $el.find(".brands option:selected").text(),
    auto_model: $el.find(".cars option:selected").text(),
    auto_year: $el.find(".years option:selected").text(),
  };
  var data_user = {
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data_user = $.param(data_user); // serialize
  var data_auto = $.param(data_auto);
  var data = data_form + "&" + data_user + "&" + data_auto;
  console.log(data);

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_insert.php",
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
      if (res.success) {
        sessionStorage.auto_id = res.id;
        sessionStorage.auto_name = $el.find("[name=auto_name]").val().toUpperCase();
        app.router.navigate("/sync/");
      }

    } // res not null
  }); // after ajax
}
