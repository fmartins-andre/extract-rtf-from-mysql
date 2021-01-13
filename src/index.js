const fs = require("fs").promises
const path = require("path")

const getData = require("./getData")
const convertFiles = require("./convertFiles")
const deleteLocalFiles = require("./deleteLocalFiles")
const saveLocalRtfFiles = require("./saveLocalRtfFiles")

async function main() {
  console.log(`::: Application: Job started!`)

  const configFile = process.argv[2] || path.resolve(__dirname, "config.json")
  const localFolder = path.resolve(__dirname, "../files")

  if (process.argv[2]) {
    console.log(
      `::: Application: Tip: You can pass a JSON configuration file path as argument.`
    )
  }
  console.log(
    `::: Application: Reading ${
      !process.argv[2] ? "default " : ""
    }configuration file: "${configFile}"`
  )

  try {
    const config = await fs.readFile(configFile, "utf-8")
    const { mysql, appOptions } = JSON.parse(config)
    console.log(`::: Application: Configuration file loaded.`)

    const mysqlData = await getData(mysql)
    if (mysqlData.error) throw Error(mysqlData.error)

    if (mysqlData.rows) {
      const numLocalFiles = await saveLocalRtfFiles(mysqlData.rows, localFolder)

      if (numLocalFiles > 0 && appOptions?.convertToPdf) {
        await convertFiles(localFolder)
        if (appOptions?.deleteRtf) await deleteLocalFiles(localFolder, "rtf")
      }
    } else {
      throw Error(`There is no data to work on!`)
    }
  } catch (error) {
    console.error(`::: Application: ERROR => ${error}`)
  } finally {
    console.log(`::: Application: Job finished!`)
    process.exit()
  }
}

main()
