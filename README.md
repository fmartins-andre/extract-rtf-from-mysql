# extract-rtf-from-mysql

An app/microservice to extract MySQL RTF blobs/files and save them to disk.

## How to install

- install node 14 or above
- clone this repo
- `yarn install`

#### Dependencies

- `mysql2`
- `node-gzip`
- `zlib`

It also needs some other dependencies installed on the server/container:

- `libreoffice-writer`: Version 6 or above, to convert the files;
- `default-jre`: Needed by LibreOffice;
- `ttf-liberation`: Fonts to assure compatibility.

## How it works

Just run it with a JSON configuration file, and it's done!

#### Configuration file

```json
{
  "mysql": {
    "query": "SELECT 'HELLO WORD'",
    "connectionParameters": {
      "host": "myHost",
      "port": "3306",
      "database": "myDatabase",
      "user": "myUsername",
      "password": "myPassword"
    },
    "appOptions": {
      "convertToPdf": true,
      "deleteRtf": true
    }
  }
}
```

- The `mysql` section is used to configure the access to the source MySQL database;
- The `appOptions` section is used to pass some parameters to the application:
  - `convertToPdf`: this boolean flag will make the app convert the RTF files to PDF;
  - `deleteRtf`: once the RTF files has been converted to PDF, this boolean flag will make the app delete them.

You can pass a configuration file path as argument to the script. If called with no arguments, the script will try to load a file named `config.json` from its same folder.

#### How to run it

- `yarn start`: it'll load the default configuration file path.
- `yarn start path/to/my/config.json`: it'll load the given file.

#### Docker

1. Build: `docker build -t extract-rtf-from-mysql .`
2. Run: `docker run --rm --mount type=bind,source="$(pwd)"/src/config.json,target=/app/src/config.json,readonly --mount type=bind,source="$(pwd)"/files,target=/app/files extract-rtf-from-mysql`

###### Notes

- Give the container a name at the build time (`-t extract-rtf-from-mysql`), it'll make things easier to run afterwards.
- Mount the configuration file at the run time (`type=bind,source="$(pwd)"/src/config.json,target=/app/src/config.json,readonly`) to make it work:
  - On Linux or MacOS, the `$(pwd)` variable will expand to the current directory;
  - Mount the configuration file to the default configuration path `/app/src/config.json`.
  - You can pass a configuration path as argument, but you need to be sure you mounted the configuration file that matches this path.

## Scope

This app will:

0. log every step to stdout;
1. load a configuration file;
2. get data from a MySQL database;
3. clean up the data;
4. save the data as RTF files;
5. convert the RTF files to PDF, if configured;
6. delete the RTF files, if configured.

Nothing more, nothing less.
