/**
 * 对于小程序中 Page 的简单 Mock
 */
global.Page = ({ data, ...rest }) => {
    const page = {
        data,
        setData: jest.fn(function (newData) {
            this.data = {
                ...this.data,
                ...newData,
            }
        }),
        onLoad() { },
        ...rest,
    }

    page.onLoad()

    return page
}
