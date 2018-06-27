window.addEventListener("load", () => {
  const el = $("#app");

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
  // Instantiate api handler
  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000
  });

  // Display Error Banner
  const showError = error => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: "red", title, message });
    el.html(html);
  };

  // Display Latest Currency Rates
  /* jshint ignore:start */
  router.add("/", async () => {
    // Display loader first
    let html = ratesTemplate();
    el.html(html);
    try {
      // Load Currency Rates
      const response = await api.get("/rates");
      const { base, date, rates } = response.data;
      // Display Rates Table
      html = ratesTemplate({ base, date, rates });
      el.html(html);
    } catch (error) {
      showError(error);
    } finally {
      // Remove loader status
      $(".loading").removeClass("loading");
    }
  });
  /* jshint ignore:end */

  router.add("/exchange", () => {
    let html = exchangeTemplate();
    el.html(html);
  });

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
