/**
 * Utilities file.
 *   Put anything of use in here that you dont know where to put.
 */
var Utils = function() {};
  
// Merge all from object1 into object2
// @param object1  - the resulting object
// @param object2  - the object to be merged in to object1
Utils.prototype.mergeObjects = function(object1, object2) {
  for (var attrname in object2) { object1[attrname] = object2[attrname]; }
};

// Pad digits with "0" x n.
// @param number  - the number to pad
// @param digits  - the number of digits to pad
Utils.prototype.padDigits = function(number, digits) {
  return Array(Math.max(digit,s - String(number).length + 1, 0)).join(0) + number;
};

// Pad a time operand (minutes / hours) with a 0 at the beginning
//   will turn 10:3  into 10:03
// @param timeOperand  - the operand of the time (hour, minute)
Utils.prototype.padTime = function(timeOperand) {
   return (timeOperand < 10 ? '0' : '') + timeOperand;
};

// ==================== \\
Game.Utils= new Utils();