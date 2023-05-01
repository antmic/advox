define([
        'jquery'
    ], function favouriteBtn($) {
        return function (config, element) {
            const defaultText = 'Mark as Favourite'
            const markedText = 'Already in Favourites'
            const className = 'fav-marked'

            console.log(config.btn)
            console.log(config.wrapper)

            $(function () {
                let data = localStorage.getItem(config.wrapper);
                if (data !== null) {
                    $(config.btn).addClass(className);
                    $(config.btn).find('span').text(markedText);
                }
            });
            $(config.btn).on('click', function () {
                console.log('click',  config.btn)

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
