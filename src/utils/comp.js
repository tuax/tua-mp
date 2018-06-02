/**
 * 取出并合并常用的 detail 和 dataset 上的值
 * 方便业务代码获取需要的数据
 * @param {Object} detail 自定义事件所携带的数据
 * @param {Object} currentTarget 当前组件的一些属性值集合
 */
export const getValFromEvent = ({ detail, currentTarget }) =>
    ({ ...detail, ...currentTarget.dataset })

/**
 * 封装小程序原生的 triggerEvent 方法，
 * @param {String} eventName 自定义事件名称
 * @param {Event} event 小程序原生事件
 * @param {Object} options 小程序原生事件
 */
export const $emit = function (eventName, event, options) {
    this.triggerEvent(
        eventName,
        getValFromEvent(event),
        options
    )
}
