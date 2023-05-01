define([
        'jquery', 'mage/translate'
    ], function favouriteBtn($, $t) {
        return function (config, element) {
            const defaultText = $t('Mark as Favourite')
            const markedText = $t('Already in Favourites')
            const className = 'fav-marked'
            $(function () {
                let data = localStorage.getItem(config.wrapper);
                if (data !== null) {
                    $(config.btn).addClass(className);
                    $(config.btn).find('span').text(markedText);
                }
            });
            $(config.btn).on('click', function () {
                if (!$(this).hasClass(className)) {
                    $(this).addClass(className);
                    $(this).find('span').text(markedText);
                    localStorage.setItem(config.wrapper, className);
                } else {
                    $(this).removeClass(className);
                    $(this).find('span').text(defaultText);
                    localStorage.removeItem(config.wrapper);
                }
            });
        }
    }
)
