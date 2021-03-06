export default {
    head: {
        title: process.env.npm_package_description || process.env.NUXT_TITLE,
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || process.env.NUXT_DESCRIPTION || ""
            }
        ],
        link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
    },
    css: ["./css/global.scss"],
    build: {
        extend: function(config, ctx) {
            config.node = {
                fs: "empty"
            };
            if (ctx.isDev) {
                config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
            }
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    exclude: /(node_modules)/
                });
            }
            config.module.rules.push({
                test: /\.(svga)$/,
                loader: "file-loader",
                options: {
                    name: "[name].svg?[hash]",
                    esModule: false
                }
            });
        },
        babel: {
            presets({ isServer }) {
                return [
                    [
                        require.resolve("@nuxt/babel-preset-app"),
                        {
                            buildTarget: isServer ? "server" : "client",
                            corejs: { version: 3 }
                        }
                    ]
                ];
            }
        }
    },
    plugins: [{ src: "./plugins/components-vue", mode: "client" }, { src: "./plugins/components" }],
    serverMiddleware: [
        {
            path: "api",
            handler: "../api/base.js"
        }
    ],
    render: {
        fallback: false
    }
};
