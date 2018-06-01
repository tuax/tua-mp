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
    computed: {
        // TODO
        todoClassStr () {
            const completedStr = this.todo.completed ? 'completed' : ''

            console.log('completedStr', completedStr)

            // editedTodo 可能为 null
            if (!this.editedTodo) return completedStr

            const editingStr = this.todo.id === this.editedTodo.id ? 'editing' : ''

            return [ editingStr, completedStr ].join(' ')
        },
    },
    methods: {
        onToggleTodo (e) {
            const { index } = getValFromEvent(e)

            this.triggerEvent('onToggleTodo', { index })
        },
        onPressTodo (e) {
            const { todo } = getValFromEvent(e)

            this.triggerEvent('onPressTodo', { todo })
        },
        onTapRemove (e) {
            const { index } = getValFromEvent(e)

            this.triggerEvent('onTapRemove', { index })
        },
        onBlurTodo (e) {
            const { index, value } = getValFromEvent(e)

            this.triggerEvent('onBlurTodo', { index, value })
        },
    },
})
