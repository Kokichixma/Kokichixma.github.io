document.addEventListener('DOMContentLoaded', () => {
  // Slaideris
  const rating1 = document.getElementById('rating1');
  const rating2 = document.getElementById('rating2');
  const rating3 = document.getElementById('rating3');

  if (rating1) {
    rating1.addEventListener('input', (e) => {
      const el = document.getElementById('rating1Value'); if (el) el.textContent = e.target.value;
    });
  }
  if (rating2) {
    rating2.addEventListener('input', (e) => {
      const el = document.getElementById('rating2Value'); if (el) el.textContent = e.target.value;
    });
  }
  if (rating3) {
    rating3.addEventListener('input', (e) => {
      const el = document.getElementById('rating3Value'); if (el) el.textContent = e.target.value;
    });
  }

  // Forma ir įvestys
  const form = document.getElementById('contactForm');
  const submitBtn = form ? form.querySelector('.btn-submit') : null;

  function setError(input, message) {
    if (!input) return;
    input.classList.add('input-invalid');
    let err = input.nextElementSibling;
    if (!err || !err.classList || !err.classList.contains('field-error')) {
      err = document.createElement('span');
      err.className = 'field-error';
      input.parentNode.insertBefore(err, input.nextSibling);
    }
    err.textContent = message;
  }

  function clearError(input) {
    if (!input) return;
    input.classList.remove('input-invalid');
    const err = input.parentNode.querySelector('.field-error');
    if (err) err.remove();
  }

  // Įvedimo taisyklės 
  const nameRegex = /^[\p{L} .'-]+$/u;
  function validateName(value) {
    if (!value || !value.trim()) return false;
    return nameRegex.test(value.trim());
  }

  function validateEmail(value) {
    if (!value || !value.trim()) return false;
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(value.trim());
  }

  function validateAddress(value) {
    if (!value || !value.trim()) return false;
    return true;
  }

  const phoneInput = document.getElementById('phone');
  function sanitizePhoneTyping(val) {
    return val.replace(/[^0-9+()\- ]+/g, '');
  }

  function formatPhoneOnBlur(val) {
    const digits = val.replace(/\D/g, '');
    let d = digits;
    if (d.length === 9 && d.charAt(0) === '8') d = d.slice(1);
    if (d.length === 11 && d.startsWith('370')) d = d.slice(3);

    if (d.length === 8 && d.charAt(0) === '6') {
      return '+370 ' + d.slice(0,3) + ' ' + d.slice(3);
    }
    return null;
  }

  function validatePhoneValue(val) {
    if (!val || !val.trim()) return true;
    const formatted = formatPhoneOnBlur(val);
    return formatted !== null;
  }

  function checkField(input) {
    if (!input) return true;
    const id = input.id;
    const v = input.value;
    if (id === 'vardas') {
      if (!validateName(v)) { setError(input, 'Vardas turi būti sudarytas tik iš raidžių.'); return false; }
      clearError(input); return true;
    }
    if (id === 'pavarde') {
      if (!validateName(v)) { setError(input, 'Pavardė turi būti sudaryta tik iš raidžių.'); return false; }
      clearError(input); return true;
    }
    if (id === 'email') {
      if (!validateEmail(v)) { setError(input, 'Netinkamas el. pašto formatas (pvz. vardas@domenas.lt).'); return false; }
      clearError(input); return true;
    }
    if (id === 'address') {
      if (!validateAddress(v)) { setError(input, 'Adresas negali būti tuščias.'); return false; }
      clearError(input); return true;
    }
    if (id === 'phone') {
      const clean = sanitizePhoneTyping(v);
      if (v !== clean) input.value = clean;
      clearError(input);
      return true;
    }
    return true;
  }

  function updateSubmitState() {
    if (!form || !submitBtn) return;
    const vV = document.getElementById('vardas');
    const vP = document.getElementById('pavarde');
    const vE = document.getElementById('email');
    const vA = document.getElementById('address');
    const valid = checkField(vV) && checkField(vP) && checkField(vE) && checkField(vA) && validateEmail(vE.value);
    submitBtn.disabled = !valid;
    if (submitBtn.disabled) submitBtn.classList.add('disabled'); else submitBtn.classList.remove('disabled');
  }

  ['vardas','pavarde','email','address','phone'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      checkField(el);
      updateSubmitState();
    });
    el.addEventListener('blur', () => {
      if (id === 'phone') {
        const formatted = formatPhoneOnBlur(el.value);
        if (formatted) {
          el.value = formatted;
          clearError(el);
        } else if (el.value.trim() !== '') {
          setError(el, 'Telefono numeris netinkamas. Naudokite +370 6xx xxxxx formatą.');
        } else {
          clearError(el);
        }
      } else {
        checkField(el);
      }
      updateSubmitState();
    });
  });

  if (submitBtn) {
    submitBtn.disabled = true;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = ['vardas','pavarde','email','address','phone'];
      let ok = true;
      inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const valid = checkField(el);
          if (!valid) ok = false;
        }
      });

      const emailEl = document.getElementById('email');
      if (!validateEmail(emailEl.value)) { setError(emailEl, 'Netinkamas el. pašto formatas.'); ok = false; }

      const phoneEl = document.getElementById('phone');
      if (phoneEl && phoneEl.value.trim() !== '' && !validatePhoneValue(phoneEl.value)) {
        setError(phoneEl, 'Telefono numeris netinkamas. Naudokite +370 6xx xxxxx formatą.');
        ok = false;
      }

      if (!ok) { updateSubmitState(); return; }

      // Informacijos kaupimas
      const formData = {
        vardas: document.getElementById('vardas').value.trim(),
        pavarde: document.getElementById('pavarde').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        rating1: parseInt(document.getElementById('rating1').value || '5'),
        rating2: parseInt(document.getElementById('rating2').value || '5'),
        rating3: parseInt(document.getElementById('rating3').value || '5')
      };

      console.log('Formos duomenys:', formData);
      const avg = ((formData.rating1 + formData.rating2 + formData.rating3) / 3).toFixed(1);
      const result = `${formData.vardas} ${formData.pavarde}: ${avg}`;
      document.getElementById('formResult').innerHTML = `<p class="result-display">✓ Ačiū, ${result}</p>`;

      setTimeout(() => {
        form.reset();
        document.getElementById('rating1Value').textContent = '5';
        document.getElementById('rating2Value').textContent = '5';
        document.getElementById('rating3Value').textContent = '5';
        updateSubmitState();
      }, 1500);
    });
  }
});
