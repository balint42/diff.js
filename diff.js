var diff, diffXY, integral, integralXY, extrema, extremaXY;

(function() {
    /**
     * Calculate differences of a vector.
     *
     * Takes an object or array Y with m numbers and returns an array
     * dY with m-1 numbers that constitutes the differences:
     * dY = [Y(2)-Y(1) Y(3)-Y(2) ... Y(m)-Y(m-1)]
     * If Y are function values f(1), f(2), ... with a step size of 1,
     * then dY constitutes the approximate derivative of f. For a different
     * step size use diffXY.
     * NOTE: For a step size other than 1, the differences do NOT constitute
     * the approximate derivative and thus in those cases use diffXY if you
     * want to get the derivative.
     *
     * If as second parameter a number n is given, the returned array
     * dY will be the n-th differential, thus above step applied n-times.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param n
     * @returns Array
     */
    diff = function(values, n) {
        // make y enumerated and define x = 1, 2, 3, ...
        var x, y;
        y = enumerate(values);
        x = Object.keys(y).map(Math.floor);
        // call diffXY version
        return diffXY(x, y, n);
    }

    /**
     * Calculate approximate derivative of a vector Y, assuming
     * that Y=f(X) with given vector X.
     *
     * Takes objects or arrays X and Y with m numbers and returns
     * an array dY with m-1 numbers that constitutes the approximate
     * derivative:
     * dY = [(Y(2)-Y(1))/(X(2)-X(1))  (Y(3)-Y(2)/(X(3)-X(2)) ...
     *       (Y(m)-Y(m-1))/((X(m)-X(m-1))]
     *
     * If as second parameter a number n is given, the returned array
     * dY will be the n-th differential, thus above step applied n-times.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param x
     * @param y
     * @param n
     * @returns Array
     */
    diffXY = function(x, y, n) {
        // recursive calls to get n-th diff
        if(n > 1) {
            y = diffXY(x, y, n-1);
            x.pop();
        }
        // loop through 1,...,m-1 entries of values to get diff
        var keysX = Object.keys(x);
        var keysY = Object.keys(y);
        var len = Math.min(keysX.length-1, keysY.length-1);
        for (var k = 0; k < len; k++) {
            y[k] = (y[keysY[k+1]]-y[keysY[k]]) /
                   (x[keysX[k+1]]-x[keysX[k]]);
        }
        y.pop(); // last element is old value, delete it

        return y;
    }

    /**
     * Calculate reverse differences of a vector.
     *
     * Takes an object or array Y with m numbers and returns an array
     * IY with m numbers that constitutes the reverse differences:
     * [ ... -Y(m)-Y(m-1)-Y(m-2)  -Y(m)-Y(m-1)  -Y(m)]
     * If Y are function values f(1), f(2), ... with a step size of 1,
     * then IY constitutes the approximate integral of f. For a different
     * step size use integralXY.
     *
     * If as second parameter a number n is given, the returned array
     * Y will be the n-th integral, thus above step applied n-times.
     *
     * NOTE: the integral cannot determine the original set of values
     * before "diff" was applied, thus "integral(diff(values)) != values"
     * due to the nature of integration and differentiation. However the
     * shape of the result will be the same, the curve will only be
     * shifted by a constant value. ("translation")
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param values
     * @param n
     * @returns Array
     */
    integral = function(values, n) {
        // make y enumerated and define x = 1, 2, 3, ...
        var x, y;
        y = enumerate(values);
        x = Object.keys(y).map(Math.floor);
        // call integralXY version
        return integralXY(x, y, n);
    }

    /**
     * Calculate approximate integral of a vector, assuming
     * that Y=f(X) with given vector X.
     *
     * Takes an object or array Y with m numbers and returns an array
     * X with m numbers that constitutes the integral:
     * [ ...
     *  -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1)-Y(m-2)*(X(m-1)-X(m-2)-Y(m-3)*(X(m-2)-X(m-3)
     *  -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1)-Y(m-2)*(X(m-1)-X(m-2)
     *  -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1)
     *  -Y(m)*(X(m)-X(m-1))
     * ]
     *
     * If as second parameter a number n is given, the returned array
     * X will be the n-th integral, thus above step applied n-times.
     *
     * NOTE: the integral cannot determine the original set of values
     * before "diff" was applied, thus "integral(diff(values)) != values"
     * due to the nature of integration and differentiation. However the
     * shape of the result will be the same, the curve will only be
     * shifted by a constant value. ("translation")
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     * @param x
     * @param y
     * @param n
     * @returns Array
     */
    integralXY = function(x, y, n) {
        // recursive calls to get n-th diff
        if(n > 1) {
            y = integral(x, y, n-1);
        }
        // loop through m,...,1 entries of values to get integral
        var keysX = Object.keys(x);
        var keysY = Object.keys(y);
        var len = Math.min(keysX.length-1, keysY.length-1);
        // NOTE: below we would need X(len+1) & Y(len+1) but both are missing;
        // thus we assume "X(len+1)-X(len)=X(len)-X(len-1)" and "Y(len+1)=0"
        y[len] = -y[len]*(x[keysX[len]]-x[keysX[len-1]]);
        for (var k = len-1; k >= 0; k--) {
            y[k] = -y[keysY[k]]*(x[keysX[k+1]]-x[keysX[k]])+y[keysY[k+1]];
        }

        return y;
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
        // make y enumerated and define x = 1, 2, 3, ...
        var x, y;
        y = enumerate(values);
        x = Object.keys(y).map(Math.floor);
        // call extremaXY version
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

    // helper to make an array or object an enumerated array
    var enumerate = function(obj) {
        var arr = [];
        var keys = Object.keys(obj);
        for (var k = 0; k < keys.length; k++) {
            arr[k] = obj[keys[k]];
        }
        return arr;
    }
}());