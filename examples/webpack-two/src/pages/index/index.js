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
            todos: [],
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
        // allDone: {
        //     get () {
        //         return this.remaining === 0
        //     },
        //     set (value) {
        //         this.todos.forEach((todo) => {
        //             todo.completed = value
        //         })
        //     },
        // },
        filteredTodosClass () {
            // completed: todo.completed, editing: todo == editedTodo
            return ''
        },
    },
    watch: {
    },
    onLoad () {
        console.log(this)
    },
    methods: {
        inputTodo ({ detail: { value } }) {
            this.newTodo = value
        },
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
