define([
    'jquery', 'Magento_Checkout/js/action/get-totals', 'Magento_Customer/js/customer-data'
], function cartAutoUpdate($, getTotalsAction, customerData) {
    return function (config, element) {

        console.log('test4')

        let activeElementId = localStorage.getItem('activeElementId');
        if (activeElementId) {
            let activeElement = document.getElementById(activeElementId);
            activeElement.focus();
            let tmpStr = $(activeElement).val();
            $(activeElement).val('');
            $(activeElement).val(tmpStr);
            localStorage.removeItem('activeElementId');
        }

        const inputElement = document.querySelector(config.cartInput);
        let inputType;
        let inputData;
        let pasteData;

        inputElement.addEventListener('input', (e) => updateCart(e))
        inputElement.addEventListener('paste', (e) => checkPaste(e))

        function checkPaste(e) {
            let clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
            pasteData = clipboardData.getData('text');
            if (!/[0-9]/.test(pasteData)) {
                e.preventDefault();
                return false;
            }
        }

        function validateAllInputs() {
            let allInputs = [];
            for (let i = 0; i < $('input.qty').length; i++) {
                allInputs.push($('input.qty')[i].value);
            }
            return allInputs.every(Number);
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
