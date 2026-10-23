// Tab switching — no inline onclick (blocked by MV3 CSP)
function switchTab(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`pax-${i}`).style.display = i === n ? 'block' : 'none';
    document.getElementById(`tab-p${i}`).classList.toggle('active', i === n);
  });
}

// Attach tab listeners properly
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tab-p1").addEventListener("click", () => switchTab(1));
  document.getElementById("tab-p2").addEventListener("click", () => switchTab(2));
  document.getElementById("tab-p3").addEventListener("click", () => switchTab(3));

  // Load saved profile
  chrome.storage.local.get("profile", (data) => {
    if (!data.profile) return;
    const p = data.profile;

    [1, 2, 3].forEach(i => {
      const px = p[`passenger${i}`] || {};
      document.getElementById(`name${i}`).value   = px.name   || "";
      document.getElementById(`age${i}`).value    = px.age    || "";
      document.getElementById(`gender${i}`).value = px.gender || "";
      document.getElementById(`berth${i}`).value  = px.berth  || "";
    });

    document.getElementById("mobile").value        = p.mobile      || "";
    document.getElementById("email").value         = p.email       || "";
    document.getElementById("autoUpgrade").checked = p.autoUpgrade || false;
    document.getElementById("autoUPI").checked     = p.autoUPI     !== false;
    document.getElementById("autoSubmit").checked  = p.autoSubmit  || false;
  });

  // Save button
  document.getElementById("save").addEventListener("click", () => {
    const profile = {
      mobile:      document.getElementById("mobile").value,
      email:       document.getElementById("email").value,
      autoUpgrade: document.getElementById("autoUpgrade").checked,
      autoUPI:     document.getElementById("autoUPI").checked,
      autoSubmit:  document.getElementById("autoSubmit").checked,
    };

    [1, 2, 3].forEach(i => {
      profile[`passenger${i}`] = {
        name:   document.getElementById(`name${i}`).value.toUpperCase(),
        age:    document.getElementById(`age${i}`).value,
        gender: document.getElementById(`gender${i}`).value,
        berth:  document.getElementById(`berth${i}`).value,
      };
    });

    chrome.storage.local.set({ profile }, () => {
      showStatus("✅ Profile saved!");
    });
  });

  // Fill button
  document.getElementById("fill").addEventListener("click", () => {
    runFill(false);
  });

  // Tatkal button
  document.getElementById("fillTatkal").addEventListener("click", () => {
    runFill(true);
  });
});

function showStatus(msg) {
  const el = document.getElementById("status");
  el.textContent = msg;
  setTimeout(() => el.textContent = "", 3000);
}

function runFill(tatkalMode) {
  chrome.storage.local.get("profile", (data) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: fillIRCTC,
        args: [data.profile, tatkalMode]
      });
      showStatus(tatkalMode ? "🔥 Tatkal fill done!" : "⚡ Form filled!");
    });
  });
}

