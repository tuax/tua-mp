<config>
{
    "navigationBarTitleText": "tua-mp todos",
    "usingComponents": {
        "Todo": "./comps/Todo/Todo",
        "Filter": "/comps/Filter/Filter"
    }
}
</config>

<template lang="wxml">
    <import src="/templates/info.wxml" />

    <view class="todoapp">
        <view class="header">
            <view class="h1">todos</view>
            <input
                focus
                value="{{ newTodo }}"
                class="new-todo"
                bindinput="inputTodo"
                bindconfirm="addTodo"
                placeholder="What needs to be done?"
            />
        </view>

        <view class="main" hidden="{{ !todos.length }}">
            <checkbox-group bindchange="toggleAll">
                <checkbox
                    id="toggle-all"
                    class="toggle-all {{ allDone ? 'checked' : '' }}"
                    value="{{ allDone }}"
                    checked="{{ allDone }}"
                />
                <label for="toggle-all">Mark all as complete</label>
            </checkbox-group>

            <view class="todo-list">
                <Todo
                    wx:for="{{ filteredTodos }}"
                    wx:key="id"
                    wx:for-item="todo"
                    wx:for-index="index"
                    todo="{{ todo }}"
                    index="{{ index }}"
                    editedTodo="{{ editedTodo }}"
                    bind:onBlurTodo="onBlurTodo"
                    bind:onPressTodo="onPressTodo"
                    bind:onTapRemove="onTapRemove"
                    bind:onToggleTodo="onToggleTodo"
                />
            </view>
        </view>

        <view class="footer" hidden="{{ !todos.length }}">
            <view class="todo-count">
                {{ remaining }} {{ remainingStr }} left
            </view>

            <view class="filters">
                <Filter
                    wx:for="{{ VALID_FILTERS }}"
                    wx:key="*this"
                    wx:for-item="filterType"
                    visibility="{{ visibility }}"
                    filterType="{{ filterType }}"
                    bind:onChangeFilter="onChangeFilter"
                />
            </view>

            <view
                class="clear-completed"
                bindtap="removeCompleted"
                style="{{ clearCompletedStyleStr }}"
            >
                Clear completed
            </view>
        </view>
    </view>

    <template is="info" />
</template>

<script>
import { VALID_FILTERS } from '@const'
import { filterFns, getValFromEvent } from '@utils'

import '@/styles/todomvc-common-base.css'
import '@/styles/todomvc-app-css.css'

let uid = 0

export default {
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
}
</script>

<style lang="scss">
page {
    margin: 0 auto;

    color: #4d4d4d;
    background: #f5f5f5;

    font: 28rpx 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.todoapp .h1 {
    position: absolute;
    top: -260rpx;

    width: 100%;

    text-align: center;

    color: rgba(175, 47, 47, 0.15);

    font-size: 200rpx;
    font-weight: 100;

    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
}

input {
    height: 140rpx;

    font-size: 40rpx;
    line-height: 140rpx;
}

.new-todo {
    padding: 32rpx 32rpx 32rpx 100rpx;
}

.toggle-all + label {
    top: -110rpx;
    left: -20rpx;

    width: 120rpx;
    height: 68rpx;
}

.toggle-all + label:before {
    padding: 20rpx 54rpx 20rpx 54rpx;

    content: '❯';

    color: #e6e6e6;

    font-size: 22px;
}

.toggle-all.checked + label:before {
    color: #737373;
}

.footer {
    display: flex;
    justify-content: space-between;

    height: 40rpx;
    padding: 20rpx 30rpx;

    .todo-count {
        float: none;
        flex: 0 0 auto;
    }

    .filters {
        position: static;
        z-index: 1;

        display: inline-block;
        flex: 0 0 auto;
    }

    .clear-completed {
        float: none;
        flex: 0 0 auto;

        text-decoration: underline;

        line-height: 1;
    }
}

.info {
    font-size: 40rpx;

    .a {
        text-decoration: underline;

        color: inherit;

        font-weight: 400;
    }
}

</style>
