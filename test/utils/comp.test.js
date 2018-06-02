import {
    getValFromEvent,
} from '../../src/utils'

const event = {
    "currentTarget": {
        "id": "",
        "offsetLeft": 0,
        "offsetTop": 0,
        "dataset": { "index": 0 }
    },
    "detail": { "value": [] }
}

const eventVal = {
    "value": [],
    "index": 0
}

test('getValFromEvent', () => {
    expect(getValFromEvent(event)).toEqual(eventVal)
})
