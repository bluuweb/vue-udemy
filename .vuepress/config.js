module.exports = {
  title: 'Vue Udemy',
  description: 'Aprende Vue.js con bluuweb',
  base: '/vue-udemy/',
  locales:{
    '/':{
      lang: 'es-ES'
    }
  },
  themeConfig:{
    nav: [
      { text: 'Guía', link: '/' },
      // { text: 'Guia', link: '/docs/' },
      { text: 'Youtube', link: 'https://youtube.com/bluuweb' },
      { text: 'Curso Premium', link: 'http://curso-vue-js-udemy.bluuweb.cl' }
    ],
    sidebar:
      [
        '/',
        '/07-crud-firebase/',
        '/08-auth-firebase/',
        '/09-auth-firestore/',
      ]
  }
 
}