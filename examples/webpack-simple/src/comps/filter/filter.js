import { TuaComp } from '@/../../../src/'
import { VALID_FILTER } from '@const'
import { getValFromEvent } from '@utils'

import './filter.less'

TuaComp({
    props: {
        visibility: {
            type: String,
            validator: val => VALID_FILTER.includes(val),
        },
        filterType: {
            type: String,
            validator: val => VALID_FILTER.includes(val),
        },
    },
    // TODO
    computed: {
    },
    methods: {
        onChangeFilter (e) {
            const { filter } = getValFromEvent(e)

            this.triggerEvent('onChangeFilter', { filter })
        },
    },
})
