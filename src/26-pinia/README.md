# Pinia + Vite + Firebase 9

En esta sección conoceremos como trabajar con Vite, Pinia y Firebase 9, en nuevo estándar 2022 para Vue.js 🙌

## Vite

-   [Vite web oficial](https://vitejs.dev/): Vite se define como una herramienta de frontend que te ayudará a crear tus proyectos de forma agnóstica (sin atarte a ningún framework concreto) y que su desarrollo y construcción final sea lo más sencilla posible. Está desarrollada por Evan You, el creador de Vue. Actualmente, Vite soporta tanto proyectos vanilla (sin utilizar frameworks), como proyectos utilizando Vue, React, Preact o Lit-element (tanto en versión Javascript, como Typescript). [Fuente](https://lenguajejs.com/automatizadores/vite/guia-tutorial-inicial-de-vite/)
-   [Templates](https://github.com/vitejs/awesome-vite#templates)
-   [Comunidad DEV](https://dev.to/t/vite)

```sh
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

## Install Vue Router

-   [Vue Router](https://router.vuejs.org/installation.html)
-   [Tutorial español](https://adrian-galicia.dev/blog/configurando-vue-router-en-vue-3-vite/)

```sh
npm install vue-router@4
```

router.js

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/about", component: About },
];

const history = createWebHistory();

const router = createRouter({
    history,
    routes,
});

export default router;
```

main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
```

App.vue

```vue
<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link> |
    </nav>
    <router-view />
</template>
```

## Pinia

-   [Pinia web oficial](https://pinia.vuejs.org/)
-   Pinia es una biblioteca de tiendas para Vue, le permite compartir un estado entre componentes/páginas.
-   ​​Aunque Pinia es lo suficientemente bueno para reemplazar a Vuex, reemplazar a Vuex no era su objetivo. Pero luego se volvió tan bueno que el equipo central de Vue.js decidió convertirlo en **Vuex 5**.
-   [vuex vs pinia](https://blog.logrocket.com/pinia-vs-vuex/)

```sh
npm install pinia
```

main.js

```js
import { createPinia } from "pinia";

app.use(createPinia());
```

## STATE

stores/user.js

```js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        userData: "bluuweb",
    }),
});
```

Home.vue

```vue
<template>
    <h1>Home {{ userStore.userData }}</h1>
</template>

<script setup>
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
</script>
```

Login.vue

```vue
<template>
    <h1>Login</h1>
    <h2>{{ pasarMayuscula }}</h2>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const pasarMayuscula = computed(() => userStore.userData.toUpperCase());
</script>
```

## GETTER

-   **Los captadores son solo propiedades computadas detrás de escena**, por lo que no es posible pasarles ningún parámetro. Sin embargo, puede devolver una función del getter para aceptar cualquier argumento: [más info aquí](https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters)

```js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        userData: "bluuweb",
    }),
    getters: {
        userMayuscula(state) {
            return state.userData.toUpperCase();
        },
    },
});
```

Login.vue

```vue
<template>
    <h1>Login</h1>
    <h2>{{ pasarMayuscula }}</h2>
    <h2>{{ userStore.userMayuscula }}</h2>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const pasarMayuscula = computed(() => userStore.userData.toUpperCase());
</script>
```

## ACTIONS

-   Las acciones son el equivalente de los métodos en los componentes. Se pueden definir con la actionspropiedad en `defineStore()` y son perfectos para definir la lógica empresarial:

```js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        userData: "bluuweb",
    }),
    getters: {
        userMayuscula(state) {
            return state.userData.toUpperCase();
        },
    },
    actions: {
        registerUser(name) {
            this.userData = name;
        },
    },
});
```

Register.vue

```vue
<template>
    <h1>Register</h1>
    <button @click="userStore.registerUser('Ignacio')">Acceder</button>
</template>

<script setup>
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
</script>
```

## Firebase 9

-   [install and guies](https://firebase.google.com/docs/web/setup?authuser=0&hl=es)
-   [consola](https://console.firebase.google.com/)

```sh
npm install firebase
```

firebaseConfig.js

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db, auth };
```

## Register

