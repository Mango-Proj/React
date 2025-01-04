// Example 01: Run Node
// console.log("index run");

// Example 02: Import / Export
/*
// 일부 불러오기
import {PI, getArea, getCircumference} from "./circle.js";
console.log(PI, getArea(1), getCircumference(1));
*/

/*
// 전부 불러오기 
import * as circle from "./circle.js";
console.log(circle.PI, circle.getArea(1), circle.getCircumference(1));
*/


// default 불러오기
import circle from "./circle.js";
console.log(circle.PI, circle.getArea(1), circle.getCircumference(1));
