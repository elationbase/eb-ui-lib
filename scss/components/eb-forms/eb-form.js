/* globals window, jQuery */
// Depends on jQuery validate

// JS behavior for input labels //
// Only used on mobile at the time
(function ($) {
  var InputActionHandler = {
    hasContent: function ($el) {
      return $el.val() !== '';
    },
    toggleContentClass: function ($el) {
      if (this.hasContent($el)) {
        $el.closest('.field').addClass('field--content');
      } else {
        $el.closest('.field').removeClass('field--content');
      }
    },
    init: function ($inputs) {
      $inputs.each(function (i, input) {
        var $input = $(input);
        InputActionHandler.toggleContentClass($input);
        $input.off('focus.actionHandler').on('focus.actionHandler', function () {
          $(this).closest('.field').addClass('field--focus');
        });
        $input.off('blur.actionHandler').on('blur.actionHandler', function () {
          $(this).closest('.field').removeClass('field--focus');
          InputActionHandler.toggleContentClass($input);
        });
      });
    }
  };

  $(function () {
    InputActionHandler.init($('.field__input'));
  });

  $.subscribe('form.rebind', function (_, data) {
    if (data && data.formEl) {
      InputActionHandler.init($(data.formEl).find('.field__input'));
    } else {
      InputActionHandler.init($('.field__input'));
    }
  });
}(jQuery));

