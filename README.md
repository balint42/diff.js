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

`extremaXY` function
--------------------
Alternative version that takes vectors `[x]` and `[y]` instead of `[values]`
as input and returns intervals that contain local minima and local maxima.
`[x]` elements can be of any type.

`diff` function
---------------
Calculate differential of a vector.

Takes an object or array `X` with m numbers and returns an array
`Y` with m-1 numbers that constitutes the differential:
`Y = [X(2)-X(1) X(3)-X(2) ... X(m)-X(m-1)]`

If as second parameter a number `n` is given, the returned array
`Y` will be the n-th differential, thus above step applied n-times.

`integral` function
-------------------
Calculate one integral of a vector assuming that the variable constant
is zero.

Takes an object or array Y with m numbers and returns an array `X` with
m numbers that constitutes the differential:
`[ ... -Y(m)-Y(m-1)-Y(m-2)  -Y(m)-Y(m-1)  -Y(m)]`

If as second parameter a number `n` is given, the returned array `X` will be
the n-th integral, thus above step applied n-times.

NOTE: the integral cannot determine the original set of values before
`diff` was applied, thus `integral(diff(values)) != values` due to the
nature of integration and differentiation. But due to the same nature
the following always applies: `integral(diff(values)) + values(m) = values(1:m-1)`
In other words: to reverse a `diff`, apply an integral and add the last
original value `values(m)` to all elements of the resulting array. Then
append the last original value and you have the exact original `values`
array.

Examples
--------

Include: \<script type="text/javascript" src="diff.min.js"\>\</script\>

Usage:
```
/* extrema & extremaXY
 * -------------------*/
// using arrays with with numeric indices
A = extrema([1,2,3,4,3,2,1,0,1,2,3,4,5,6,7], "0.01");
                   ^       ^local min   
                   local max

B = extremaXY([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], [1,2,3,4,3,2,1,0,1,2,3,4,5,6,7], "0.01");
                                                           ^       ^local min   
                                                           local max
// using string indices
C = extrema({"a":1,"b":2,"c":3,"d":4,"e":3,"f":2,"g":1,"h":0,"i":1,"j":2,"k":3,"l":4,"m":5,"n":6,"o":7});
D = extremaXY(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"], [1,2,3,4,3,2,1,0,1,2,3,4,5,6,7]);

/* diff & integral
 * -------------------*/

diff()
```
Will give:
```
A = { minlist: [ 3 ], maxlist: [ 7 ] }
B = { minlist: [ [2, 4] ], maxlist: [ [6, 8] ] }
C = { minlist: [ "d" ], maxlist: [ "h" ] }
D = { minlist: [ ["c", "e"] ], maxlist: [ ["g", "i"] ] }
```
because the only local min is at index 3 / "d" and the only local max is at index 7 / "h".
