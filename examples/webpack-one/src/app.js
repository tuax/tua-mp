App({
    onLaunch () {
        const p = new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })

        p.then(() => {
            console.log('from promise')
        })

        const set = new Set([1, 2, 2, 3, 4, 5, 5, 5])
        const arr = Array.from(set)

        console.log(arr.includes(1))
    },
    globalData: {},
})
