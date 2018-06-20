import { TuaComp } from 'tua-mp'

import './todo.less'

const defaultFn = () => ({
    id: 0,
    completed: false,
})

TuaComp({
    props: {
        todo: {
            type: Object,
            default: defaultFn,
        },
        index: Number,
        editedTodo: {
            type: Object,
            default: defaultFn,
        },
    },
    computed: {
        todoClassStr () {
            const completedStr = this.todo.completed ? 'completed' : ''

            // editedTodo 可能为 null
            if (!this.editedTodo) return completedStr

            const editingStr = this.todo.id === this.editedTodo.id ? 'editing' : ''

            return [ editingStr, completedStr ].join(' ')
        },
    },
    methods: {
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
