define([
    'jquery'
], function changeTextSwatch($) {
    return function (config, element) {
        $(function () {
            const num = Number($('#limiter').find('[selected]').val());
            let counter = 0;
            $(document).on('swatch.initialized', function () {
                counter++;
                if (counter === num) {
                    const swatchWrapper = $(element).find('.swatch-option.text');
                    for (let i = 0; i < swatchWrapper.length; i++) {
                        const swatchText = $(swatchWrapper[i]).text();
                        $(swatchWrapper[i]).text('Option: ' + swatchText)
                    }
                }
            });
        });
    }
});