// ─── Keep the entire fillIRCTC function exactly as before ───
function fillIRCTC(p, tatkalMode) {
  if (!p) return;

  function setVal(el, value) {
    if (!el) return;
    el.focus();
    if (el.tagName === 'INPUT') {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
    } else if (el.tagName === 'SELECT') {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, value);
    }
    ['input', 'change', 'blur', 'keyup'].forEach(e =>
      el.dispatchEvent(new Event(e, { bubbles: true }))
    );
    el.dispatchEvent(new KeyboardEvent('keydown',  { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup',    { bubbles: true }));
  }

  function find(...selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  const passengerRows = document.querySelectorAll(
    'app-passenger-input, .passenger-row, [class*="passenger"], tr.ng-star-inserted'
  );

  if (passengerRows.length > 0) {
    passengerRows.forEach((row, i) => {
      const px = p[`passenger${i + 1}`];
      if (!px || !px.name) return;

      const nameEl   = row.querySelector('input[formcontrolname*="name"], input[formcontrolname*="Name"], input[placeholder*="Name"]');
      const ageEl    = row.querySelector('input[formcontrolname*="age"],  input[formcontrolname*="Age"]');
      const genderEl = row.querySelector('select[formcontrolname*="gender"], select[formcontrolname*="Gender"]');
      const berthEl  = row.querySelector('select[formcontrolname*="berth"],  select[formcontrolname*="Berth"], select[formcontrolname*="choice"]');

      setVal(nameEl,   px.name);
      setVal(ageEl,    px.age);
      setVal(genderEl, px.gender);
      setVal(berthEl,  px.berth);
    });

  } else {
    const px = p.passenger1 || {};

    const nameSelectors = [
      'input[formcontrolname="passengerName"]',
      'input[formcontrolname="name"]',
      'input[formcontrolname="psgn_name"]',
      'input[formcontrolname="passenger_name"]',
      'input[placeholder*="Name"]',
      'input[placeholder*="name"]',
      'input[id*="name"]',
      'input[id*="Name"]',
    ];
    let nameEl = null;
    for (const sel of nameSelectors) {
      nameEl = document.querySelector(sel);
      if (nameEl) { console.log("Name field found:", sel); break; }
    }
    if (nameEl) {
      nameEl.focus();
      setVal(nameEl, px.name || "");
    }

    const ageEl = find(
      'input[formcontrolname="passengerAge"]',
      'input[formcontrolname="age"]',
      'input[placeholder*="Age"]',
      'input[type="number"]'
    );
    setVal(ageEl, px.age || "");

    const genderEl = find(
      'select[formcontrolname="passengerGender"]',
      'select[formcontrolname="gender"]',
      'select'
    );
    setVal(genderEl, px.gender || "");

    const allSelects = document.querySelectorAll('select');
    if (allSelects[1]) setVal(allSelects[1], px.berth || "");
  }

  const mobileEl = find(
    'input[formcontrolname="mobileNumber"]',
    'input[formcontrolname="mobile"]',
    'input[placeholder*="Mobile"]',
    'input[placeholder*="mobile"]'
  );
  setVal(mobileEl, p.mobile || "");

  const emailEl = find(
    'input[formcontrolname="email"]',
    'input[type="email"]',
    'input[placeholder*="mail"]'
  );
  setVal(emailEl, p.email || "");

  // ── Consider for Upgradation (BEFORE payment) ──
  if (p.autoUpgrade) {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const cb of allCheckboxes) {
      const label = (
        cb.closest('label')?.textContent ||
        document.querySelector(`label[for="${cb.id}"]`)?.textContent ||
        cb.getAttribute('formcontrolname') ||
        cb.id || ""
      ).toLowerCase();

      if (label.includes('upgrad') || label.includes('upgrade')) {
        if (!cb.checked) {
          cb.click();
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          console.log("✅ Upgradation checkbox clicked");
        } else {
          console.log("ℹ️ Upgradation already checked");
        }
        break;
      }
    }
  }

  // ── BHIM/UPI radio (AFTER upgradation) ──
  if (p.autoUPI) {
    const radios = document.querySelectorAll('input[type="radio"]');
    for (const radio of radios) {
      const label = (
        radio.closest('label')?.textContent ||
        document.querySelector(`label[for="${radio.id}"]`)?.textContent ||
        radio.value || ""
      ).toLowerCase();

      if (label.includes('bhim') || (label.includes('upi') && !label.includes('cc') && !label.includes('cl'))) {
        radio.focus();
        radio.click();
        radio.checked = true;
        radio.dispatchEvent(new MouseEvent('click',  { bubbles: true }));
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ BHIM/UPI selected");
        break;
      }
    }
  }

  // ── Tatkal / auto next ──
  if (tatkalMode || p.autoSubmit) {
    setTimeout(() => {
      const nextBtn = find(
        'button[type="submit"]',
        'button.train_Search',
        'button[class*="next"]',
        'button[class*="Next"]',
        'input[type="submit"]'
      );
      if (nextBtn) {
        nextBtn.click();
        console.log("✅ Next clicked");
      }
    }, 500);
  }

  console.log("✅ IRCTC Fast Filler done!");
}