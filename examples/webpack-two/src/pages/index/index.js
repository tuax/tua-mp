import { TuaPage } from '@/../../../src/'

import '@/styles/todomvc-common-base.css'
import '@/styles/todomvc-app-css.css'
import './index.less'

const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.completed),
    completed: todos => todos.filter(todo => todo.completed),
}

TuaPage({
    data () {
        return {
            todos: [
                { id: 1, title: 'a', completed: true },
                { id: 2, title: 'b', completed: false },
            ],
            newTodo: '',
            editedTodo: '',
            visibility: 'all',
        }
    },
    computed: {
        filteredTodos () {
            return filters[this.visibility](this.todos)
        },
        remaining () {
            return filters.active(this.todos).length
        },
        remainingStr () {
            return this.pluralize('item', this.remaining)
        },
        allDone () {
            return this.remaining === 0
        },
    },
    watch: {
    },
    onLoad () {
        console.log(this)
        console.log(this.todos)
    },
    methods: {
        toggleAll ({ detail: { value } }) {
            console.log('value', value)

            if (value[0] === 'false') {
                this.todos.forEach((todo) => {
                    todo.completed = true
                })
            } else {
                this.todos.forEach((todo) => {
                    todo.completed = false
                })
            }
        },
        toggleTodo ({ target: { dataset: { idx } } }) {
            this.todos[idx].completed = !this.todos[idx].completed
        },
        inputTodo ({ detail: { value } }) {
            this.newTodo = value
        },
        filteredTodosClass (todo) {
            return [
                todo.completed ? 'completed' : '',
                todo === this.editedTodo ? 'editing' : '',
            ].join(' ')
        },
        onPressTodo ({ target: { dataset: { idx } } }) {
            this.editTodo(this.todos[idx])
        },
        onBlurTodo ({
            detail: { value },
            target: { dataset: { idx } },
        }) {
            if (!this.editedTodo) return

            this.editedTodo = null
            this.todos[idx].title = value
        },

        // 非小程序特有函数
        pluralize (word, count) {
            return word + (count === 1 ? '' : 's')
        },
        addTodo () {
            const value = this.newTodo && this.newTodo.trim()
            if (!value) return

            this.todos.push({
                id: this.todos.length + 1,
                title: value,
                completed: false,
            })
            this.newTodo = ''
            console.log(this)
            console.log(this.todos)
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
            this.todos = filters.active(this.todos)
        },
    },
})