// Form Validation //
// TODO : module should support multiple forms per page.
// window.chewy.FormValidator should be an array.
(function ($) {
  var helpers = {
    labelMessage: function (fallbackmessage) {
      return function (param, input) {
        var $label = $("label[for='" + input.id + "']");
        if ($label && $label.text().length) {
          return $label.text().replace(':', '').trim() + ' is required';
        }
        return fallbackmessage;
      };
    },
    normalizeCcNumber: function (ccNumber) {
      if (ccNumber && ccNumber.length) {
        return ccNumber.replace(/\D/g, '');
      }

      return '';
    },
    isValidCcNumber: function (ccNumber) {
      ccNumber = helpers.normalizeCcNumber(ccNumber);
      return /^(3\d{14}|[2456]\d{15})$/g.test(ccNumber);
    },
    isAllDigits: function (value) {
      return /^\d+$/g.test(value);
    },
    // Returns matches for not Latin-1 or Latin-supplement
    getNonLatinCharsMatches: function (value) {
      var re = /[^\x00-\xFF]/g; // eslint-disable-line no-control-regex
      var hasBadChars = false;
      var result;
      var resultSet = {};
      var badChars = [];

      do {
        result = re.exec(value);
        if (result) {
          hasBadChars = true;
          resultSet[result[0]] = true;
        }
      } while (result);

      if (hasBadChars) {
        $.each(resultSet, function (key) {
          badChars.push(key);
        });
        return badChars;
      }

      return null;
    }
  };
  // Common rules and messages
  var commonOpts = {
    rules: {
      requiredField: {
        required: true
      },
      fullName: {
        required: true,
        maxlength: 35
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },
      passwordVerify: {
        required: true,
        equalTo: '.field__input--pw'
      },
      billingPhone: {
        required: true,
        maxlength: 15,
        isAddressPart: true
      },
      phone: {
        required: true,
        isAddressPart: true
      },
      // TODO: Merge addressFullName and fullName once we restrict fullName characters
      addressFullName: {
        required: true,
        maxlength: 35,
        isAddressPart: true
      },
      address1: {
        required: true,
        maxlength: 35,
        isAddressPart: true
      },
      address2: {
        isAddressPart: true,
        maxlength: 35
      },
      shippingAddress1: {
        required: true,
        isAddressPart: true,
        maxlength: 35
      },
      shippingAddress2: {
        isAddressPart: true,
        maxlength: 35
      },
      billingAddress1: {
        required: true,
        isAddressPart: true,
        maxlength: 35
      },
      billingAddress2: {
        isAddressPart: true,
        maxlength: 35
      },
      city: {
        required: true,
        isAddressPart: true,
        minlength: 3,
        maxlength: 35
      },
      state: {
        required: true
      },
      postcode: {
        required: true,
        isZip: true
      },
      ccNumber: {
        required: true,
        isCreditCard: true
      },
      ccExpiryMonth: {
        required: true,
        isCcExpiry: true
      },
      ccExpiryYear: {
        required: true,
        isCcExpiry: true
      },
      cardholderName: {
        required: true,
        isCardholderName: true,
        maxlength: 50
      }
    },
    messages: {
      fullName: {
        required: 'Full name is required',
        maxlength: $.validator.format('Full name must be {0} characters or less')
      },
      addressFullName: {
        required: 'Full name is required',
        maxlength: $.validator.format('Full name must be {0} characters or less')
      },
      email: {
        required: 'Email address is required',
        email: 'Enter a valid email address e.g. yourname@aol.com.'
      },
      password: {
        required: helpers.labelMessage('Password is required'),
        minlength: 'Password must be at least 6 characters long'
      },
      passwordVerify: {
        required: 'Re-enter your password',
        equalTo: 'Passwords must match'
      },
      address1: {
        required: helpers.labelMessage('Address is required'),
        minlength: $.validator.format('Address Line 1 must be at least {0} characters long'),
        maxlength: $.validator.format('Address Line 1 must be {0} characters or less')
      },
      address2: {
        maxlength: $.validator.format('Address line 2 must be {0} characters or less')
      },
      shippingAddress1: {
        required: 'Shipping street address is required',
        minlength: $.validator.format('Shipping address line 1 must be at least {0} characters long'),
        maxlength: $.validator.format('Shipping address line 1 must be {0} characters or less')
      },
      shippingAddress2: {
        maxlength: $.validator.format('Shipping address line 2 must be {0} characters or less')
      },
      billingAddress1: {
        required: 'Billing street address is required',
        minlength: $.validator.format('Billing address line 1 must be at least {0} characters long'),
        maxlength: $.validator.format('Billing address line 1 must be {0} characters or less')
      },
      billingAddress2: {
        maxlength: $.validator.format('Billing address line 2 must be {0} characters or less')
      },
      city: {
        required: 'City is required',
        minlength: $.validator.format('City must be at least {0} characters long'),
        maxlength: $.validator.format('City must be {0} characters or less')
      },
      state: {
        required: 'State is required'
      },
      postcode: {
        required: 'ZIP code is required',
        number: 'Enter a valid ZIP code'
      },
      billingPhone: {
        required: 'Phone number is required',
        maxlength: $.validator.format('Phone number must be {0} characters or less')
      },
      phone: {
        required: 'Phone number is required'
      },
      ccNumber: {
        required: 'Credit card number is required'
      },
      ccExpiryMonth: {
        required: 'Credit card expiration month is required'
      },
      ccExpiryYear: {
        required: 'Credit card expiration year is required'
      },
      cardholderName: {
        required: 'Cardholder\'s name is required',
        maxlength: $.validator.format('Cardholder\'s name must be {0} characters or less')
      },
      reenterCC: {
        required: 'Re-enter your credit card number'
      }
    }
  };

  var validate = function ($formEl, options) {
    $formEl.validate({
      debug: false,
      ignore: '.field__input--novalidation :hidden',
      focusCleanup: false,
      onkeyup: false,
      onsubmit: false,
      onfocusout: function (element) {
        $(element).valid();
      },
      rules: options.rules,
      messages: options.messages,
      errorClass: 'field__message',
      errorElement: 'p',
      errorPlacement: function (error, element) {
        var existingMsg;
        if ($(element).attr('id').indexOf('expiration') >= 0) {
          existingMsg = $(element).closest('.field').find('.field__message');
          existingMsg.remove();
        }
        element.closest('.field').append(error);
      },
      highlight: function (element) {
        var $element = $(element);
        var $field = $element.closest('.field');

        // server-side validation classes
        $field.find('.field__message--submit').remove();
        $element.removeClass('field__input--error');

        $field.addClass('field--error');
      },
      unhighlight: function (element) {
        var $element = $(element);
        var $field = $element.closest('.field');

        // server-side validation classes
        $field.find('.field__message--submit').remove();
        $element.removeClass('field__input--error');

        $field.removeClass('field--error');
      }
    });
  };

  $.validator.addMethod('isAddressPart', function (value, element) {
    var nonLatinChars;
    if (this.optional(element)) {
      return true;
    }

    nonLatinChars = helpers.getNonLatinCharsMatches(value);
    if (nonLatinChars) {
      $(element).data('invalid-chars', nonLatinChars);
      return false;
    }
    return true;
  },
    function (value, element) {
      var badChars = $(element).data('invalid-chars');

      if (badChars) {
        return $.validator.format('Remove invalid characters : ' + badChars);
      }

      return 'Field contains characters we do not accept. Remove special characters';
    }
  );

  $.validator.addMethod('isCreditCard', function (value, element) {
    return this.optional(element) || helpers.isValidCcNumber(value);
  }, 'Enter a valid credit card number');

  $.validator.addMethod('isCcExpiry', function (value, element) {
    var $input = $(element);
    var now = new Date();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var $monthInput;
    var monthInputVal;
    var $yearInput;
    var yearInputVal;
    var isValid;

    if (this.optional(element)) {
      return true;
    }

    if ($input.attr('id').indexOf('Month') >= 0) {
      $monthInput = $input;
      $yearInput = $('#' + $input.attr('id').replace('.', '\\.').replace('Month', 'Year'));
    } else {
      $yearInput = $input;
      $monthInput = $('#' + $input.attr('id').replace('.', '\\.').replace('Year', 'Month'));
    }

    monthInputVal = $monthInput.val() < 10 ? '0' + $monthInput.val().toString() : $monthInput.val().toString();
    yearInputVal = $yearInput.val().toString();

    month = month < 10 ? '0' + month.toString() : month.toString();
    isValid = (yearInputVal + monthInputVal) >= (year.toString() + month);
    if (isValid) {
      // need to do this manually because a Month change could make an invalid year expiry valid.
      window.chewy.FormValidator.utils.clearError($input);
    }

    return isValid;
  }, 'Credit card expiration date cannot be in the past');

  $.validator.addMethod('isCardholderName', function (value, element) {
    return this.optional(element) || !helpers.isAllDigits(value);
  }, 'Enter a valid cardholder name');

  $.validator.addMethod('isZip', function (value, element) {
    var regex = /^(\d{5}(?:-\d{4})?)$/g;
    return this.optional(element) || regex.test(value);
  }, 'Enter a valid ZIP code');

  // Override email validator
  $.validator.addMethod('email', function (value, element) {
    // We further restrict the email validator to not allow top level domains.
    var simpleRestrictedEmail = /^[^@]*@[\S]+\.[^.\s]{2,}$/;

    // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    // Retrieved 2014-01-14
    // If you have a problem with this implementation, report a bug against the above spec
    // Or use custom methods to implement your own email validation
    return this.optional(element) || (simpleRestrictedEmail.test(value) && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value));
  });

  window.chewy = window.chewy || {};
  window.chewy.FormValidator = {
    validate: validate,
    commonOpts: commonOpts,
    utils: {
      clearError: function ($input) {
        var $field = $input.closest('.field');
        $input.removeClass('field__input--error');
        $field.removeClass('field--error');
        $field.find('.field__message').remove();
      }
    }
  };

  $(function () {
    $.publish('validation.ready');
  });
}(jQuery));
