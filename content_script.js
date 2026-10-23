chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== "fill_form") return;

  chrome.storage.local.get("profile", (data) => {
    const p = data.profile;
    if (!p) return;

    // Extracted directly from your form's data-params
    const fieldMap = {
      "name":         p.name,
      "email":        p.email,
      "address":      p.address,
      "phone number": p.phone,
      "comments":     "",   // leave blank or add p.comments if you add that field
    };

    function triggerFill(el, value) {
      const proto = el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, value);
      ["input", "change", "blur"].forEach(evt =>
        el.dispatchEvent(new Event(evt, { bubbles: true }))
      );
    }

    document.querySelectorAll('[data-params]').forEach((container) => {
      const raw = container.getAttribute('data-params') || "";

      // Field name is always the 2nd string in data-params
      const match = raw.match(/%.@\.\[\d+,"([^"]+)"/);
      if (!match) return;

      const fieldName = match[1].toLowerCase(); // e.g. "name", "email"
      const value = fieldMap[fieldName];
      if (value === undefined) return;

      const inputEl = container.querySelector('input, textarea');
      if (!inputEl) return;

      triggerFill(inputEl, value);
    });
  });
});