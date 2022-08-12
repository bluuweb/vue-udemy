# Pinia (composition api)

## Archivos del curso
- [repo github](https://github.com/bluuweb/router-vue-v4-example-basic/tree/02-pinia)

## Pinia
- [pinia.vuejs.org](https://pinia.vuejs.org/)
- [vuex.vuejs.org](https://vuex.vuejs.org/)
- La biblioteca de administración de estado oficial para Vue ha cambiado a Pinia . 
- Pinia tiene casi exactamente la misma API o mejorada que Vuex 5, descrita en Vuex 5 RFC . 
- Simplemente podría considerar Pinia como Vuex 5 con un nombre diferente. 
- Pinia también funciona con Vue 2.x.

## ¿Por qué debería usar Pinia?
- Pinia es una biblioteca de tiendas para Vue, le permite compartir un estado entre componentes/páginas.
- Si está familiarizado con la API de composición, es posible que esté pensando que ya puede compartir un estado global con un simple archivo ``export const state = reactive({})``. Esto es cierto para las aplicaciones de una sola página, pero expone su aplicación a vulnerabilidades de seguridad si se representa en el lado del servidor. 

## ¿Qué es una tienda?

- Una tienda (como Pinia) es una entidad que tiene estado y lógica comercial que no está vinculada a su árbol de componentes. En otras palabras, alberga el estado global . - Es un poco como un componente que siempre está ahí y que todos pueden leer y escribir. 
- Tiene tres conceptos , el estado (state), captadores (getters) y acciones (actions) y es seguro asumir que estos conceptos son el equivalente de data y computed en methods componentes.

## ¿Cuándo debo usar una tienda?
- Una tienda debe contener datos a los que se pueda acceder a través de su aplicación. Esto incluye datos que se utilizan en muchos lugares, por ejemplo, la información del usuario que se muestra en la barra de navegación, así como los datos que deben conservarse a través de las páginas, por ejemplo, un formulario de varios pasos muy complicado.
- Por otro lado, debe evitar incluir en la tienda datos locales que podrían estar alojados en un componente, por ejemplo, la visibilidad de un elemento local en una página.
- No todas las aplicaciones necesitan acceso a un estado global, pero si la tuya lo necesita, Pinia te hará la vida más fácil.

## Instalación
- [getting-started](https://pinia.vuejs.org/getting-started.html)

```sh
npm i pinia
```

main.js
```js{4,7,10}
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount("#app");
```

## Definición de tienda (option api)
- [core-concepts](https://pinia.vuejs.org/core-concepts/)
- Antes de profundizar en los conceptos básicos, debemos saber que una tienda se define usando defineStore() y que requiere un nombre único ,pasado como primer argumento:

src/store/counter.js
```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
    // data reactiva
    state: () => ({
        count: 0,
    }),
    // methods
    actions: {
        increment() {
            this.count++;
        },
    },
    // computed
    getters: {
        double: (state) => state.count * 2,
    },
});
```

## Uso tienda
```vue
<script setup>
import { useCounterStore } from "@/store/counter";

const useCounter = useCounterStore();
</script>

<template>
    <h1>Home Counter: {{ useCounter.count }}</h1>
    <h2>Double: {{ useCounter.double }}</h2>
    <button @click="useCounter.increment">Increment</button>
</template>
```

## Composition API
- También existe otra sintaxis posible para definir tiendas.
- De manera similar a la función de configuración de Vue Composition API , podemos pasar una función que define propiedades y métodos reactivos y devuelve un objeto con las propiedades y métodos que queremos exponer.

```js
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);

    const increment = () => count.value++;

    const double = computed(() => count.value * 2);

    return {
        count,
        increment,
        double,
    };
});
```

Al momento de configurar:
- ref()s se convierten en statepropiedades
- computed() se convierte engetters
- function() se convierte enactions

Las tiendas de configuración brindan mucha más flexibilidad que las Tiendas de opciones , ya que puede crear observadores dentro de una tienda y usar libremente cualquier componente . Sin embargo, tenga en cuenta que el uso de composables obtendrá un SSR más complejo.

¿Qué sintaxis debo elegir?
Al igual que con la API de composición y la API de opciones de Vue , elija la que le resulte más cómoda.

## storeToRefs

Tenga en cuenta que store es un objeto envuelto con **reactive**, lo que significa que no es necesario escribir .**value** después de los getters pero, como props en setup, **no podemos desestructurarlo:**

```vue
<script setup>
import { useCounterStore } from "@/store/counter";

const useCounter = useCounterStore();

// ❌ This won't work because it breaks reactivity
const {count, double} = useCounter

</script>
```

- Para extraer propiedades de la tienda manteniendo su reactividad, debe usar **storeToRefs().**
- Creará referencias para cada propiedad reactiva. Esto es útil cuando solo usa el estado de la tienda pero no llama a ninguna acción.
- Tenga en cuenta que puede desestructurar acciones directamente desde la tienda, ya que también están vinculadas a la tienda:

```vue
<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/store/counter";

const useCounter = useCounterStore();

const { count, double } = storeToRefs(useCounter);
const { increment } = useCounter;
</script>

<template>
    <h1>Home Counter: {{ count }}</h1>
    <h2>Double: {{ double }}</h2>
    <button @click="increment">Increment</button>
</template>
```

## Práctica

router/index.js
```js
{
    path: "/favoritos",
    name: "favoritos",
    component: () => import("../views/FavoritosView.vue"),
},
```

store/favoritos.js
```js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFavoritoStore = defineStore("favoritos", () => {
    const favoritos = ref([]);

    if (localStorage.getItem("favoritos")) {
        favoritos.value = JSON.parse(localStorage.getItem("favoritos"));
    }

    const add = (poke) => {
        console.log(poke);
        favoritos.value.push(poke);
        localStorage.setItem("favoritos", JSON.stringify(favoritos.value));
    };

    const remove = (id) => {
        favoritos.value = favoritos.value.filter((item) => item.id !== id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos.value));
    };

    const findPoke = (name) =>
        favoritos.value.find((item) => item.name === name);

    return {
        favoritos,
        add,
        remove,
        findPoke,
    };
});
```

PokeView.vue
```vue
<script setup>
import { useRoute, useRouter } from "vue-router";
import { useGetData } from "@/composables/getData";
import { useFavoritoStore } from "@/store/favoritos";

const route = useRoute();
const router = useRouter();
const useFavorito = useFavoritoStore();

const { add, findPoke } = useFavorito;

const back = () => {
    router.push("/pokemons");
};

const { data, error, loading, getData } = useGetData(
    `https://pokeapi.co/api/v2/pokemon/${route.params.name}`
);

getData();
</script>

<template>
    <div v-if="loading">Cargando...</div>
    <div v-else>
        <div v-if="data">
            <img :src="data.sprites?.front_default" alt="" />
            <h1>Poke name: {{ $route.params.name }}</h1>
            <button
                :disabled="findPoke(data.name)"
                @click="add(data)"
                class="btn btn-outline-primary mb-2"
            >
                Agregar Favorito
            </button>
        </div>
        <h1 v-if="error">No existe el pokemon</h1>
        <button @click="back" class="btn btn-outline-danger">Volver</button>
    </div>
</template>
```

FavoritosView.vue
```vue
<script setup>
import { useFavoritoStore } from "@/store/favoritos";
import { storeToRefs } from "pinia";

const useFavorito = useFavoritoStore();

const { favoritos } = storeToRefs(useFavorito);
const { remove } = useFavorito;
</script>

<template>
    <h1>Favoritos</h1>
    <p v-if="favoritos.length === 0">Sin favoritos</p>
    <ul class="list-group" v-else>
        <li v-for="poke in favoritos" :key="poke.id" class="list-group-item">
            <div>{{ poke.id }} - {{ poke.name }}</div>
            <router-link
                class="btn btn-sm btn-outline-primary me-2"
                :to="`/pokemons/${poke.name}`"
            >
                Más info
            </router-link>
            <button
                class="btn btn-sm btn-outline-danger"
                @click="remove(poke.id)"
            >
                Eliminar
            </button>
        </li>
    </ul>
</template>
```
