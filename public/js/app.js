window.addEventListener("load", () => {
  const el = $("#app");

  // app.js front-end app running in browser

  // =========================================================== //
  // Compile Handlebar Templates
  // Note: Handlebars.compile returns a function. i.e. to use
  // ratesTemplate would go "let html = ratesTemplate()" and variable
  // html will now be equal to the html in template plus any variables
  // with substituted values
  // =========================================================== //
  const errorTemplate = Handlebars.compile($("#error-template").html());
  const ratesTemplate = Handlebars.compile($("#rates-template").html());
  const exchangeTemplate = Handlebars.compile($("#exchange-template").html());
  const historicalTemplate = Handlebars.compile(
    $("#historical-template").html()
  );
  // =========================================================== //
  // ========== End Handlebar Templates Creation =============== //
  // =========================================================== //

  // =========================================================== //
  // Front-End Router Declaration via the vanilla-router package //
  // =========================================================== //
  const router = new Router({
    mode: "history",
    page404: path => {
      const html = errorTemplate({
        color: "yellow",
        title: "Error 404 - Page Not Found!",
        message: `The path '/${path}' does not exist on this site`
      });
      el.html(html);
    }
  });
  // =========================================================== //
  // ========== End Front-End Vanilla-Router Declaration ======= //
  // =========================================================== //

  // =========================================================== //
  // ========= Front-End vanilla-router Routes ================= //
  // =========================================================== //
  // Instantiate api handler to communicate with our Express(proxy) server
  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000
  });

  // Display Error Banner. Used in catch clause further down.
  const showError = error => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: "red", title, message });
    el.html(html);
  };

  /* === Display Latest Currency Rates Route ====================
   Get rates data from the localhost:3000/api/rates Express
  endpoint and pass it to the handlebars rates-template to display 
  the information. 
  ============================================================= */
  /* jshint ignore:start */
  router.add("/", async () => {
    // Display loader Animation from SemanticUI first
    let html = ratesTemplate();
    el.html(html);
    try {
      // Load Currency Rates from Express proxy via Axios client
      const response = await api.get("/rates");
      const { base, date, rates } = response.data;
      
      // Display Rates Table via handlebars template
      html = ratesTemplate({ base, date, rates });
      el.html(html);
    } catch (error) {
      showError(error);
    } finally {
      // Remove loader status. Kills the SemanticUI Loader animation
      $(".loading").removeClass("loading");
    }
  });
  /* jshint ignore:end */

  // =============================================================== //
  // =======  Helper functions for /exchange route ================= //
  // Perform POST request, calculate and display conversion results //
  // ============================================================== //

  /* jshint ignore:start */
  const getConversionResults = async () => {
    // Extract the form data
    const from = $("#from").val();
    const to = $("#to").val();
    const amount = $("#amount").val();
    // Send post(form) data to Express(proxy) server
    try {
      const response = await api.post("/convert", { from, to });
      const { rate } = response.data;
      const result = rate * amount;
      $("#result").html(`${to} ${result}`);
    } catch (error) {
      showError(error);
    } finally {
      $("#result-segment").removeClass("loading");
    }
  };
  /* jshint ignore:end */

  // Handle Convert Button Click Event
  const convertRatesHandler = () => {
    if ($(".ui.form").form("is valid")) {
      // hide error message
      $("ui.error.message").hide();
      // POST to Express Server
      $("#result-segment").addClass("loading");
      getConversionResults();
      // Prevent page from submitting to server
      return false;
    }
  };
  // ============================================================ //
  // ========= End Helper Functions ============================= //
  // ============================================================ //

  // ============================================================ //
  // ========= vanilla-router Exchange Route ==================== //
  // ============================================================ //
  /* jshint ignore:start */
  router.add('/exchange', async () => {
    // Display loader first
    let html = exchangeTemplate();
    el.html(html);

    try {
      // Load Symbols for Dropdown Menus
      const response = await api.get('/symbols');
      const { symbols } = response.data;

      html = exchangeTemplate({ symbols });
      el.html(html);
      $('.loading').removeClass('loading'); // kill loader animation
      // Validate Form Inputs
      $('.ui.form').form({
        fields: {
          from: 'empty',
          to: 'empty',
          amount: 'decimal',
        },
      });
  
      // Specify Submit Handler
      $('.submit').click(convertRatesHandler);
    } catch (error) {
      showError(error);
    }
  })
  /* jshint ignore:end */
// ============================================================== //
// ================ End Exchange Route ========================== //
// ============================================================== //
  
// ============================================================== //
// ========= vanilla-router Historical Route ==================== //
// ============================================================== //
  router.add("/historical", () => {
    let html = historicalTemplate();
    el.html(html);
  });
  // =========================================================== //
  // ================ End vanilla-router Front-End Routes ====== //
  // =========================================================== //

  // Navigate app to current url
  // This is at heart of how front-end routing works
  router.navigateTo(window.location.pathname);

  // Highlight Active Menu on Refresh/Page Reload
  const link = $(`a[href$='${window.location.pathname}']`);
  link.addClass("active");

  $("a").on("click", event => {
    // Block browser page load
    event.preventDefault();

    // Highlight Active Menu on Click
    const target = $(event.target);
    $(".item").removeClass("active");
    target.addClass("active");

    // Navigate to clicked url
    const href = target.attr("href");
    const path = href.substr(href.lastIndexOf("/"));

    // This is what makes app navigate to
    // a new uri everytime menu item is clicked
    router.navigateTo(path);
  });
}); // end window.addEventListener
