# Quasar 2 + Vite

Quasar es un marco basado en Vue.js

- [Quasar doc](https://quasar.dev/)
- Nos permite crear
    - SPA (aplicación de una sola página)
    - SSR (aplicación renderizada del lado del servidor) (+ PWA opcional)
    - PWA (aplicación web progresiva)
    - BEX (extensión del navegador)
    - Aplicaciones móviles (Android, iOS, …) a través de Cordova o Capacitor
    - Aplicaciones de escritorio multiplataforma (usando Electron)
- Componentes: Hay un componente para casi todas las necesidades de desarrollo web dentro de Quasar. Cada uno de los componentes de Quasar está cuidadosamente diseñado para ofrecerle la mejor experiencia posible a sus usuarios. Quasar está diseñado teniendo en cuenta el rendimiento y la capacidad de respuesta , por lo que la sobrecarga de usar Quasar apenas se nota. Esta atención al rendimiento y al buen diseño es algo que nos enorgullece especialmente.
- Impresionante comunidad en constante crecimiento.
- Gran documentación.

## CLI
- [quasar-cli](https://quasar.dev/start/quasar-cli)

```sh
$ yarn global add @quasar/cli
$ yarn create quasar

# or:

$ npm i -g @quasar/cli
$ npm init quasar
```

## Crear un proyecto
```sh
$ yarn create quasar
# or:
$ npm init quasar
```

```sh
"scripts": {
  "dev": "quasar dev",
  "build": "quasar build",
  "build:pwa": "quasar build -m pwa"
}
```

## Layout

- [layout](https://quasar.dev/layout/layout)
- [layout-builder](https://quasar.dev/layout-builder)

## routes.js

quasar.conf.js
```js
build: {
    vueRouterMode: "history", // available values: 'hash', 'history'
}
```

```js
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "/about", component: () => import("pages/About.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
```

About.vue
```html
<template>
  <q-page padding>
    <h1>About</h1>
  </q-page>
</template>
```

## Style
- [typography](https://quasar.dev/style/typography)
- [color-palette](https://quasar.dev/style/color-palette)
- [spacing](https://quasar.dev/style/spacing)

```html
<template>
  <q-page padding>
    <h1 class="text-h2 text-primary">About</h1>
    <p class="text-pink-3 bg-dark q-py-xl">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
      architecto quaerat amet eum explicabo. Cum, dolorem. Unde delectus vero
      hic, eum debitis doloremque quia dicta temporibus consequuntur esse
      nesciunt quod.
    </p>
  </q-page>
</template>
```

## Grid Row
- [grid/row](https://quasar.dev/layout/grid/row)

```html
<div class="row">
    <div class="col-12 col-sm-6 col-md-3">
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
            aperiam ipsum optio in vero minus atque quae cumque officia facilis
            necessitatibus eaque fuga ut nulla quos autem nesciunt. Cupiditate,
            velit.
        </p>
    </div>
    <div class="col-12 col-sm-6 col-md-3">
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
            aperiam ipsum optio in vero minus atque quae cumque officia facilis
            necessitatibus eaque fuga ut nulla quos autem nesciunt. Cupiditate,
            velit.
        </p>
    </div>
    <div class="col-12 col-sm-6 col-md-3">
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
            aperiam ipsum optio in vero minus atque quae cumque officia facilis
            necessitatibus eaque fuga ut nulla quos autem nesciunt. Cupiditate,
            velit.
        </p>
    </div>
    <div class="col-12 col-sm-6 col-md-3">
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet,
            aperiam ipsum optio in vero minus atque quae cumque officia facilis
            necessitatibus eaque fuga ut nulla quos autem nesciunt. Cupiditate,
            velit.
        </p>
    </div>
</div>
```

## Components
- [material icons google](https://fonts.google.com/icons)
- [materialdesignicons](https://materialdesignicons.com/)

quasar.conf.js
```js
extras: [
    // 'ionicons-v4',
    "mdi-v5",
    // 'fontawesome-v6',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    "roboto-font", // optional, you are not bound to it
    "material-icons", // optional, you are not bound to it
],
```

q-btn
```html
<div class="q-gutter-sm">
    <q-btn color="primary" label="botón"></q-btn>
    <q-btn color="secondary" icon="mdi-send" label="botón"></q-btn>
    <q-btn color="red" icon="mdi-send" label="botón"></q-btn>
    <q-btn color="green" icon-right="mdi-google" label="botón"></q-btn>
</div>
```

q-card
```html
<q-card class="my-card q-mt-lg">
    <q-card-section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga sed error
        placeat, ea atque sit iure incidunt, cum quos sapiente, obcaecati
        quibusdam nesciunt eligendi ipsam iste deserunt soluta. Molestias, esse!
    </q-card-section>
    <q-card-actions>
        <q-btn flat>Action 1</q-btn>
        <q-btn>Action 2</q-btn>
    </q-card-actions>
</q-card>
```

q-dialog
```vue
<template>
<q-btn label="alert" color="primary" @click="alert = true"></q-btn>

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import {ref} from 'vue'

const alert = ref(false)
</script>
```

## Build
```sh
quasar build
```

## Chat
- [Format fecha date.now()](https://www.freecodecamp.org/news/javascript-date-now-how-to-get-the-current-date-in-javascript/)
- [github vuetify](https://github.com/bluuweb/vuetify3-firestore-chat-vue3-firebase)
- [github quasar chat private](https://github.com/bluuweb/quasar-vite-chat-private)

