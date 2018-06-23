window.addEventListener("load", () => {
  const el = $("#app");

  // fixer api key- 0c21fcce6b2939f9b24813ddbe7de7e1

  // Compile Handlebar Templates
  // Note: Handlebars.compile() method returns a function.
  const errorTemplate = Handlebars.compile($("#error-template").html());
  const ratesTemplate = Handlebars.compile($("#rates-template").html());
  const exchangeTemplate = Handlebars.compile($("#exchange-template").html());
  const historicalTemplate = Handlebars.compile($("#historical-template").html);

  const html = ratesTemplate();
  el.html = html(html);
}); // End window.addEventListener
