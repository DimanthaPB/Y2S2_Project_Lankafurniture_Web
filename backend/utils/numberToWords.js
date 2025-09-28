const numberToWords = require('number-to-words');

const convertToWords = (num) => {
  if (!num) return '';
  return numberToWords.toWords(num).replace(/\b\w/g, char => char.toUpperCase());
};

module.exports = convertToWords;
