window.addEventListener("load", () => {
  const el = $("#app");

  // Compile Handlebar Templates
  // Note: Handlebars.compile() method returns a function.
  const errorTemplate = Handlebars.compile($("#error-template").html());
  const ratesTemplate = Handlebars.compile($("#ratesTemplate").html());
  const exchangeTemplate = Handlebars.compile($("#exchange-template").html());
  const historicalTemplate = Handlebars.compile($("#historical-template").html);

  const html = ratesTemplate();
  el.html = html;
}); // End window.addEventListener
