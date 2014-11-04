var diff1, diff2;

(function() {
    /**
     * Javascript implementation of:
     * "A Linear-Time Algorithm That Locates Local Extrema
     * of a Function of One Variable From Interval Measurement
     * Results" - Karen Villaverde, Vladik Kreinovich
     * (Interval Computations 01/1993; 1993(4))
     *
     * Takes an object or array with numbers and returns an object
     * with two lists of indices: 'minlist' with indices of values
     * that are local minima and 'maxlist' with indices of values that
     * are local maxima.
     * Takes numbers as first parameter and an accuracy > 0 (epsilon)
     * as second parameter. The accuracy has to be chosen depending
     * on the fluctuations in the data: smaller values mean greater
     * reliability in finding extrema but slower computation.
     * Epsilon defaults to 0.1 if omitted but don't rely on that!
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param eps
     * @returns {minlist: Array, maxlist: Array}
     */
    diff1 = function(values, eps) {
        // declare local vars
        var x, y;
        // define x & y enumerated arrays
        var enumerate = function(obj) {
            var arr = [];
            var keys = Object.keys(obj);
            for (var k = 0; k < keys.length; k++) {
                arr[k] = obj[keys[k]];
            }
            return arr;
        }
        y = enumerate(values);
        x = Object.keys(values).map(Math.floor);
        // call diff2 version
        var res = diff2(x, y, eps);
        res.minlist = res.minlist.map(function(val) {
            return Math.floor((val[1] + val[0]) / 2);
        });
        res.maxlist = res.maxlist.map(function(val) {
            return Math.floor((val[1] + val[0]) / 2);
        });

        return {minlist: res.minlist, maxlist: res.maxlist};
    }

    /**
     * Alternative version that takes vectors [x] and [y] instead of
     * [values] as input and returns intervals that contain local minima
     * and local maxima.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param x
     * @param y
     * @param eps
     * @returns {minlist: Array, maxlist: Array}
     */
    diff2 = function(x, y, eps) {
        // declare local vars
        var n, s, m, M, maxlist, minlist, i, j;
        // define x & y enumerated arrays
        var enumerate = function(obj) {
            var arr = [];
            var keys = Object.keys(obj);
            for (var k = 0; k < keys.length; k++) {
                arr[k] = obj[keys[k]];
            }
            return arr;
        }
        y = enumerate(y);
        x = enumerate(x);
        // set initial values
        n = y.length;
        s = 0;
        m = y[0];
        M = y[0];
        maxlist = [];
        minlist = [];
        i = 1;
        if (typeof eps == "undefined") {
            eps = 0.1;
        }
        // the algorithm
        while (i < n) {
            if (s == 0) {
                if (!(M - eps <= y[i] && y[i] <= m + eps)) {
                    if (M - eps > y[i]) {
                        s = -1;
                    }
                    if (m + eps < y[i]) {
                        s = 1;
                    }
                }
                M = Math.max(M, y[i]);
                m = Math.min(m, y[i]);
            }
            else {
                if (s == 1) {
                    if (M - eps <= y[i]) {
                        M = Math.max(M, y[i]);
                    }
                    else {
                        j = i - 1;
                        while(y[j] >= M - eps) {
                            j--;
                        }
                        maxlist.push( [x[j], x[i]] );
                        s = -1;
                        m = y[i];
                    }
                }
                else {
                    if(s == -1) {
                        if(m + eps >= y[i]) {
                            m = Math.min(m, y[i]);
                        }
                        else {
                            j = i - 1;
                            while(y[j] <= m + eps) {
                                j--;
                            }
                            minlist.push( [x[j], x[i]] );
                            s = 1;
                            M = y[i];
                        }
                    }
                }
            }
            i++;
        }

        return {minlist: minlist, maxlist: maxlist};
    }
}());