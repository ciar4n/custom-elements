(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

(function () {
  // Keycodes
  var KEYCODE = {
    TAB: 9,
    ESC: 27
  };

  customElements.define('joomla-modal', function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

      _this.triggerBtn = '';
      _this.focusableElements = null;
      _this.focusableSelectors = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
      _this.container = _this.querySelector('.joomla-modal-dialog');
      return _this;
    }
    /* eslint-enable */

    _createClass(_class, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (!this.id) {
          throw new Error('`Joomla-modal` requires an id');
        }

        this.title = this.getAttribute('title') || 'Modal';
        this.setAttribute('role', 'dialog');
        this.classList.add('fade');
        this.iframe = this.getAttribute('iframe') || '';
        this.width = this.getAttribute('width') || '100%';
        this.height = this.getAttribute('height') || '600px';

        if (!this.container) {
          var cont = document.createElement('div');
          cont.classList.add('joomla-modal-dialog');
          cont.setAttribute('role', 'document');
          cont.innerHTML = this.innerHTML;
          this.innerHTML = '';
          this.appendChild(cont);
          this.container = this.querySelector('.joomla-modal-dialog');
        }

        this.header = this.querySelector('header');
        this.main = this.querySelector('section');
        this.footer = this.querySelector('footer');

        this.setAttribute('tabindex', -1);

        // Unique Id
        var randomId = 'modal-title-' + new Date().getUTCMilliseconds();
        this.setAttribute('aria-labelledby', randomId);

        if (!this.header) {
          var htag = document.createElement('h5');
          htag.innerText = this.title;
          htag.id = randomId;
          var closeButton = document.createElement('button');
          closeButton.setAttribute('aria-label', 'Close');
          closeButton.setAttribute('data-dismiss', '');
          closeButton.innerHTML = '<span aria-hidden="true">×</span>';

          var header = document.createElement('header');

          header.appendChild(htag);
          header.appendChild(closeButton);

          this.container.insertAdjacentElement('afterbegin', header);
        }
        this.header = this.container.querySelector('header');
        this.body = this.container.querySelector('section');
        this.footer = this.container.querySelector('footer');

        this.triggerBtn = document.querySelector('[data-href="#' + this.id + '"]');
        if (this.triggerBtn) {
          this.triggerBtn.addEventListener('click', this.open.bind(this));
        }
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {
        if (this.triggerBtn) {
          this.triggerBtn.removeEventListener('click', this.open);
        }
      }
    }, {
      key: 'open',
      value: function open() {
        var _this2 = this;

        var dropShadow = document.createElement('div');
        dropShadow.classList.add('modal-backdrop', 'fade');
        dropShadow.classList.add('modal-backdrop', 'show');
        document.body.appendChild(dropShadow);

        this.removeAttribute('aria-hidden');
        // Iframe specific code, reload
        if (this.body) {
          this.iframeEl = this.main.querySelector('iframe');
          if (this.iframe) {
            if (this.iframeEl) {
              this.iframeEl.parentNode.remove(this.iframeEl);
            }
            var newIframe = document.createElement('iframe');
            newIframe.width = this.width;
            newIframe.height = this.height;
            newIframe.src = this.iframe;
            newIframe.setAttribute('frameborder', 0);
            this.body.appendChild(newIframe);
            this.iframeEl = this.main.querySelector('iframe');
          }
        }

        // Adjust the dimensions
        this.adjustDimensions();

        this.scrollTop = 0;
        this.classList.add('show');

        this.focusableElements = [].slice.call(this.querySelectorAll(this.focusableSelectors.join()));
        if (this.focusableElements.length) {
          this.focusableElements[0].focus();
        } else {
          this.header.querySelector('button').focus();
        }

        this.evKeypress = this.keyPress.bind(this);
        this.evClose = this.close.bind(this);
        this.evDocumentClose = this.documentClose.bind(this);

        // Keyboard handling
        this.addEventListener('keydown', this.evKeypress);

        // Close on click outside the modal
        document.addEventListener('click', this.evDocumentClose);

        // Is there a close button?
        var modalButtons = [].slice.call(this.querySelectorAll('[data-dismiss]'));
        // Add listeners for close
        modalButtons.forEach(function (modalButton) {
          modalButton.addEventListener('click', _this2.evClose);
        });
      }
    }, {
      key: 'close',
      value: function close() {
        var _this3 = this;

        this.removeEventListener('keydown', this.evKeypress);
        document.removeEventListener('click', this.evDocumentClose);

        // Is there a close button?
        var modalButtons = [].slice.call(this.querySelectorAll('[data-dismiss]'));
        // Add listeners for close
        modalButtons.forEach(function (modalButton) {
          modalButton.removeEventListener('click', _this3.evClose);
        });

        var dropShadow = document.querySelector('.modal-backdrop');
        if (dropShadow) document.body.removeChild(dropShadow);
        this.setAttribute('aria-hidden', 'true');
        this.classList.remove('show');
        this.main.innerHTML = '';
        this.triggerBtn.focus();
      }
    }, {
      key: 'documentClose',
      value: function documentClose(event) {
        if (!this.findAncestorByClass(event.target, 'joomla-modal-dialog') && event.target !== this.triggerBtn) {
          this.close();
        }
      }
    }, {
      key: 'keyPress',
      value: function keyPress(e) {
        // ESC key
        if (e.keyCode === KEYCODE.ESC) {
          this.close();
        }
        // TAB key
        if (e.keyCode === KEYCODE.TAB) {
          // this.handleTabEvent(e);
          // Get the index of the current active element within the modal
          var focusedIndex = this.focusableElements.indexOf(document.activeElement);
          // Handle TAB event if need to skip
          // If first element is focused and shift key is in use
          if (e.shiftKey && (focusedIndex === 0 || focusedIndex === -1)) {
            // Focus last item within modal
            this.focusableElements[this.focusableElements.length - 1].focus();
            e.preventDefault();
          }
          // If last element is focused and shift key is not in use
          if (!e.shiftKey && focusedIndex === this.focusableElements.length - 1) {
            // Focus first item within modal
            this.focusableElements[0].focus();
            e.preventDefault();
          }
        }
      }
    }, {
      key: 'adjustDimensions',
      value: function adjustDimensions() {
        // Legacy code
        // Height
        var modalHeight = this.offsetHeight;
        modalHeight += parseInt(window.getComputedStyle(this).getPropertyValue('margin-top'), 10);
        modalHeight += parseInt(window.getComputedStyle(this).getPropertyValue('margin-bottom'), 10);

        var bodyHeight = this.body.getBoundingClientRect.height;
        var bodyHeightOuter = this.body.offsetHeight;
        bodyHeightOuter += parseInt(window.getComputedStyle(this.body).getPropertyValue('margin-top'), 10);
        bodyHeightOuter += parseInt(window.getComputedStyle(this.body).getPropertyValue('margin-bottom'), 10);

        var headerHeight = this.header.offsetHeight;
        headerHeight += parseInt(window.getComputedStyle(this.header).getPropertyValue('margin-top'), 10);
        headerHeight += parseInt(window.getComputedStyle(this.header).getPropertyValue('margin-bottom'), 10);

        var footerHeight = this.footer.offsetHeight;
        footerHeight += parseInt(window.getComputedStyle(this.footer).getPropertyValue('margin-top'), 10);
        footerHeight += parseInt(window.getComputedStyle(this.footer).getPropertyValue('margin-bottom'), 10);

        var padding = this.offsetTop;
        var maxModalHeight = window.height - padding * 2;
        var modalBodyPadding = bodyHeightOuter - bodyHeight;
        var maxModalBodyHeight = maxModalHeight - (headerHeight + footerHeight + modalBodyPadding);

        if (this.iframeEl) {
          var iframeHeight = this.iframeEl.getBoundingClientRect().height;

          if (iframeHeight > maxModalBodyHeight) {
            this.container.style.maxHeight = maxModalBodyHeight;
            this.container.style.overflowY = 'auto';
            this.iframeEl.style.maxHeight = maxModalBodyHeight - modalBodyPadding;
          }
        } else if (modalHeight > maxModalHeight) {
          this.container.style.maxHeight = maxModalBodyHeight;
          this.container.style.overflowY = 'auto';
        }
      }

      /* eslint-disable */

    }, {
      key: 'findAncestorByClass',
      value: function findAncestorByClass(el, className) {
        while ((el = el.parentElement) && !el.classList.contains(className)) {}
        return el;
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {
        return ['width', 'height', 'innerWidth', 'innerHeight', 'iframe'];
      }
    }]);

    return _class;
  }(HTMLElement));
})();

},{}]},{},[1]);
