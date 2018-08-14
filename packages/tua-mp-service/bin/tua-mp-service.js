#!/usr/bin/env node

const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
        `You are using Node ${process.version}, but tua-mp-service ` +
        `requires Node ${requiredVersion}.` +
        `Please upgrade your Node version.`
    )
    process.exit(1)
}

const Service = require('../lib/Service')
const service = new Service(process.cwd())
const args = process.argv.slice(2)

service.run(args[0])
    .then(console.log)
    .catch((e) => {
        e && console.error(e)
        process.exit(1)
    })
