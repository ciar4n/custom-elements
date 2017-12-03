(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var JoomlaSwitcherElement = function (_HTMLElement) {
  _inherits(JoomlaSwitcherElement, _HTMLElement);

  _createClass(JoomlaSwitcherElement, [{
    key: 'type',
    get: function get() {
      return this.getAttribute('type');
    },
    set: function set(value) {
      return this.setAttribute('type', value);
    }
  }, {
    key: 'offText',
    get: function get() {
      return this.getAttribute('offText') || 'Off';
    }
  }, {
    key: 'onText',
    get: function get() {
      return this.getAttribute('onText') || 'On';
    }
  }], [{
    key: 'observedAttributes',

    /* Attributes to monitor */
    get: function get() {
      return ['type', 'offText', 'onText'];
    }
  }]);

  function JoomlaSwitcherElement() {
    _classCallCheck(this, JoomlaSwitcherElement);

    var _this = _possibleConstructorReturn(this, (JoomlaSwitcherElement.__proto__ || Object.getPrototypeOf(JoomlaSwitcherElement)).call(this));

    _this.inputs = [];
    _this.spans = [];
    _this.inputsContainer = '';
    _this.spansContainer = '';
    _this.newActive = '';
    return _this;
  }

  /* Lifecycle, element appended to the DOM */

  _createClass(JoomlaSwitcherElement, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      var _this2 = this;

      this.inputs = [].slice.call(this.querySelectorAll('input'));

      if (this.inputs.length !== 2 || this.inputs[0].type !== 'radio') {
        throw new Error('`Joomla-switcher` requires two inputs type="checkbox"');
      }

      // Create the markup
      this.createMarkup.bind(this)();

      this.inputsContainer = this.firstElementChild;
      this.spansContainer = this.lastElementChild;

      if (this.inputs[1].checked) {
        this.inputs[1].parentNode.classList.add('active');
        this.spans[1].classList.add('active');
      } else {
        this.spans[0].classList.add('active');
      }

      this.inputs.forEach(function (switchEl, index) {
        // Remove the tab focus from the inputs
        switchEl.setAttribute('tabindex', '-1');

        // Aria-labelledby ONLY in the first input
        switchEl.setAttribute('role', 'switch');
        switchEl.setAttribute('aria-labelledby', _this2.spans[index].innerHTML);

        // Add the active class on click
        switchEl.addEventListener('click', _this2.toggle.bind(_this2));
      });

      this.inputsContainer.addEventListener('keydown', this.keyEvents.bind(this));
    }

    /* Lifecycle, element removed from the DOM */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      this.removeEventListener('joomla.switcher.toggle', this.toggle, true);
      this.removeEventListener('click', this.switch, true);
      this.removeEventListener('keydown', this.keydown, true);
    }

    /* Method to dispatch events */

  }, {
    key: 'dispatchCustomEvent',
    value: function dispatchCustomEvent(eventName) {
      var OriginalCustomEvent = new CustomEvent(eventName, { bubbles: true, cancelable: true });
      OriginalCustomEvent.relatedTarget = this;
      this.dispatchEvent(OriginalCustomEvent);
      this.removeEventListener(eventName, this);
    }

    /** Method to build the switch */

  }, {
    key: 'createMarkup',
    value: function createMarkup() {
      var checked = 0;

      // Create the first 'span' wrapper
      var spanFirst = document.createElement('span');
      spanFirst.classList.add('switcher');
      spanFirst.setAttribute('tabindex', 0);

      // If no type has been defined, the default as "success"
      if (!this.type) {
        this.setAttribute('type', 'success');
      }

      var switchEl = document.createElement('span');
      switchEl.classList.add('switch');

      this.inputs.forEach(function (input, index) {
        if (input.checked) {
          input.setAttribute('aria-checked', true);
        }

        spanFirst.appendChild(input);

        if (index === 1 && input.checked) {
          checked = 1;
        }
      });

      spanFirst.appendChild(switchEl);

      // Create the second 'span' wrapper
      var spanSecond = document.createElement('span');
      spanSecond.classList.add('switcher-labels');

      var labelFirst = document.createElement('span');
      labelFirst.classList.add('switcher-label-0');
      labelFirst.innerText = this.offText;

      var labelSecond = document.createElement('span');
      labelSecond.classList.add('switcher-label-1');
      labelSecond.innerText = this.onText;

      if (checked === 0) {
        labelFirst.classList.add('active');
      } else {
        labelSecond.classList.add('active');
      }

      this.spans.push(labelFirst);
      this.spans.push(labelSecond);
      spanSecond.appendChild(labelFirst);
      spanSecond.appendChild(labelSecond);

      // Append everything back to the main element
      this.appendChild(spanFirst);
      this.appendChild(spanSecond);
    }

    /** Method to toggle the switch */

  }, {
    key: 'switch',
    value: function _switch() {
      this.spans.forEach(function (span) {
        span.classList.remove('active');
      });

      if (this.inputsContainer.classList.contains('active')) {
        this.inputsContainer.classList.remove('active');
      } else {
        this.inputsContainer.classList.add('active');
      }

      if (!this.inputs[this.newActive].classList.contains('active')) {
        this.inputs.forEach(function (input) {
          input.classList.remove('active');
          input.removeAttribute('checked');
          input.removeAttribute('aria-checked');
        });
        this.inputs[this.newActive].classList.add('active');
        this.inputs[this.newActive].setAttribute('aria-checked', true);

        this.dispatchCustomEvent('joomla.switcher.on');
      } else {
        this.inputs.forEach(function (input) {
          input.classList.remove('active');
          input.removeAttribute('checked');
          input.setAttribute('aria-checked', false);
        });

        this.dispatchCustomEvent('joomla.switcher.off');
      }

      this.inputs[this.newActive].setAttribute('checked', '');
      this.inputs[this.newActive].setAttribute('aria-checked', true);
      this.spans[this.newActive].classList.add('active');
    }

    /** Method to toggle the switch */

  }, {
    key: 'toggle',
    value: function toggle() {
      this.newActive = this.inputs[1].classList.contains('active') ? 0 : 1;

      this.switch.bind(this)();
    }
  }, {
    key: 'keyEvents',
    value: function keyEvents(event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        this.newActive = this.inputs[1].classList.contains('active') ? 0 : 1;

        this.switch.bind(this)();
      }
    }
  }]);

  return JoomlaSwitcherElement;
}(HTMLElement);

customElements.define('joomla-switcher', JoomlaSwitcherElement);

},{}]},{},[1]);
