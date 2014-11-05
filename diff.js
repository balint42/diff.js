var diff, integral, extrema, extremaXY;

(function() {
    /**
     * Calculate differential of a vector.
     *
     * Takes an object or array X with m numbers and returns an array
     * Y with m-1 numbers that constitutes the differential:
     * Y = [X(2)-X(1) X(3)-X(2) ... X(m)-X(m-1)]
     *
     * If as second parameter a number n is given, the returned array
     * Y will be the n-th differential, thus above step applied n-times.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param n
     * @returns Array
     */
    diff = function(values, n) {
        // recursive calls to get n-th differential
        if(n > 1) {
            values = diff(values, n-1);
        }
        // loop through 1,...,m-1 entries of values to get diff
        var keys = Object.keys(values);
        for (var k = 0; k < keys.length-1; k++) {
            values[k] = values[keys[k+1]]-values[keys[k]];
        }
        values.pop(); // last element is old value, delete it

        return values;
    }

    /**
     * Calculate one integral of a vector assuming that the variable
     * constant is zero.
     *
     * Takes an object or array Y with m numbers and returns an array
     * X with m numbers that constitutes the differential:
     * [ ... -Y(m)-Y(m-1)-Y(m-2)  -Y(m)-Y(m-1)  -Y(m)]
     *
     * If as second parameter a number n is given, the returned array
     * X will be the n-th integral, thus above step applied n-times.
     *
     * NOTE: the integral cannot determine the original set of values
     * before "diff" was applied, thus "integral(diff(values)) != values"
     * due to the nature of integration and differentiation. But due to
     * the same nature the following always applies:
     * "integral(diff(values)) + values(m) = values(1:m-1)"
     * In other words: to reverse a "diff", apply an integral and add
     * the last original value "values(m)" to all elements of the resulting
     * array. Then append the last original value and you have the exact
     * original "values" array.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param n
     * @param c
     * @returns Array
     */
    integral = function(values, n) {
        // recursive calls to get n-th integral
        if(n > 1) {
            values = integral(values, n-1);
        }
        // loop through m,...,1 entries of values to get integral
        var keys = Object.keys(values);
        values[keys.length-1] = -values[keys.length-1];
        for (var k = keys.length-2; k >= 0; k--) {
            values[k] = -values[keys[k]]+values[keys[k+1]];
        }

        return values;
    }

    /**
     * Find local maxima and minima in a list of values.
     *
     * Javascript implementation of:
     * "A Linear-Time Algorithm That Locates Local Extrema
     * of a Function of One Variable From Interval Measurement
     * Results" - Karen Villaverde, Vladik Kreinovich
     * (Interval Computations 01/1993; 1993(4))
     *
     * Takes an object or array with numbers and returns an object
     * with two lists of indices: 'minlist' with indices of values
     * that are local minima and 'maxlist' with indices of values that
     * are local maxima. Indices can be of any type.
     * Takes numbers as first parameter and an accuracy > 0 (epsilon)
     * as second parameter. The accuracy has to be chosen depending
     * on the fluctuations in the data: smaller values mean greater
     * reliability in finding extrema but also greater chance of
     * confusing noise with a local minimum or maximum.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param eps
     * @returns {minlist: Array, maxlist: Array}
     */
    extrema = function(values, eps) {
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
        x = Object.keys(y).map(Math.floor);
        // call diff2 version
        var res = extremaXY(x, y, eps);
        res.minlist = res.minlist.map(function(val) {
            var index = Math.floor((val[1] + val[0]) / 2);
            return Object.keys(values)[index];
        });
        res.maxlist = res.maxlist.map(function(val) {
            var index = Math.floor((val[1] + val[0]) / 2);
            return Object.keys(values)[index];
        });

        return {minlist: res.minlist, maxlist: res.maxlist};
    }

    /**
     * Alternative version that takes vectors [x] and [y] instead of
     * [values] as input and returns intervals that contain local minima
     * and local maxima. [x] elements can be of any type.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param x
     * @param y
     * @param eps
     * @returns {minlist: Array, maxlist: Array}
     */
    extremaXY = function(x, y, eps) {
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