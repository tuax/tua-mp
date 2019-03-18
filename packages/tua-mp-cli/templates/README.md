# templates

这个文件夹下放的是 `@tua-mp/cli` 使用 `add` 命令所需的模板文件。

## 文件结构

```
templates
├── README.md
├── api
│   ├── api.js
│   └── index.js
├── comp
│   ├── Comp.vue
│   └── index.js
└── page
    ├── Page.vue
    └── index.js
```

## 使用说明
文件中使用两个花括号包起来的是模板变量，如 `{{ name }}`。在生成代码时会进行变量替换。
