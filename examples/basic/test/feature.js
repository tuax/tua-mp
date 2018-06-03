const stringify = JSON.stringify.bind(JSON)

const copyObj = (obj) => JSON.parse(stringify(obj))

const isSimpleAttr = val => !Array.isArray(val) && typeof val !== 'object'

const asset = (a, b, MSG) => {
    if (a === b) return

    const strA = stringify(a)
    const strB = stringify(b)
    throw Error(`${MSG} fail!!!\n${strA} !== ${strB}`)
}

const afterSeData = fn => setTimeout(fn, 0)

/**
 * 数组中插入对象或数组
 */
export const testInsertNestedArrayData = (vm) => {
    let tmpVal = 0
    const MSG = 'test insert nested array type data'

    // 赋值
    vm.testData.insertNestedArr.unshift({ steve: tmpVal })
    vm.testData.insertNestedArr[0].steve = tmpVal++
    vm.testData.insertNestedArr.unshift([{ young: tmpVal }])
    vm.testData.insertNestedArr[0][0].young = tmpVal++

    // 异步检查
    afterSeData(() => {
        asset(vm.data.testData.insertNestedArr[0][0].young, --tmpVal, MSG)
        asset(vm.data.testData.insertNestedArr[1].steve, --tmpVal, MSG)

        console.log(`✔️ ${MSG} success!`)
    })
}

/**
 * 数组中的嵌套类型属性的赋值测试
 * 检查对于 data 上的数组中的嵌套类型属性的赋值，
 * 能否改变 vm.data 上的对应数据
 */
export const testNestedArrayData = (vm) => {
    let tmpVal = 0
    const MSG = 'test nested array type data'

    // 赋值
    vm.testData.nestedArr
        .sort((a, b) => a.name.localeCompare(b.name))
    vm.testData.nestedArr[1].name = { steve: tmpVal++ }
    vm.testData.nestedArr[1].nick = tmpVal++

    // 异步检查
    afterSeData(() => {
        asset(vm.data.testData.nestedArr[0].name, 'jame', MSG)
        asset(vm.data.testData.nestedArr[1].nick, --tmpVal, MSG)
        asset(vm.data.testData.nestedArr[1].name.steve, --tmpVal, MSG)

        console.log(`✔️ ${MSG} success!`)
    })
}

/**
 * 数组类型属性的赋值测试
 * 检查对于 data 上的数组类型属性的赋值，
 * 能否改变 vm.data 上的对应数据
 */
export const testArrayData = (vm) => {
    let tmpVal = 0
    const MSG = 'test array type data'
    const len1 = vm.data.testData.arr.length

    // 赋值
    vm.testData.arr.push(tmpVal++)
    vm.testData.arr.unshift(tmpVal++)

    // 异步检查
    afterSeData(() => {
        const len2 = vm.data.testData.arr.length

        asset(len2, len1 + 2, MSG)
        asset(vm.data.testData.arr[0], --tmpVal, MSG)
        asset(vm.data.testData.arr[len2 - 1], --tmpVal, MSG)

        console.log(`✔️ ${MSG} success!`)
    })
}

/**
 * 嵌套类型属性的赋值测试
 * 检查对于 data 上的嵌套类型属性的赋值，
 * 能否改变 vm.data 上的对应数据
 */
export const testNestedData = (vm) => {
    let tmpVal = 0
    const MSG = 'test nested type data'

    // 赋值
    vm.testData.nested.steve = { steve: tmpVal++ }
    vm.testData.nested.young = tmpVal++

    // 异步检查
    afterSeData(() => {
        asset(vm.data.testData.nested.young, --tmpVal, MSG)
        asset(vm.data.testData.nested.steve.steve, --tmpVal, MSG)

        console.log(`✔️ ${MSG} success!`)
    })
}

/**
 * 简单类型属性的赋值测试
 * 检查对于 data 上的简单类型属性的赋值，
 * 能否改变 vm.data 上的对应数据
 */
export const testSimpleData = (vm) => {
    let tmpVal = 0
    const MSG = 'test simple type data'
    const preData = copyObj(vm.$data)
    const simpleAttrs = Object.keys(preData)
        .filter(key => isSimpleAttr(preData[key]))

    // 赋值
    simpleAttrs.forEach((key) => {
        vm[key] = tmpVal++
    })

    // 异步检查
    afterSeData(() => {
        simpleAttrs
            .reverse()
            .forEach((key) => {
                asset(vm.data[key], --tmpVal, MSG)

                // 还原
                vm[key] = preData[key]
            })
        console.log(`✔️ ${MSG} success!`)
    })
}
