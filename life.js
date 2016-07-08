(function () {
    if (window.jQuery) {
       return;
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://yastatic.net/jquery/2.2.3/jquery.min.js';
    document.body.appendChild(script);
})();

var LifeMatrix = function(width, height, isCyclic) {
    this.width = width;
    this.height = height;
    this.isCyclic = isCyclic;
    this.matrix = [];
    this.fill(undefined);
};

LifeMatrix.prototype.fill = function (value, arrayToFill) {
    var arr = arrayToFill || this.matrix;
    for (var i = 0; i < this.width; i++) {
        (typeof arr[i] !== 'Array') && (arr[i] = []);
        for (var j = 0; j < this.height; j++) {
            arr[i][j] = typeof value == 'function' ? value(i, j, arr[i][j]) : value;
        }
    }
};

LifeMatrix.prototype.randomize = function () {
    this.fill(function () {
        return Math.round(Math.random());
    });
};

LifeMatrix.prototype.neighboursCount = function (i, j) {
    return (
        (this.get(i-1, j-1) || 0) + (this.get(i-1, j) || 0) + (this.get(i-1, j+1) || 0) +
        (this.get(i,   j-1) || 0) + 0                       + (this.get(i,   j+1) || 0) +
        (this.get(i+1, j-1) || 0) + (this.get(i+1, j) || 0) + (this.get(i+1, j+1) || 0)
    );
};

LifeMatrix.prototype.get = function (i, j) {
    if (this.isCyclic) {
        var ii, jj;
        ii = i % this.width;
        ii = ii < 0 ? ii + this.width : ii;
        jj = j % this.height;
        jj = jj < 0 ? jj + this.height : jj;
        return this.matrix[ii][jj];
    } else {
        return (j < 0 || j >= this.height || i < 0 || i >= this.width) ? undefined : this.matrix[i][j];
    }
};

LifeMatrix.prototype.update = function () {
    var w = [], _this = this;
    this.fill(function (i, j) {
        var a = _this.neighboursCount(i, j);
        if (a == 3) {
            return 1;
        }
        if (a > 3 || a < 2) {
            return 0;
        }
        return _this.matrix[i][j];
    }, w);
    this.matrix = w;
};

var LifeDisplay = function ($, dotSize) {
    this.$ = $;
    this.$window = $(window);
    this.dotSize = dotSize || 10;
    this.$field = $('<div id="life-field"></div>');
    this.$dot = $('<div class="dot"></div>');
    this.fieldCss = {
        'position': 'fixed',
        'background': 'lightblue',
        'opacity': 0.7,
        'z-index': '1000'
    };
    this.dotCss = {
        'position': 'absolute',
        'background': 'orangered',
        'border-radius': (this.dotSize / 2) + 'px',
        'width': this.dotSize + 'px',
        'height': this.dotSize + 'px'
    };
    this.sizeX = Math.floor(this.$window.width() / this.dotSize);
    this.sizeY = Math.floor(this.$window.height() / this.dotSize);
    this.sizeXpx = this.sizeX * this.dotSize;
    this.sizeYpx = this.sizeY * this.dotSize;
    this.dotMatrix = [];

    this.injectCss();
    this.injectField();
    this.injectDots();
};

LifeDisplay.prototype.injectCss = function () {
    this.$field.css(this.fieldCss);
    this.$dot.css(this.dotCss);
    this.$('head').append($(
        '<style type="text/css">' +
        '#life-field { ' + this.$field.attr('style') + '}' +
        '#life-field .dot { ' + this.$dot.attr('style') + '}' +
        '</style>'
    ));
    this.$field.removeAttr('style');
    this.$dot.removeAttr('style');
};

LifeDisplay.prototype.injectField = function () {
    this.$field.css({
        'width': this.sizeXpx + 'px',
        'height': this.sizeYpx + 'px',
        'top': Math.floor((this.$window.height() - this.sizeYpx) / 2) + 'px',
        'left': Math.floor((this.$window.width() - this.sizeXpx) / 2) + 'px'
    });
    this.$('body').append(this.$field);
};

LifeDisplay.prototype.injectDots = function () {
    var $theDot;
    for (var i = 0; i < this.sizeX; i++) {
        this.dotMatrix[i] = [];
        for (var j = 0; j < this.sizeY; j++) {
            $theDot = this.$dot.clone();
            this.$field.append($theDot);
            $theDot.css({'top': j * this.dotSize, 'left': i * this.dotSize});
            this.dotMatrix[i][j] = $theDot;
        }
    }
};

LifeDisplay.prototype.display = function (matrix) {
    var _this = this;
    matrix.forEach(function (cols, i) {
        cols.forEach(function (a, j) {
            var doWhat = a ? 'show' : 'hide';
            _this.dotMatrix[i][j][doWhat]();
        });
    });
};

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
    var interval = 1000,
        ld = new LifeDisplay($, 20),
        lm = new LifeMatrix(ld.sizeX, ld.sizeY, true);

    lm.randomize();
    ld.display(lm.matrix);

    window.lifeInterval = setInterval(function () {
        lm.update();
        ld.display(lm.matrix);
    }, interval);

    $('body').click(function () { clearInterval(window.lifeInterval); });
});