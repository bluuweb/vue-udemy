# Vue Router v.4 (composition api)

## Archivos del curso
- [repo github](https://github.com/bluuweb/router-vue-v4-example-basic)

## Router
- [router.vuejs.org](https://router.vuejs.org/)

Vue Router es el enrutador oficial de Vue.js. Se integra profundamente con el núcleo de Vue.js para facilitar la creación de aplicaciones de una sola página con Vue.js. Las características incluyen:
- Mapeo de rutas anidadas
- Enrutamiento dinámico
- Configuración de enrutador modular basada en componentes
- Parámetros de ruta, consulta, comodines
- Vea los efectos de transición impulsados ​​por el sistema de transición de Vue.js
- Control de navegación detallado
- Enlaces con clases CSS activas automáticas
- Modo historial HTML5 o modo hash
- Comportamiento de desplazamiento personalizable
- Codificación adecuada para URL

## Instalación
```sh
npm init vue@latest
``` 

```sh{4}
✔ Project name: … <your-project-name>
✔ Add TypeScript? … No
✔ Add JSX Support? … No
✔ Add Vue Router for Single Page Application development? Yes
✔ Add Pinia for state management? … No
✔ Add Vitest for Unit testing? … No
✔ Add Cypress for both Unit and End-to-End testing? … No
✔ Add ESLint for code quality? … No
✔ Add Prettier for code formatting? … No

Scaffolding project in ./<your-project-name>...
Done.
```

:::tip
Por defecto quedará en modo [History.pushState()](https://developer.mozilla.org/es/docs/Web/API/History/pushState)
:::

## main.js
```js{3,9}
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

## router-view
- Pintará al componente dinámico que tendremos configurado en router/index.js

## router-link
- Observe cómo, en lugar de usar anclas `<a href="#">`, usamos un componente personalizado ``router-link`` para crear enlaces. Esto permite que Vue Router cambie la URL sin recargar la página, maneje la generación de URL y su codificación.

```html{9-10,15}
<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
```

## router
- [lazy-loaded](https://router.vuejs.org/guide/advanced/lazy-loading.html) dividir los componentes de cada ruta en fragmentos separados y solo cargarlos cuando se visita la ruta. En general, es una buena idea usar siempre importaciones dinámicas para todas sus rutas.

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

## Mi primera ruta
src/views/Pokemons.vue
```vue
<script setup></script>

<template>
    <h1>Pokemons</h1>
</template>
```

router/index.js
```js
{
    path: "/pokemons",
    name: "pokemons",
    component: () => import("../views/PokemonsView.vue"),
},
```

App.vue
```html
<nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/pokemons">Pokemons</RouterLink>
</nav>
```

## Axios
- [axios](https://axios-http.com/es/docs/intro)

```sh
npm i axios
```

PokemonsView.vue
```vue
<script setup>
import axios from "axios";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const pokemons = ref([]);

const getData = async () => {
    try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon");
        pokemons.value = data.results;
    } catch (error) {
        console.log(error);
    }
};

getData();
</script>

<template>
    <h1>Pokemons</h1>
    <ul>
        <li v-for="poke in pokemons">
            <router-link :to="`/pokemons/${poke.name}`">{{
                poke.name
            }}</router-link>
        </li>
    </ul>
</template>
```

## Params
- [params](https://router.vuejs.org/guide/essentials/dynamic-matching.html#dynamic-route-matching-with-params): En Vue Router podemos usar un segmento dinámico en la ruta para lograr eso, lo llamamos un parámetro.
- Un param se indica con dos puntos **:**. Cuando se hace coincidir una ruta, el valor de sus parámetros se expondrá como **this.$route.params** en todos los componentes. 

PokemonsView.vue
```vue
<router-link :to="`/pokemons/${poke.name}`">{{
    poke.name
}}</router-link>
```

```js
{
    path: "/pokemons/:name",
    name: "poke",
    component: () => import("../views/PokeView.vue"),
},
```

PokeView.vue
```vue
<template>
    <h1>Poke: {{ $route.params.name }}</h1>
</template>
```

<!-- ## Cambios params
- Una cosa a tener en cuenta cuando se usan rutas con parámetros es que cuando el usuario navega de **/users/johnnya** **/users/jolyne**, se reutilizará la misma instancia de componente . 
- Dado que ambas rutas generan el mismo componente, esto es más eficiente que destruir la instancia anterior y luego crear una nueva.
- Sin embargo, esto también significa que no se llamará a los enlaces de ciclo de vida del componente .
- Para reaccionar a los cambios de parámetros en el mismo componente, simplemente puede ver cualquier cosa en el objeto $route, en este escenario, el $route.params: -->

## useRoute() useRouter()
- [composition-api](https://router.vuejs.org/guide/advanced/composition-api.html): Debido a que no tenemos acceso al thisinterior de setup, no podemos acceder directamente this.$routero this.$routemás. En su lugar usamos la useRouterfunción:

PokeView.vue
```vue
<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const pokeSprite = ref({});

const back = () => {
    router.push("/pokemons");
};

const getData = async () => {
    console.log(route.params.name);
    try {
        const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${route.params.name}`
        );
        pokeSprite.value = data.sprites.front_default;
    } catch (error) {
        console.log(error);
        pokeSprite.value = null;
    }
};

getData();
</script>

<template>
    <main class="text-center">
        <div v-if="pokeSprite">
            <img :src="pokeSprite" alt="" />
            <h1>Poke: {{ $route.params.name }}</h1>
        </div>
        <h1 v-else>Pokemon no encontrado...</h1>
        <button @click="back()">Volver al listado</button>
    </main>
</template>
```

## 404 Not found Route
- [not-found-route](https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route): usamos una expresión regular personalizada entre paréntesis y marcamos el pathMatch parámetro como opcionalmente repetible.

```js
{
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
},
```

## Active class
- **vue-router** aplica automáticamente dos clases activas, **.router-link-active** y **.router-link-exact-active**, al ``<router-link>`` componente.

Cambiar de forma global:
```js
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
})
```

o también con active-class:
```html
<router-link
    to="/"
    class="btn btn-outline-primary me-2"
    active-class="active"
    >Inicio</router-link
>
```

## Deploy
- Crear archivo **_redirects** en public antes de compilar:

```
/* /index.html 200
```

```sh
npm run build
```

- Subir a netlify 🎉 [netlify.com](https://www.netlify.com/)


## Composables
- Es una función que aprovecha la composition api para encapsular y reutilizar la lógica con estado.

src/composables/getData.js
```js
import axios from "axios";
import { ref } from "vue";

export const useGetData = () => {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const getData = async (url) => {
        loading.value = true;
        try {
            const res = await axios.get(url);
            data.value = res.data;
        } catch (e) {
            error.value = "Error de servidor";
        } finally {
            loading.value = false;
        }
    };

    return { data, error, loading, getData };
};
```

PokemonsView.vue
```vue
<script setup>
import { RouterLink } from "vue-router";

import { useGetData } from "@/composables/getData";

const { data, error, loading, getData } = useGetData();

getData("https://pokeapi.co/api/v2/pokemon");
</script>

<template>
    <h1>Pokemons</h1>
    <p v-if="loading">Cargando...</p>
    <div class="alert alert-danger" v-if="error">Error: {{ error }}</div>
    <div v-if="data">
        <ul class="list-group">
            <li v-for="poke in data.results" class="list-group-item">
                <router-link :to="`/pokemons/${poke.name}`">{{
                    poke.name
                }}</router-link>
            </li>
        </ul>
        <div class="my-2">
            <button
                class="btn btn-outline-danger me-2"
                @click="getData(data.previous)"
                :disabled="data.previous === null"
            >
                Previous
            </button>
            <button
                class="btn btn-outline-primary"
                @click="getData(data.next)"
                :disabled="data.next === null"
            >
                Next
            </button>
        </div>
    </div>
</template>
```

PokeView.vue
```vue
<script setup>
import { useRoute, useRouter } from "vue-router";
import { useGetData } from "@/composables/getData";

const route = useRoute();
const router = useRouter();

const back = () => {
    router.push("/pokemons");
};

const { data, error, loading, getData } = useGetData(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`);

getData();
</script>

<template>
    <div v-if="loading">Cargando...</div>
    <div v-else>
        <div v-if="data">
            <img :src="data.sprites?.front_default" alt="" />
            <h1>Poke name: {{ $route.params.name }}</h1>
        </div>
        <h1 v-if="error">No existe el pokemon</h1>
        <button @click="back" class="btn btn-outline-primary">Volver</button>
    </div>
</template>

```