-   [createUserWithEmailAndPassword](https://firebase.google.com/docs/auth/web/password-auth?hl=es&authuser=0#create_a_password-based_account)

```js
import { defineStore } from "pinia";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import router from "../router";

export const useUserStore = defineStore("user", {
    state: () => ({
        userData: {},
        loading: false,
    }),
    actions: {
        async registerUser(email, password) {
            this.loading = true;
            try {
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.userData = { email: user.email, uid: user.uid };
                router.push("/");
            } catch (error) {
                console.log(error);
                this.userData = {};
            } finally {
                this.loading = false;
            }
        },
    },
});
```

Register.vue

```vue
<template>
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit">
        <input type="email" placeholder="Ingrese Correo" v-model.trim="email" />
        <input
            type="password"
            placeholder="Ingrese Contraseña"
            v-model.trim="password"
        />
        <button type="submit">Register</button>
    </form>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const email = ref("bluuweb@test.com");
const password = ref("123123");

const handleSubmit = () => {
    if (!email.value.trim() || !password.value.trim()) {
        return console.log("llena los campos");
    }
    userStore.registerUser(email.value, password.value);
};
</script>
```

App.vue

```vue{9}
<template>
  <h1>Mi super web</h1>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |
    <button>Logout</button>
  </nav>
  <p v-if="useStore.loading">loading...</p>
  <router-view></router-view>
</template>

<script setup>
import {useUserStore} from './stores/user'
const useStore = useUserStore()
</script>
```

## Login

-   [signInWithEmailAndPassword](https://firebase.google.com/docs/auth/web/password-auth?hl=es&authuser=0#sign_in_a_user_with_an_email_address_and_password)

```js
async login(email, password) {
    this.loading = true;
    try {
        const { user } = await signInWithEmailAndPassword(
            email,
            password
        );
        this.userData = { email: user.email, uid: user.uid };
        router.push("/");
    } catch (error) {
        console.log(error);
        this.userData = {};
    } finally {
        this.loading = false;
    }
},
```

Login.vue

```vue
<template>
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
        <input type="email" placeholder="Ingrese Correo" v-model.trim="email" />
        <input
            type="password"
            placeholder="Ingrese Contraseña"
            v-model.trim="password"
        />
        <button type="submit">Login</button>
    </form>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const email = ref("bluuweb@test.com");
const password = ref("123123");

const handleSubmit = () => {
    if (!email.value.trim() || !password.value.trim()) {
        return console.log("llena los campos");
    }
    userStore.loginUser(email.value, password.value);
};
</script>
```

## SignOut

```js
async signOutUser() {
    console.log("entró");
    this.loading = true;
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
    } finally {
        this.userData = {};
        this.loading = false;
        router.push("/login");
    }
},
```

App.vue

```vue
<button @click="useStore.signOutUser">Logout</button>
```

## Ruta

-   [onAuthStateChanged](https://firebase.google.com/docs/auth/web/manage-users?hl=es&authuser=0#get_the_currently_signed-in_user)
-   [stackoverflow promise auth](https://stackoverflow.com/questions/63047603/attempting-to-make-firebase-auth-currentuser-a-promise)
-   [unsubscribe to onauthstatechanged](https://stackoverflow.com/questions/42762443/how-can-i-unsubscribe-to-onauthstatechanged)
-   [api Auth.onAuthStateChanged() v9](https://firebase.google.com/docs/reference/js/auth.auth#authonauthstatechanged)

firebaseConfig.js

```js
auth.currentUserPromise = () =>
    new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                resolve(user);
            },
            (e) => reject(e)
        );
        // Según la documentación, la función onAuthStateChanged() devuelve
        // La función de cancelación de suscripción para el observador
        unsubscribe();
    });
```

router.js

```js
import { createRouter, createWebHistory } from "vue-router";
import { auth } from "./firebaseConfig";
import { useUserStore } from "./stores/user";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

const requireAuth = async (to, from, next) => {
    const user = await auth.currentUserPromise();
    console.log("router user", user);
    if (user) {
        const userStore = useUserStore();
        userStore.userData = { email: user.email, uid: user.uid };
        next();
    } else {
        next("/login");
    }
};

const routes = [
    { path: "/", component: Home, beforeEnter: requireAuth },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
```

## Pronto más videos
