import Dep from '../../../src/observer/dep'

describe('Dep', () => {
    let dep

    beforeEach(() => {
        dep = new Dep()
    })

    test('addSub', () => {
        const noop = () => {}
        dep.addSub(noop)
        dep.addSub(noop)
        expect(dep.subs.length).toBe(1)
        expect(dep.subs[0]).toBe(noop)
    })

    test('notify', () => {
        const subFn1 = jest.fn()
        const subFn2 = jest.fn(dep.addSub(subFn1))
        dep.addSub(subFn2)
        dep.notify()

        expect(subFn2).toBeCalled()
        expect(subFn1).toHaveBeenCalledTimes(1)
    })
})
