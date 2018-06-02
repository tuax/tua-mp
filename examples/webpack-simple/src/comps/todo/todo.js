import { TuaComp } from '@/../../../src/'
import { getValFromEvent } from '@utils'

import './todo.less'

TuaComp({
    props: {
        todo: {
            type: Object,
            default: () => ({
                id: 0,
                completed: false,
            }),
        },
        index: Number,
        editedTodo: {
            type: Object,
            default: () => ({
                id: 0,
                completed: false,
            }),
        },
    },
    // TODO
    // computed: {
    //     todoClassStr () {
    //         const completedStr = this.todo.completed ? 'completed' : ''

    //         console.log('completedStr', completedStr)

    //         // editedTodo 可能为 null
    //         if (!this.editedTodo) return completedStr

    //         const editingStr = this.todo.id === this.editedTodo.id ? 'editing' : ''

    //         return [ editingStr, completedStr ].join(' ')
    //     },
    // },
    methods: {
        $emit (eventName, event) {
            this.triggerEvent(eventName, getValFromEvent(event))
        },
        onToggleTodo (e) {
            this.$emit('onToggleTodo', e)
        },
        onPressTodo (e) {
            this.$emit('onPressTodo', e)
        },
        onTapRemove (e) {
            this.$emit('onTapRemove', e)
        },
        onBlurTodo (e) {
            this.$emit('onBlurTodo', e)
        },
    },
})
