function handleFileName(value) {
  return value
    .toString()
    .substring(0, 69)
    .normalize("NFD") //decomposes combined graphemes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w0-9\-]/g, " ")
    .trim()
}

module.exports = handleFileName
