module.exports = {
    extends: "standard",
    parser: "babel-eslint",
    rules: {
        "indent": [2, 4],
        "promise/param-names": 0,
        "comma-dangle": [2, "always-multiline"],
    },
    globals: {
        App: true,
        Page: true,
        wx: true,
        getApp: true,
        getPage: true,
    },
}
