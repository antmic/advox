define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data'
], function ($, getTotalsAction, customerData) {
    $(document).ready(function () {
        document.addEventListener("input", (e) => {
            const form = $('form#form-validate');
            if (/^[0-9]+$/.test(e.data)) {
                $.ajax({
                    url: form.attr('action'),
                    data: form.serialize(),
                    showLoader: true,
                    success: function (res) {
                        const parsedResponse = $.parseHTML(res);
                        const result = $(parsedResponse).find("#form-validate");
                        const sections = ['cart'];
                        $("#form-validate").replaceWith(result);
                        customerData.reload(sections, true);
                        const deferred = $.Deferred();
                        getTotalsAction([], deferred);
                    },
                    error: function (xhr, status, error) {
                        const err = eval("(" + xhr.responseText + ")");
                        console.log(err.Message);
                    }
                });
            }
        });
    });
});
