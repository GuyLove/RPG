/**
 * Logger class.
 *   This is the logger that will be used in the game for any console logging.
 */
var Logger = function() {};

// getTimeStamp()
// @return a nice timestamp used in logging
Logger.prototype.getTimeStamp = function() {
  date = new Date();
  var timestamp = 
    "[" + Game.Utils.padTime(date.getHours()) + ":" + Game.Utils.padTime(date.getMinutes()) + "] ";
  return timestamp;
};

// Logs a message with priority (info)
// @param message  - the message to log
// @param add      - the additional information to log
Logger.prototype.info = function(message, add) {
  if (Game.debugMode)
    if (typeof add == "undefined") console.log(this.getTimeStamp() + "(INFO): " + message);
    else                           console.log(this.getTimeStamp() + "(INFO): " + message, add);
};

// Logs a message with priority (warning)
// @param message  - the message to log
// @param add      - the additional information to log
Logger.prototype.warn = function(message, add) {
  if (Game.debugMode)
    if (typeof add == "undefined") console.warn(this.getTimeStamp() + "(WARN): " + message);
    else                           console.warn(this.getTimeStamp() + "(WARN): " + message, add);
};

// Logs a message with priority (error)
// @param message  - the message to log
// @param add      - the additional information to log
Logger.prototype.err = function(message, add) {
  if (typeof add == "undefined") console.error(this.getTimeStamp() + "(ERRO): " + message);
  else                           console.error(this.getTimeStamp() + "(ERRO): " + message, add);
};

Logger = new Logger();