function removeAllWhitespace(string) {
  if (!string)
    return '';

  return string.replace(/\s+/g, '');
}

function toTitleCase(string) {
  if (!string)
    return '';

  return string
    .toLowerCase()
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = {
  removeAllWhitespace,
  toTitleCase
};
