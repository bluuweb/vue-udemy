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
        loadingUser: false,
        loading: false,
    }),
    actions: {
        async registerUser(email, password) {
            this.loadingUser = true;
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
                this.loadingUser = false;
            }
        },
    },
});
```

Register.vue

```vue
<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="handleSubmit">
            <input type="email" placeholder="email" v-model.trim="email" />
            <input
                type="password"
                placeholder="password"
                v-model.trim="password"
            />
            <button type="submit" :disabled="userStore.loadingUser">
                Crear cuenta
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const email = ref("bluuweb1@test.com");
const password = ref("123123");

const handleSubmit = () => {
    if (!email.value || password.value.length < 6) {
        alert("ingresa los campos");
    }

    userStore.registerUser(email.value, password.value);
};
</script>
```

## Login

-   [signInWithEmailAndPassword](https://firebase.google.com/docs/auth/web/password-auth?hl=es&authuser=0#sign_in_a_user_with_an_email_address_and_password)

```js
async login(email, password) {
    this.loadingUser = true;
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
        this.loadingUser = false;
    }
},
```

Login.vue

```vue
<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleSubmit">
            <input type="email" placeholder="email" v-model.trim="email" />
            <input
                type="password"
                placeholder="password"
                v-model.trim="password"
            />
            <button type="submit" :disabled="userStore.loadingUser">
                Acceder
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const email = ref("bluuweb1@test.com");
const password = ref("123123");

const handleSubmit = () => {
    if (!email.value || password.value.length < 6) {
        alert("ingresa los campos");
    }

    userStore.loginUser(email.value, password.value);
};
</script>
```

## SignOut

```js
async signOutUser() {
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

store/user.js (actions)

```js
currentUser() {
    return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(
            auth,
            (user) => {
                if (user) {
                    this.userData = {
                        email: user.email,
                        uid: user.uid,
                    };
                }
                resolve(user);
            },
            (e) => reject(e)
        );
        // Según la documentación, la función onAuthStateChanged() devuelve
        // La función de cancelación de suscripción para el observador
        unsubcribe();
    });
},
```

router.js

```js
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "./stores/user";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loading = true;
    const user = await userStore.currentUser();
    if (user) {
        next();
    } else {
        next("/login");
    }
    userStore.loading = false;
};

const routes = [
    { path: "/", component: Home, beforeEnter: requireAuth },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;
```

app.vue

```vue
<template>
    <div v-if="userStore.loading">loading...</div>
    <div v-else>
        <h1>App</h1>
        <nav>
            <router-link to="/" v-if="userStore.userData">Home</router-link> |
            <router-link to="/login" v-if="!userStore.userData"
                >Login</router-link
            >
            |
            <router-link to="/register" v-if="!userStore.userData"
                >Register</router-link
            >
            |
            <button @click="userStore.signOutUser" v-if="userStore.userData">
                Logout
            </button>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { useUserStore } from "./stores/user";
const userStore = useUserStore();
</script>
```

## Verificar cuenta correo

-   [verification email](https://firebase.google.com/docs/auth/web/manage-users?hl=es&authuser=0#send_a_user_a_verification_email)

stores/user.js

```js
async registerUser(email, password) {
    this.loadingUser = true;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        router.push("/login");
    } catch (error) {
        console.log(error);
    } finally {
        this.loadingUser = false;
    }
},
```

Register.vue

```js
const handleSubmit = async () => {
    if (!email.value || password.value.length < 6) {
        alert("ingresa los campos");
    }

    try {
        await userStore.registerUser(email.value, password.value);
        alert("Verifica email");
    } catch (error) {
        console.log(error);
    }
};
```

router.js

```js
const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loading = true;
    const user = await userStore.currentUser();
    console.log(user);
    if (user && user.emailVerified) {
        next();
    } else {
        next("/login");
    }
    userStore.loading = false;
};
```

## Firestore

firebaseConfig.js

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyBHSBW7EIKq8XvlyfLt3_AQJfoGo4P-w10",
    authDomain: "vite-udemy.firebaseapp.com",
    projectId: "vite-udemy",
    storageBucket: "vite-udemy.appspot.com",
    messagingSenderId: "472497203702",
    appId: "1:472497203702:web:022b5d5fc22b4e522c3fd7",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

export { auth, db };
```

```js
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore/lite";
import { defineStore } from "pinia";
import { auth, db } from "../firebaseConfig";
import { nanoid } from "nanoid";

// import { useUserStore } from "./user";

export const useDatabaseStore = defineStore("database", {
    state: () => ({
        documents: [],
        q: collection(db, "urls"),
        loading: false,
        loadingDoc: false,
    }),
    actions: {
        async getUrls() {
            this.loading = true;
            this.documents = [];
            try {
                const querySnapshot = await getDocs(
                    query(this.q, where("user", "==", auth.currentUser.uid))
                );
                querySnapshot.forEach((doc) => {
                    this.documents.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async addUrl(name) {
            // const userStore = useUserStore();
            this.loadingDoc = true;
            try {
                const objeto = {
                    name: name,
                    short: nanoid(5),
                };
                const docRef = await addDoc(query(this.q), {
                    ...objeto,
                    user: auth.currentUser.uid,
                });
                this.documents.push({ id: docRef.id, ...objeto });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }
        },
        async deleteUrl(id) {
            this.loadingDoc = true;
            try {
                const docRef = doc(db, "urls", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.data().user === auth.currentUser.uid) {
                    await deleteDoc(docRef);
                    this.documents = this.documents.filter(
                        (item) => item.id !== id
                    );
                } else {
                    console.log("no eres el autor");
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }
        },
    },
});
```

```vue
<template>
    <div>
        <h1>Home</h1>
        <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="url" v-model.trimp="url" />
            <button type="submit" :disabled="databaseStore.loadingDoc">
                Agregar
            </button>
        </form>
        <ul v-if="!databaseStore.loading">
            <li v-for="item of databaseStore.documents" :key="item.id">
                {{ item.id }} <br />
                {{ item.name }} <br />
                {{ item.short }}
                <div>
                    <button
                        @click="databaseStore.deleteUrl(item.id)"
                        :disabled="databaseStore.loadingDoc"
                    >
                        Eliminar
                    </button>
                    <button>Editar</button>
                </div>
            </li>
        </ul>
        <div v-else>loading...</div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useDatabaseStore } from "../stores/database";

const databaseStore = useDatabaseStore();

const url = ref("");
const handleSubmit = async () => {
    await databaseStore.addUrl(url.value);
    console.log("agregado");
};

onBeforeMount(async () => {
    await databaseStore.getUrls();
});
</script>
```
