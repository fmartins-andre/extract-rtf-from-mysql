const rtfHeader = require("./utils/rtfHeaderRaw")
const specialCharToRtf = require("./utils/specialCharToRtf")

const cleanData = (_buffer_, title = null) => {
  /*
  The RTF files got from database not work well on Linux!
  They have some char set problems because of the RTF version (spec 1.5).
  As I could not convert these files to any newer/compatible RTF version
  I needed to make some hacks to assure the file will open nicely!
  The hacks are:
  1. remove all images, because of it causing problems with the char set;
  2. remove some tags were causing some format problems to the text;
  3. insert a compatible header.
  These hacks are intended only to this use case, so you may need to change
  them as necessary to fit your needs!
  */

  const rtfTitle = title
    ? `\\plain\\f0\\fs24\\f0\\b ${specialCharToRtf(title)} \\par\\par\\par`
    : ""

  return `${rtfHeader}\n${rtfTitle}\n${_buffer_
    .toString()
    .replace(/\\bin([\s\S\n]*?)\\par/g, "")
    .replace(/{\\pict.*/g, "")
    .replace(/\{?\\(listlevel)([\s\S\n]*?)\}\}/g, "")
    .replace(/\{\\\*\\fldrslt([\s\S\n]*?)\}\}/g, "")
    .replace(/\\(f[1-9]|(cl)?cbpat[0-9]{2}|cf[0-9]+)/g, `\\f0`)
    .replace(/\\listid.*/g, "")
    .replace(/\{\\rtf.*/, "")}`
}

module.exports = cleanData
