/* ==========================================================================
   Wrench and Soul — site behaviour
   1) Mobile navigation toggle
   2) Footer year
   3) LeadrVision form handling: _page injection, ?submitted=1 confirmation,
      fetch() submit with inline confirmation and graceful fallback
   ========================================================================== */
(function () {
  'use strict';

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/efad320e9c8bc61157864b93b2bd4b11';

  /* ------------------------------------------------------------ navigation */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      primaryNav.classList.toggle('is-open', !open);
    });

    primaryNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  /* ----------------------------------------------------------- footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------------------- return-to-page + confirmation */
  var pageField = document.getElementById('page-url');
  if (pageField) {
    pageField.value = window.location.href;
  }

  var successBox = document.getElementById('form-success');
  var errorBox = document.getElementById('form-error');
  var form = document.getElementById('contact-form');

  function showSuccess() {
    if (successBox) {
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showError() {
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === '1') {
    showSuccess();
    if (form) {
      form.reset();
    }
  }

  /* ----------------------------------------------- client-side form checks */
  function markInvalid(field) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
  }

  function clearInvalid(field) {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
  }

  function validate(formEl) {
    var firstInvalid = null;
    var required = formEl.querySelectorAll('[required]');

    Array.prototype.forEach.call(required, function (field) {
      clearInvalid(field);
      var value = (field.value || '').trim();
      var ok = value !== '';

      if (ok && field.type === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (ok && field.type === 'tel') {
        ok = value.replace(/[^0-9]/g, '').length >= 7;
      }
      if (!ok) {
        markInvalid(field);
        if (!firstInvalid) {
          firstInvalid = field;
        }
      }
    });

    return firstInvalid;
  }

  if (form) {
    form.addEventListener('input', function (event) {
      if (event.target.matches('.invalid')) {
        clearInvalid(event.target);
      }
    });

    form.addEventListener('submit', function (event) {
      var firstInvalid = validate(form);

      if (firstInvalid) {
        event.preventDefault();
        firstInvalid.focus();
        return;
      }

      // No fetch support (or a very old browser): let the browser do a plain POST.
      if (typeof window.fetch !== 'function' || typeof window.FormData !== 'function') {
        return;
      }

      event.preventDefault();

      var submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }
      if (errorBox) {
        errorBox.hidden = true;
      }

      var data = new FormData(form);
      data.set('_page', window.location.href);

      var payload = {};
      data.forEach(function (value, key) {
        payload[key] = value;
      });

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
          }
          return response.json().catch(function () {
            return { ok: true };
          });
        })
        .then(function (result) {
          if (!result || result.ok !== true) {
            throw new Error('Unexpected response from form service');
          }
          form.reset();
          showSuccess();
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
          }
          showError();
        });
    });
  }
})();
