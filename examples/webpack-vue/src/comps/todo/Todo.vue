<config>
{
    "component": true
}
</config>

<template lang="wxml">
    <view class="li todo {{ todoClassStr }}">
        <view class="view">
            <checkbox-group
                data-index="{{ index }}"
                bindchange="onToggleTodo"
            >
                <checkbox
                    class="toggle {{ todo.completed ? 'checked' : '' }}"
                    checked="{{ todo.completed }}"
                />
                <label
                    data-todo="{{ todo }}"
                    bindlongpress="onPressTodo"
                >
                    {{ todo.title }}
                </label>
            </checkbox-group>

            <view
                class="destroy"
                data-index="{{ index }}"
                bindtap="onTapRemove"
            />
        </view>

        <input
            class="edit"
            value="{{ todo.title }}"
            data-index="{{ index }}"
            bindblur="onBlurTodo"
        />
    </view>
</template>

<script>
const defaultFn = () => ({
    id: 0,
    completed: false,
})

export default {
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
}
</script>

<style lang="scss">
.li {
    position: relative;

    border-bottom: 1px solid #ededed;

    font-size: 48rpx;

    &:last-child {
        border-bottom: none;
    }

    &.editing {
        padding: 0;

        border-bottom: none;

        .edit {
            display: block;

            width: calc(100% - 43px);
            margin: 0 0 0 43px;
            padding: 12px 16px;
        }

        .view {
            display: none;
        }
    }

    .toggle {
        position: absolute;
        top: 0;
        bottom: 0;

        width: 40px;
        /* auto, since non-WebKit browsers doesn't support input styling */
        height: auto;
        margin: auto 0;

        text-align: center;

        opacity: 0;
        border: none; /* Mobile Safari */

        -webkit-appearance: none;
        appearance: none;

        & + label {
            /*
                Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
                IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
            */
            background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
            background-repeat: no-repeat;
            background-position: center left;
        }

        &.checked + label {
            background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
        }
    }

    label {
        display: block;

        padding: 30rpx 30rpx 30rpx 120rpx;

        transition: color 0.4s;
        word-break: break-all;

        line-height: 1.2;
    }

    &.completed label {
        text-decoration: line-through;

        color: #d9d9d9;
    }

    .destroy {
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;

        width: 80rpx;
        height: 80rpx;
        margin: auto 0;
        margin-bottom: 22rpx;

        transition: color 0.2s ease-out;

        color: #af5b5e;

        font-size: 30px;

        &:after {
            content: '×';
        }
    }

    &:hover .destroy {
        display: block;
    }

    & .edit {
        display: none;
    }

    &.editing:last-child {
        margin-bottom: -1px;
    }
}

.edit {
    position: relative;

    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 6px;

    color: inherit;
    border: 0;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);

    font-family: inherit;
    font-size: 24px;
    font-weight: inherit;
    line-height: 1.4em;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
