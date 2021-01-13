const fs = require("fs").promises
const { ungzip } = require("node-gzip")
const cleanData = require("./cleanData")
const handleFileName = require("./utils/handleFileName")

const saveLocalRtfFiles = async (localData, localFolder) => {
  return new Promise(resolve => {
    let counter = 0
    localData.forEach(async row => {
      const rtfFileName = `${localFolder}/${handleFileName(row.title)}.rtf`

      try {
        const uncompressed = await ungzip(row.file)
        const cleaned = cleanData(uncompressed, row.title)
        await fs.writeFile(rtfFileName, Buffer.from(cleaned))

        counter++
        if (counter === localData.length) {
          console.log(`::: Application: ${counter} RTF files were saved.`)

          resolve(counter)
        }
      } catch (error) {
        console.error(error, rtfFileName)
      }
    })
  })
}

module.exports = saveLocalRtfFiles
