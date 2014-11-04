diff.js
=======

Javascript function for finding local extrema along a list of values.

This is a Javascript implementation of "A Linear-Time Algorithm That
Locates Local Extrema of a Function of One Variable From Interval
Measurement Results" - Karen Villaverde, Vladik Kreinovich
(Interval Computations 01/1993; 1993(4))

It takes an object or array with numbers and returns an object with
two lists of intervals: 'minlist' with intervals that contain local
minima and 'maxlist' with intervals that contain local maxima. Takes
numbers as first parameter and an accuracy > 0 (epsilon) as second
parameter. The accuracy has to be chosen depending on the fluctuations
in the data: smaller values mean greater reliability in finding extrema
but slower computation. 
Epsilon defaults to 0.1 if omitted but don't rely on that!

Usage:
```
\<script type="text/javascript" src="diff.min.js"\>\</script\>

a = diff1([1,2,3,4,3,2,1,0,1,2,3,4,5,6,7]);
                 ^       ^local min   
                 local max

b = diff2([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], [1,2,3,4,3,2,1,0,1,2,3,4,5,6,7]);
                                                       ^       ^local min   
                                                       local max

```
Will give:
```
a = { minlist: [ 3 ], maxlist: [ 7 ] }
b = { minlist: [ [2, 4] ], maxlist: [ [6, 8] ] }
```
because the only local min is at index 3 and the only local max is at index 7.
