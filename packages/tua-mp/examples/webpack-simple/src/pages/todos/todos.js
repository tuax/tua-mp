import uuidv1 from 'uuid/v1'
import { TuaPage } from 'tua-mp'

import { VALID_FILTERS } from '@const'
import { filterFns, getValFromEvent } from '@utils'

import '@/styles/todomvc-common-base.css'
import '@/styles/todomvc-app-css.css'
import './todos.less'

const { globalData: { storage } } = getApp()

TuaPage({
    data () {
        return {
            todos: [],
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
    async mounted () {
        const { data } = await storage.load({
            key: 'todos',
            syncFn: () => Promise.resolve([]),
        })

        // 初始化
        this.todos = data
    },
    watch: {
        todos: {
            deep: true,
            // 存到 storage 中
            handler (todos) {
                storage.save({
                    key: 'todos',
                    // 永久存储
                    expires: null,
                    data: { data: todos },
                })
            },
        },
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
            const { id } = getValFromEvent(e)
            const todo = this.getTodoById(id)

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
            const { id } = getValFromEvent(e)

            this.editedTodo = this.getTodoById(id)
        },
        onBlurTodo (e) {
            const { id, value } = getValFromEvent(e)
            const todo = this.getTodoById(id)

            if (!this.editedTodo) return

            this.editedTodo = null
            todo.title = value.trim()

            if (!todo.title) {
                this.removeTodo(todo)
            }
        },
        onTapRemove (e) {
            const { id } = getValFromEvent(e)

            this.removeTodo(this.getTodoById(id))
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
                id: uuidv1(),
                title: value,
                completed: false,
            })
            this.newTodo = ''
        },
        removeTodo (todo) {
            const index = this.todos.indexOf(todo)
            this.todos.splice(index, 1)
        },
        removeCompleted () {
            this.todos = filterFns.active(this.todos)
        },
        getTodoById (id) {
            return this.todos.find(t => t.id === id)
        },
    },
})
