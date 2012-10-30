var ErrorMessage = {};

ErrorMessage.createInvalidNumberOfParameter = function (num) {
  return 'Invalid number of parameters, expected ' + num;
};

module.exports = ErrorMessage;