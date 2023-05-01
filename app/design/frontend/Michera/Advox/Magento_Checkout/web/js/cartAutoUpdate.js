define([
    'jquery', 'Magento_Checkout/js/action/get-totals', 'Magento_Customer/js/customer-data'
], function cartAutoUpdate($, getTotalsAction, customerData) {
    return function (config, element) {

        // Restores focus after reload.
        let activeElementId = localStorage.getItem('activeElementId');
        if (activeElementId) {
            let activeElement = document.getElementById(activeElementId);
            activeElement.focus();
            let tmpStr = $(activeElement).val();
            $(activeElement).val('');
            $(activeElement).val(tmpStr);
            localStorage.removeItem('activeElementId');
        }

        // Variables
        const inputElement = document.querySelector(config.cartInput);
        let inputType;
        let inputData;
        let pasteData;

        // Event listeners
        const debouncedUpdateCart = debounce(updateCart);
        inputElement.addEventListener('input', (e) => debouncedUpdateCart(e))
        inputElement.addEventListener('paste', (e) => checkPaste(e))

        // This is a workaround for a bug or "feature" in macOS.
        // Handles macOS specific quick double space changing to a dot -> now it clears the input.
        $(inputElement).on('keydown', (e) => {
            if (e.which === 32) {
                inputElement.value = inputElement.value.replace(/\s/g, '');
                }
            }
        );

        // Validate paste input.
        function checkPaste(e) {
            let clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            pasteData = clipboardData.getData('text');
            if (!/[0-9]/.test(pasteData)) {
                e.preventDefault();
                return false;
            }
        }

        // Validate all inputs to prevent reload if any out-of-focus input is invalid.
        function validateAllInputs() {
            let allInputs = [];
            for (let i = 0; i < $('input.qty').length; i++) {
                allInputs.push($('input.qty')[i].value);
            }
            return allInputs.every(Number);
        }

        function debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        }

        function updateCart(e) {
            activeElementId = document.activeElement.id
            localStorage.setItem('activeElementId', activeElementId)
            const form = $('form#form-validate');
            inputData = e.data;
            inputType = e.inputType;
            if ((/[0-9]/.test(inputData) || /[0-9]/.test(pasteData) || inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') && validateAllInputs()) {
                $.ajax({
                    url: form.attr('action'), data: form.serialize(), showLoader: true, success: function (res) {
                        const parsedResponse = $.parseHTML(res);
                        const result = $(parsedResponse).find("#form-validate");
                        const sections = ['cart'];
                        $("#form-validate").replaceWith(result);
                        customerData.reload(sections, true);
                        const deferred = $.Deferred();
                        getTotalsAction([], deferred);
                    }, error: function (xhr, status, error) {
                        const err = eval("(" + xhr.responseText + ")");
                        console.log(err.Message);
                    }
                });
            }
        }
    }
});
