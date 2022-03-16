module.exports = {
    title: "Vue Udemy",
    dest: "docs",
    description: "Aprende Vue.js con bluuweb",
    base: "/vue-udemy/",
    locales: {
        "/": {
            lang: "es-ES",
        },
    },
    themeConfig: {
        editLinks: false,
        editLinkText: "",
        lastUpdated: "Last Updated",
        smoothScroll: true,
        nav: [
            { text: "Guía", link: "/" },
            // { text: 'Guia', link: '/docs/' },
            { text: "Youtube", link: "https://youtube.com/bluuweb" },
            {
                text: "Curso Premium",
                link: "http://curso-vue-js-udemy.bluuweb.cl",
            },
        ],
        sidebar: [
            "/",
            "/01-fundamentos/",
            "/02-cli/",
            "/03-router/",
            "/04-vuex/",
            "/05-form/",
            "/06-crud/",
            "/07-01-firebase/",
            "/08-01-auth/",
            "/20-composition/",
            "/21-vuex-composition/",
            "/22-provide/",
            "/23-trucos-vue-3/",
            "/24-firestore/",
            //   "/25-mevn/",
            "/07-crud-firebase/",
            "/08-auth-firebase/",
            "/09-auth-firestore/",
            "/26-pinia/",
        ],
    },
    plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],
};

{
    /* <img :src="$withBase('/img/compu-1.gif')"> */
}
