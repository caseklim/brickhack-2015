var Parser = {};

Parser.test = function(request) {
  return "Message from " + request.From + ": " + request.Body;
}

module.exports = Parser;
