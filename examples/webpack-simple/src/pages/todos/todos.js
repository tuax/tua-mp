import { TuaPage } from 'tua-mp'

import { VALID_FILTERS } from '@const'
import { filterFns, getValFromEvent } from '@utils'

import '@/styles/todomvc-common-base.css'
import '@/styles/todomvc-app-css.css'
import './todos.less'

let uid = 0

TuaPage({
    data () {
        return {
            todos: [
                { id: uid++, title: 'a', completed: true },
                { id: uid++, title: 'b', completed: false },
            ],
            newTodo: '',
            editedTodo: null,
            visibility: 'all',
            VALID_FILTERS,
        }
    },
    computed: {
        filteredTodos () {
            return filterFns[this.visibility](this.todos)
        },
        remaining () {
            return filterFns.active(this.todos).length
        },
        remainingStr () {
            return this.pluralize('item', this.remaining)
        },
        allDone () {
            return this.remaining === 0
        },
        clearCompletedStyleStr () {
            const visibility = this.todos.length <= this.remaining
                ? 'hidden'
                : 'visible'

            return `visibility: ${visibility};`
        },
    },
    watch: {
    },
    onLoad () {
    },
    methods: {
        toggleAll (e) {
            const { value: [ allDone ] } = getValFromEvent(e)

            if (allDone === 'false') {
                this.todos.forEach((todo) => {
                    todo.completed = true
                })
            } else {
                this.todos.forEach((todo) => {
                    todo.completed = false
                })
            }
        },
        onToggleTodo (e) {
            const { index } = getValFromEvent(e)
            const todo = this.todos[index]

            todo.completed = !todo.completed
        },
        inputTodo (e) {
            const { value } = getValFromEvent(e)

            this.newTodo = value
        },
        filteredTodosClass (todo) {
            return [
                todo.completed ? 'completed' : '',
                todo === this.editedTodo ? 'editing' : '',
            ].join(' ')
        },
        onPressTodo (e) {
            const { todo } = getValFromEvent(e)

            this.editTodo(todo)
        },
        onBlurTodo (e) {
            const { index, value } = getValFromEvent(e)
            const todo = this.todos[index]

            if (!this.editedTodo) return

            this.editedTodo = null
            todo.title = value.trim()

            if (!todo.title) {
                this.removeTodo(todo)
            }
        },
        onTapRemove (e) {
            const { index } = getValFromEvent(e)

            this.removeTodo(this.todos[index])
        },
        onChangeFilter (e) {
            const { filter } = getValFromEvent(e)

            this.visibility = filter
        },
        pluralize (word, count) {
            return word + (count === 1 ? '' : 's')
        },
        addTodo () {
            const value = this.newTodo && this.newTodo.trim()
            if (!value) return

            this.todos.push({
                id: uid++,
                title: value,
                completed: false,
            })
            this.newTodo = ''
        },
        removeTodo (todo) {
            const index = this.todos.indexOf(todo)
            this.todos.splice(index, 1)
        },
        editTodo (todo) {
            this.beforeEditCache = todo.title
            this.editedTodo = todo
        },
        doneEdit (todo) {
            if (!this.editedTodo) return

            this.editedTodo = null
            todo.title = todo.title.trim()

            if (!todo.title) {
                this.removeTodo(todo)
            }
        },
        cancelEdit (todo) {
            this.editedTodo = null
            todo.title = this.beforeEditCache
        },
        removeCompleted () {
            this.todos = filterFns.active(this.todos)
        },
    },
})
