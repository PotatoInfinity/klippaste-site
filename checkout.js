// Klip checkout: Lemon Squeezy hosted checkout links for license.html.
// Checkout uses variant UUIDs (slugs), not numeric variant IDs; numeric IDs
// are for webhooks/API only.
// TEST MODE: swap the variant slugs and set mode to "live" at release.
// Test-mode checkout links must not stay public long-term.
(function () {
  var CONFIG = {
    store: "klip",
    mode: "test",
    variants: {
      klip: "c3faa744-f5bd-4d31-98ed-1dc3ed6e38da",
      klipocr: "3de8ea6c-cec3-4dca-9295-01611ac3ca65",
      bundle: "e8351746-8a09-4f5f-bc66-81a66dcec470"
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
