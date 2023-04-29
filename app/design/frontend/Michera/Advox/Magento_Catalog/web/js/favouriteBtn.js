define([
        'jquery'
    ], function favouriteBtn($) {
        return function (config, element) {
            const defaultText = 'Mark as Favourite'
            const markedText = 'Already in Favourites'
            const className = 'fav-marked'
            $(function () {
                let data = localStorage.getItem(className);
                if (data !== null) {
                    $(element).addClass(className);
                }
            });
            $(element).on('click', function () {
                if (!$(this).hasClass(className)) {
                    $(this).addClass(className);
                    $(this).find('span').text(markedText);
                    localStorage.setItem(className, className);
                } else {
                    $(this).removeClass(className);
                    $(this).find('span').text(defaultText);
                    localStorage.removeItem(className);
                }
            });
        }
    }
)
