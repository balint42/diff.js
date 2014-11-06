diff.js
=======

Javascript library with functions for differentiation, integration
and for finding local minima and maxima.

`extrema` function
------------------
Find local maxima and minima in a list of values.

This is a Javascript implementation of "A Linear-Time Algorithm That
Locates Local Extrema of a Function of One Variable From Interval
Measurement Results" - Karen Villaverde, Vladik Kreinovich
(Interval Computations 01/1993; 1993(4))

Takes an `object` or `array` with numbers and returns an object with two
lists of indices: `minlist` with indices of values that are local minima
and `maxlist` with indices of values that are local maxima. Indices
can be of any type. Takes numbers as first parameter and an accuracy
`epsilon` > 0 as second parameter. The accuracy has to be chosen depending
on the fluctuations in the data: smaller values mean greater reliability
in finding extrema but also greater chance of confusing noise with a local
minimum or maximum.
Epsilon defaults to 0.1 if omitted but don't rely on that!

Usage
```
// using arrays with with numeric indices
A = extrema([1,2,3,4,3,2,1,0,1,2,3,4,5,6,7], "0.01");
                   ^       ^local min   
                   local max
// using string indices
B = extrema({"a":1,"b":2,"c":3,"d":4,"e":3,"f":2,"g":1,"h":0,"i":1,"j":2,"k":3,"l":4,"m":5,"n":6,"o":7}, "0.01");
                                   ^                       ^local min   
                                   local max
// result
A = { minlist: [ 3 ], maxlist: [ 7 ] }
B = { minlist: [ "d" ], maxlist: [ "h" ] }
```

`extremaXY` function
--------------------
Alternative version that takes vectors `[x]` and `[y]` instead of `[values]`
as input and returns intervals that contain local minima and local maxima.
`[x]` elements can be of any type.

Usage
```
// using arrays with with numeric indices
A = extremaXY([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], [1,2,3,4,3,2,1,0,1,2,3,4,5,6,7], "0.01");
                                                           ^       ^local min   
                                                           local max
// using string indices
B = extremaXY(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"], [1,2,3,4,3,2,1,0,1,2,3,4,5,6,7], "0.01");
                                                                                            ^       ^local min                                                                                                    local max
// result
A = { minlist: [ [2, 4] ], maxlist: [ [6, 8] ] }
B = { minlist: [ ["c", "e"] ], maxlist: [ ["g", "i"] ] }
```

`diff` function
---------------
Calculate differences of a vector.

Takes an object or array `Y` with m numbers and returns an array `dY` with
`m-1` numbers that constitutes the differences:

`dY = [Y(2)-Y(1), Y(3)-Y(2), ... , Y(m)-Y(m-1)]`

If `Y` are function values `f(1), f(2), ...` with a step size of 1,
then `dY` constitutes the approximate derivative of `f`. For a different
step size use `diffXY`.
NOTE: For a step size other than 1, the differences do NOT constitute
the approximate derivative and thus in those cases use `diffXY` if you
want to get the derivative.

If as second parameter a number `n` is given, the returned array
`dY` will be the n-th differential, thus above step applied n-times.

Usage
```
cos1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(Math.cos)];
cos2 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.cos)];
sin1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(Math.sin)];
sin2 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.sin)];
A = diff(sin1);
B = diff(sin2);
// result
A ≈ cos1 // A is the approximate derivative of "sin"
B ≠ cos2 // B is NOT the approximate derivative since step size is not 1!
         // To get the approximate derivative one would have to use diffXY
```

`diffXY` function
---------------
Calculate differences of a vector.

Calculate approximate derivative of a vector `Y`, assuming that `Y=f(X)`
with given vector `X`.

Takes objects or arrays `X` and `Y` with `m` numbers and returns an array `dY`
with `m-1` numbers that constitutes the approximate derivative:

`dY = [(Y(2)-Y(1))/(X(2)-X(1)), (Y(3)-Y(2)/(X(3)-X(2)), ... ,
       (Y(m)-Y(m-1))/((X(m)-X(m-1))]`

If as second parameter a number `n` is given, the returned array
`dY` will be the n-th differential, thus above step applied n-times.

Usage
```
cos = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.cos)];
sin = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.sin)];
A = diffXY([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], sin);
// result
A ≈ cos // A is the approximate derivative of "sin"
```

`integral` function
-------------------
Calculate reverse differences of a vector.

Takes an object or array Y with m numbers and returns an array `IY` with
`m` numbers that constitutes the reverse differences:

`[ ... , -Y(m)-Y(m-1)-Y(m-2), -Y(m)-Y(m-1), -Y(m)]`

If `Y` are function values `f(1), f(2), ...` with a step size of 1, then `IY`
constitutes the approximate integral of `f`. For a different step size use integralXY.

If as second parameter a number `n` is given, the returned array `Y` will be the n-th
integral, thus above step applied n-times.

NOTE: the integral cannot determine the original set of values
before `diff` was applied, thus `integral(diff(values)) != values`
due to the nature of integration and differentiation. However the
shape of the result will be the same, the curve will only be
shifted by a constant value. ("translation")

Usage
```
sin1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(Math.sin)];
sin2 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.sin)];
cos1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(Math.cos)];
cos2 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.cos)];
A = integral(cos1);
B = integral(cos2);
// result
A ≈ sin1 // A is the approximate integral of "cos"
B ≠ sin2 // B is NOT the approximate integral since step size is not 1!
         // To get the approximate integral one would have to use diffXY
```

`integralXY` function
---------------------

Calculate approximate integral of a vector, assuming that `Y=f(X)`
with given vector X.

Takes an object or array Y with m numbers and returns an array `X`
with m numbers that constitutes the integral:

`[ ... ,
   -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1)-Y(m-2)*(X(m-1)-X(m-2)-Y(m-3)*(X(m-2)-X(m-3),
   -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1)-Y(m-2)*(X(m-1)-X(m-2),
   -Y(m)*(X(m)-X(m-1)-Y(m-1)*(X(m)-X(m-1),
   -Y(m)*(X(m)-X(m-1))
]`

If as second parameter a number `n` is given, the returned array `X`
will be the n-th integral, thus above step applied n-times.

NOTE: the integral cannot determine the original set of values before
`diff` was applied, thus `integral(diff(values)) != values` due to the
nature of integration and differentiation. However the shape of the result
will be the same, the curve will only be shifted by a constant value.
("translation")

Usage
```
sin = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.sin)];
cos = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(Math.cos)];
A = integral([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], cos);
// result
A ≈ sin // A is the approximate integral of "cos"
```
