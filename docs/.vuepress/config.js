const { name, description } = require('../../packages/tua-mp/package.json')

module.exports = {
    base: '/' + name + '/',
    locales: {
        '/': { title: name, description },
    },
    head: [
        ['link', { rel: 'icon', href: `/logo.png` }],
    ],
    evergreen: true,
    serviceWorker: true,
    markdown: {
        extendMarkdown: (md) => {
            md.use(require('markdown-it-include'), {
                root: './packages/',
                includeRe: /<\[include\]\((.+)\)/i,
            })
        },
    },
    themeConfig: {
        repo: 'tuateam/tua-mp',
        docsDir: 'docs',
        editLinks: true,
        lastUpdated: '上次更新',
        sidebarDepth: 2,
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
            {
                text: '🌱指南',
                link: '/guide/',
            },
            {
                text: '🛠构建工具',
                link: '/tua-mp-service/',
            },
            {
                text: '🔩命令行工具',
                link: '/tua-mp-cli/',
            },
            {
                text: '🔥生态系统',
                items: [
                    { text: '📦本地存储', link: 'https://tuateam.github.io/tua-storage/' },
                    { text: '🏗api 生成工具', link: 'https://tuateam.github.io/tua-api/' },
                ],
            },
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '🌱指南',
                    collapsable: false,
                    children: [
                        'installation',
                        '',
                        'instance',
                        'computed',
                        'components',
                        'simple-app',
                        'vue-app',
                    ],
                },
            ],
        },
        serviceWorker: {
            updatePopup: {
               message: 'New content is available.',
               buttonText: 'Refresh',
            },
        },
    },
}
