const copyObj = obj => JSON.parse(
    JSON.stringify(obj)
)

const isSimpleAttr = val => !Array.isArray(val) && typeof val !== 'object'

const asset = (a, b, MSG) => {
    if (a === b) return

    throw Error(`${MSG} fail!!!\n${a} !== ${b}`)
}

const afterSeData = fn => setTimeout(fn, 0)

/**
 * 数组中的嵌套类型属性的赋值测试
 * 检查对于 data 上的数组中的嵌套类型属性的赋值，
 * 能否改变 vm.data 上的对应数据
 */
export const testNestedArrayData = (vm) => {
    let tmpVal = 0
    const MSG = 'test nested array type data'
    const preData = copyObj(vm.data.nestedArrayData[0])

    // 赋值
    vm.nestedArrayData[0].steve = { steve: tmpVal++ }
    vm.nestedArrayData[0].young = tmpVal++

    // 异步检查
    afterSeData(() => {
        asset(vm.data.nestedArrayData[0].young, --tmpVal, MSG)
        asset(vm.data.nestedArrayData[0].steve.steve, --tmpVal, MSG)

        // 还原
        vm.nestedArrayData[0] = preData
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
    const preData = copyObj(vm.data.arrayData)

    // 赋值
    vm.arrayData.push(tmpVal++)
    vm.arrayData.unshift(tmpVal++)

    // 异步检查
    afterSeData(() => {
        const len1 = preData.length
        const len2 = vm.data.arrayData.length

        asset(len2, len1 + 2, MSG)
        asset(vm.data.arrayData[0], --tmpVal, MSG)
        asset(vm.data.arrayData[len2 - 1], --tmpVal, MSG)

        // 还原
        vm.arrayData = preData
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
    const preData = copyObj(vm.data.nestedData)

    // 赋值
    vm.nestedData.steve = { steve: tmpVal++ }
    vm.nestedData.young = tmpVal++

    // 异步检查
    afterSeData(() => {
        asset(vm.data.nestedData.young, --tmpVal, MSG)
        asset(vm.data.nestedData.steve.steve, --tmpVal, MSG)

        // 还原
        vm.nestedData = preData
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
