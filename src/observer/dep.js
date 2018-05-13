export default class Dep {
    constructor () {
        this.subs = []
    }

    addSub (sub) {
        if (this.subs.indexOf(sub) > -1) return

        this.subs.push(sub)
    }

    notify () {
        this.subs
            .slice()
            .forEach(sub => sub())
    }
}

Dep.targetCb = null
