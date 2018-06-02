import { TuaComp } from '@/../../../src/'
import { VALID_FILTERS } from '@const'

import './filter.less'

TuaComp({
    props: {
        visibility: {
            type: String,
            validator: val => VALID_FILTERS.includes(val),
        },
        filterType: {
            type: String,
            validator: val => VALID_FILTERS.includes(val),
        },
    },
    // TODO
    computed: {
    },
    methods: {
        onChangeFilter (e) {
            this.$emit('onChangeFilter', e)
        },
    },
})
