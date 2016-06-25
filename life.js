(function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//yastatic.net/jquery/2.2.3/jquery.min.js';
    document.body.appendChild(script);
})();

(function (method) {
    function defer(method) {
        if (window.jQuery) {
            method(window.jQuery);
        } else {
            setTimeout(function () {
                defer(method)
            }, 50);
        }
    }
    defer(method);
})(function($) {
    var $window = $(window),
        interval = 1000,
        dotSize = 10,
        $field = $('<div id="life-field"></div>'),
        $dot = $('<div class="dot"></div>'),
        fieldCss = {
            'position': 'fixed',
            'background': 'lightblue',
            'opacity': 0.7,
            'z-index': '1000'
        },
        dotCss = {
            'position': 'absolute',
            'background': 'orangered',
            'border-radius': (dotSize / 2) + 'px',
            'width': dotSize + 'px',
            'height': dotSize + 'px'
        },
        sizePx = Math.min($window.height(), $window.width()),
        size = Math.floor(sizePx / dotSize),
        matrix = [],
        dotMatrix = [];

    sizePx = size * dotSize;

    (function () { // inject CSS
        $field.css(fieldCss);
        $dot.css(dotCss);
        $('head').append($(
            '<style type="text/css">' +
            '#life-field { ' + $field.attr('style') + '}' +
            '#life-field .dot { ' + $dot.attr('style') + '}' +
            '</style>'
        ));
        $field.removeAttr('style');
        $dot.removeAttr('style');
    })();

    (function () { // inject field
        $field.css({
            'width': sizePx + 'px',
            'height': sizePx + 'px',
            'top': Math.floor(($window.height() - sizePx) / 2) + 'px',
            'left': Math.floor(($window.width() - sizePx) / 2) + 'px'
        });
        $('body').append($field);
        console.log('append');
    })();

    (function () { // inject dots
        var $theDot;
        for (var i = 0; i < size; i++) {
            dotMatrix[i] = [];
            for (var j = 0; j < size; j++) {
                $theDot = $dot.clone();
                $field.append($theDot);
                $theDot.css({'top': i * dotSize, 'left': j * dotSize});
                dotMatrix[i][j] = $theDot;
            }
        }
    })();

    (function () { // fill random matrix
        for (var i = 0; i < size; i++) {
            matrix[i] = [];
            for (var j = 0; j < size; j++) {
                matrix[i][j] = Math.round(Math.random());
            }
        }
    })();

    function display() {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (matrix[i][j]) {
                    dotMatrix[i][j].show();
                } else {
                    dotMatrix[i][j].hide();
                }
            }
        }
    }

    function neighboursCount(w, i, j) {
        var count = 0;
        for (var h = i - 1; h <= i + 1; h++) {
            if (h < 0 || h >= w.length) {
                continue;
            }
            for (var k = j - 1; k <= j + 1; k++) {
                if (k < 0 || k >= w[h].length) {
                    continue;
                }
                if (h == i && k == j) {
                    continue;
                }
                count += w[h][k];
            }
        }
        return count;
    }

    function updateLifeMatrix() {
        var w = $.extend(true, [], matrix);
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var a = neighboursCount(matrix, i, j);
                if (a == 3) {
                    w[i][j] = 1;
                }
                if (a > 3 || a < 2) {
                    w[i][j] = 0;
                }
            }
        }
        matrix = w;
    }

    display();

    window.lifeInterval = setInterval(function () {
        updateLifeMatrix();
        display();
    }, interval);

    $field.click(function () { clearInterval(window.lifeInterval); });
});