function removeAllWhitespace(string) {
  if (!string)
    return '';

  return string.replace(/\s+/g, '');
}

function toUppercaseFirst(string) {
  if (!string)
    return '';

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
  removeAllWhitespace,
  toUppercaseFirst
};
