var parseRequest = function(client, request) {
  return "Message from " + request.From + ": " + request.Body;
}

module.exports = parseRequest
