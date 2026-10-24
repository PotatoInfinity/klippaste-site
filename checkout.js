// Klip checkout: Lemon Squeezy hosted checkout links for license.html.
// Checkout uses variant UUIDs (slugs), not numeric variant IDs; numeric IDs
// are for webhooks/API only.
// Live-mode variant slugs; keep in sync with the hosted LS_VARIANT_MAP.
(function () {
  var CONFIG = {
    store: "klip",
    mode: "live",
    variants: {
      klip: "78a3f203-078e-4559-b9b4-b12d5474c862",
      klipocr: "0dcb5647-23a7-42a8-8c2c-d692fc231b78",
      bundle: "31b83864-5b2a-41f8-8e5f-28a3b199ae50"
    }
  };

  function variantFor(product) {
    return Object.prototype.hasOwnProperty.call(CONFIG.variants, product)
      ? CONFIG.variants[product]
      : "";
  }

  // Brackets in query keys stay literal (no double-encoding); only values
  // are encoded.
  function urlFor(product) {
    var variant = variantFor(product);
    if (!variant) return "";
    var url = "https://" + CONFIG.store + ".lemonsqueezy.com/checkout/buy/" +
      variant +
      "?checkout[custom][scope]=" + encodeURIComponent(product) +
      "&checkout[custom][seats]=1";

    var params = null;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      params = null;
    }
    if (params) {
      var promo = params.get("promo") || params.get("promo_code");
      var ref = params.get("ref") || params.get("ref_code");
      if (promo) {
        url += "&checkout[custom][promo_code]=" + encodeURIComponent(promo);
      }
      if (ref) {
        url += "&checkout[custom][ref_code]=" + encodeURIComponent(ref);
      }
    }
    return url;
  }

  function init() {
    if (CONFIG.mode !== "test" && CONFIG.mode !== "live") return;
    var nodes = document.querySelectorAll("[data-checkout]");
    Array.prototype.forEach.call(nodes, function (node) {
      var product = node.getAttribute("data-checkout");
      if (!variantFor(product)) return;
      var url = urlFor(product);
      if (!url) return;
      if (node.tagName === "A") {
        node.href = url;
      } else if (node.tagName === "BUTTON") {
        node.addEventListener("click", function () {
          window.location.href = url;
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
