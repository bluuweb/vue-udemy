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

-   [Inicializa Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart?hl=es#initialize)

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

## Agregar datos manualmente

```js
urls: [
    id1: {
        name: 'https://bluuweb.org',
        short: 'aDgdGd',
        user: 'pQycjKGmIKQ2wL4P1jvkAPhH4gh2'
    },
    id2: {
        name: 'https://firebase.com',
        short: 'aDgdGd',
        user: 'pQycjKGmIKQ2wL4P1jvkAPhH4gh2'
    }
]
```

## Leer doc

-   [Obtén varios documentos de una colección](https://firebase.google.com/docs/firestore/query-data/get-data?hl=es#get_multiple_documents_from_a_collection)

database.js

```js
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { defineStore } from "pinia";
import { auth, db } from "../firebaseConfig";

export const useDatabaseStore = defineStore("database", {
    state: () => ({
        documents: [],
        loading: false,
        loadingDoc: false,
    }),
    actions: {
        async getUrls() {
            if (this.documents.length !== 0) {
                return;
            }
            this.loading = true;
            this.documents = [];
            const q = query(
                collection(db, "urls"),
                where("user", "==", auth.currentUser.uid)
            );
            try {
                const querySnapshot = await getDocs(q);
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
    },
});
```

## Reset store

-   [resetting the state](https://pinia.vuejs.org/core-concepts/state.html#resetting-the-state)
-   [accessing other stores actions](https://pinia.vuejs.org/core-concepts/actions.html#accessing-other-stores-actions)

useUserStore

```js
import { useDatabaseStore } from "./database";
```

```js{3, 12,19,27}
async signOutUser() {
    this.loadingUser = true;
    const databaseStore = useDatabaseStore();
    try {
        await signOut(auth);
        router.push("/login");
    } catch (error) {
        console.log(error);
    } finally {
        this.loadingUser = false;
        this.userData = null;
        databaseStore.$reset();
    }
},
currentUser() {
    return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(
            auth,
            (user) => {
                const databaseStore = useDatabaseStore();
                if (user) {
                    this.userData = {
                        email: user.email,
                        uid: user.uid,
                    };
                } else {
                    this.userData = null;
                    databaseStore.$reset();
                }
                resolve(user);
            },
            (e) => reject(e)
        );
        unsubcribe();
    });
},
```

## Agregar doc

-   [Agrega un documento](https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es#add_a_document)

```js
async addUrl(name) {
    this.loadingDoc = true;
    try {
        const docObjeto = {
            name: name,
            short: nanoid(5),
            user: auth.currentUser.uid
        };
        const q = query(collection(db, 'urls'))
        const docRef = await addDoc(q, docObjeto);
        this.documents.push({ id: docRef.id, ...docObjeto });
    } catch (error) {
        console.log(error);
    } finally {
        this.loadingDoc = false;
    }
},
```

## Borrar doc

-   [Borra documentos](https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=es#delete_documents)
-   [Obtén un documento](https://firebase.google.com/docs/firestore/query-data/get-data?hl=es#get_a_document)

```js
async deleteUrl(id) {
    this.loadingDoc = true;
    try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            throw new Error('no existe el doc')
        }

        if (docSnap.data().user === auth.currentUser.uid) {
            await deleteDoc(docRef);
            this.documents = this.documents.filter(
                (item) => item.id !== id
            );
        } else {
            throw new Error('no eres el autor')
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        this.loadingDoc = false;
    }
},
```

```vue
<template>
    <div>
        <h1>Home</h1>
        <p>Bienvenido: {{ userStore.userData.uid }}</p>
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
                    <button @click="router.push(`/editar/${item.id}`)">
                        Editar
                    </button>
                </div>
            </li>
        </ul>
        <div v-else>loading...</div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { useUserStore } from "../stores/user";

const databaseStore = useDatabaseStore();
const userStore = useUserStore();
const router = useRouter();

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

## Leer único doc

```js
async leerUrl(id) {
    this.loadingDoc = true;
    try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("no existe el doc");
        }

        if (docSnap.data().user === auth.currentUser.uid) {
            return docSnap.data().name;
        } else {
            throw new Error("no eres el autor");
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        this.loadingDoc = false;
    }
},
```

router.js

```js
const routes = [
    { path: "/", component: Home, beforeEnter: requireAuth },
    { path: "/editar/:id", component: Editar, beforeEnter: requireAuth },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
];
```

```vue
<template>
    <div>
        <h1>Editar</h1>
        <p v-if="databaseStore.loadingDoc">Loading doc...</p>
        <form @submit.prevent="handleSubmit" v-else>
            <input type="text" placeholder="url" v-model.trimp="url" />
            <button type="submit" :disabled="databaseStore.loadingDoc">
                Editar
            </button>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";

const route = useRoute();
const databaseStore = useDatabaseStore();
const url = ref("");

onMounted(async () => {
    url.value = await databaseStore.leerUrl(route.params.id);
});

const handleSubmit = async () => {
    await databaseStore.updateUrl(route.params.id, url.value);
};
</script>
```

## Update doc

-   [Actualiza un documento](https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es#update-data)

```js
async updateUrl(id, name) {
    this.loadingDoc = true;
    try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("no existe el doc");
        }

        if (docSnap.data().user === auth.currentUser.uid) {
            await updateDoc(docRef, {
                name: name,
            });
            this.documents = this.documents.map((item) =>
                item.id === id ? { ...item, name: name } : item
            );
        } else {
            throw new Error("no eres el autor");
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        this.loadingDoc = false;
    }
},
```

## Rules

-   [Reglas de seguridad versión 2](https://firebase.google.com/docs/firestore/security/get-started?hl=es)
-   [Reglas básicas de lectura y escritura](https://firebase.google.com/docs/firestore/security/rules-structure?hl=es#basic_readwrite_rules)
-   [Autenticación](https://firebase.google.com/docs/firestore/security/rules-conditions?hl=es#authentication)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /urls/{id} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.user;
      allow create: if request.auth != null;
    }
  }
}
```

## Deploy

```
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

:::tip ¿ejecución de scripts está deshabilitada en este sistema?
Ejecutar windows + R –> gpedit.msc.
Ir a Plantillas administrativas> Componentes de Windows> Windows PowerShell>
Seleccionar Activar la ejecución de scripts, click derecho, editar.
Seleccionar Habilitada y Permitir todos los scripts, Aplicar.
:::

## Ant Design Vue

-   [andv next](https://next.antdv.com/docs/vue/introduce)

```sh
npm install ant-design-vue@next --save
```

-   [unplugin components](https://github.com/antfu/unplugin-vue-components)

```sh
npm i unplugin-vue-components
```

vite.config.js

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
});
```

```vue
<a-button type="primary" size="large">Boton</a-button>
```

## Layout

-   [layout](https://next.antdv.com/components/layout)
-   [current-route](https://stackoverflow.com/questions/63800831/how-to-access-current-route-name-reactively-in-vue-composition-api-in-typescript)
-   [v-model emit event](https://www.cursosdesarrolloweb.es/blog/v-model-en-vue-3/)

Login.vue

```vue
<template>
    <a-layout>
        <a-layout-header v-if="!userStore.loadingSession">
            <a-menu
                mode="horizontal"
                theme="dark"
                :style="{ lineHeight: '64px' }"
                v-model:selectedKeys="selectedKeys"
            >
                <a-menu-item v-if="userStore.userData" key="home">
                    <router-link to="/">Home</router-link>
                </a-menu-item>
                <a-menu-item v-if="!userStore.userData" key="login">
                    <router-link to="/login">Login</router-link>
                </a-menu-item>
                <a-menu-item v-if="!userStore.userData" key="register">
                    <router-link to="/register">Register</router-link>
                </a-menu-item>
                <a-menu-item
                    @click="userStore.logoutUser"
                    v-if="userStore.userData"
                    key="logout"
                >
                    Logout
                </a-menu-item>
            </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <div
                :style="{
                    background: '#fff',
                    padding: '24px',
                    minHeight: '280px',
                }"
            >
                <div v-if="userStore.loadingSession">loading user...</div>
                <router-view></router-view>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();
const route = useRoute();
const selectedKeys = ref([]);

watch(
    () => route.name,
    () => {
        // console.log(route.name)
        selectedKeys.value = [route.name];
    }
);
</script>
```

## Grid

-   [grid](https://next.antdv.com/components/grid)
-   [form](https://next.antdv.com/components/form)

```vue
<template>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
                name="basic"
                layout="vertical"
                autocomplete="off"
            >
                <a-form-item
                    label="Email"
                    name="email"
                    :rules="[
                        {
                            required: true,
                            type: 'email',
                            message: 'Por favor escriba un email válido',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.email"></a-input>
                </a-form-item>
                <a-form-item
                    label="Password"
                    name="password"
                    :rules="[
                        {
                            required: true,
                            min: 6,
                            message:
                                'Por favor escriba una contraseña de 6 carácteres',
                        },
                    ]"
                >
                    <a-input-password
                        v-model:value="formState.password"
                    ></a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit"
                        >Acceder</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const formState = reactive({
    password: "",
    email: "bluuweb1@test.com",
});

const onFinish = async (values) => {
    console.log("Success:", values);
    await userStore.loginUser(formState.email, formState.password);
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
</script>
```

Register.vue

```vue
<template>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="formState"
                @finishFailed="onFinishFailed"
                @finish="onFinish"
                name="basicTwo"
                layout="vertical"
                autocomplete="off"
            >
                <a-form-item
                    label="Email"
                    name="email"
                    :rules="[
                        {
                            required: true,
                            type: 'email',
                            message: 'Por favor escriba un email válido',
                        },
                    ]"
                >
                    <a-input v-model:value="formState.email"></a-input>
                </a-form-item>
                <a-form-item
                    label="Password"
                    name="password"
                    :rules="[
                        {
                            required: true,
                            min: 6,
                            message:
                                'Por favor escriba una contraseña de 6 carácteres',
                        },
                    ]"
                >
                    <a-input-password
                        v-model:value="formState.password"
                    ></a-input-password>
                </a-form-item>
                <a-form-item
                    label="Repita Password"
                    name="repassword"
                    :rules="{ validator: validateRePass }"
                >
                    <a-input-password
                        v-model:value="formState.repassword"
                    ></a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit"
                        >Acceder</a-button
                    >
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const formState = reactive({
    password: "",
    repassword: "",
    email: "bluuweb1@test.com",
});

const validateRePass = async (_rule, value) => {
    if (value === "") {
        return Promise.reject("Por favor repita contraseña");
    }
    if (value !== formState.password) {
        return Promise.reject("No coinciden las contraseñas");
    }
    Promise.resolve();
};

const onFinish = async (values) => {
    console.log("Success:", values);
    await userStore.registerUser(values.email, values.password);
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
</script>
```

## Errores Fire Auth

-   [lista códigos](https://firebase.google.com/docs/reference/js/auth#autherrorcodes)

```js
async loginUser(email, password) {
    this.loadingUser = true;
    try {
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        this.userData = { email: user.email, uid: user.uid };
        router.push("/");
    } catch (error) {
        // console.log(error.code);
        return error.code;
    } finally {
        this.loadingUser = false;
    }
},
```

Login.vue

```vue
<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";

const userStore = useUserStore();

const formState = reactive({
    password: "",
    email: "bluuweb1@test.com",
});

const onFinish = async (values) => {
    console.log("Success:", values);
    const res = await userStore.loginUser(formState.email, formState.password);
    if (res === "auth/wrong-password") {
        message.error("credenciales no válidas");
    }
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
</script>
```

```js
async registerUser(email, password) {
    this.loadingUser = true;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        router.push("/login");
    } catch (error) {
        // console.log(error);
        return error.code;
    } finally {
        this.loadingUser = false;
    }
},
```

Register.vue

```js
const onFinish = async (values) => {
    console.log("Success:", values);
    const res = await userStore.registerUser(values.email, values.password);
    if (!res) {
        return message.success("Revisa tu correo electrónico para continuar");
    }
    switch (res) {
        case "auth/email-already-in-use":
            message.error("Correo ya registrado");
            break;
    }
};
```

## AddForm.vue

components/AddForm.vue

```vue
<template>
    <a-form
        :model="formState"
        @finish="onFinish"
        name="basicAdd"
        layout="vertical"
        autocomplete="off"
    >
        <a-form-item
            label="Ingrese URL"
            name="url"
            :rules="[
                {
                    required: true,
                    whitespace: true,
                    pattern: regExpUrl,
                    message: 'Ingresa una URL válida',
                },
            ]"
        >
            <a-input v-model:value="formState.url"></a-input>
        </a-form-item>
        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :loading="databaseStore.loadingURL"
            >
                Agregar
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue";
import { regExpUrl } from "../utils/regExpUrl";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();
const formState = reactive({
    url: "",
});

const onFinish = async (values) => {
    // console.log("success");
    const res = await databaseStore.addUrl(formState.url);
    formState.url = "";
    if (!res) {
        message.success("URL agregada con éxito");
    }
};
</script>
```

database.js

```js
async addUrl(name) {
    this.loadingURL = true;
    try {
        const objetoDoc = {
            name: name,
            short: nanoid(6),
            user: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, "urls"), objetoDoc);
        this.documents.push({
            ...objetoDoc,
            id: docRef.id,
        });
    } catch (error) {
        console.log(error.code);
    } finally {
        this.loadingURL = false;
    }
},
```

utils/regExpUrl.js

```js
const regExpUrl =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

export { regExpUrl };
```

## Card

```vue
<template>
    <div>
        <h1>Home</h1>

        <add-form></add-form>

        <a-spin v-if="databaseStore.loadingDoc" />

        <a-space direction="vertical" style="width: 100%">
            <a-card
                v-for="item of databaseStore.documents"
                :key="item.id"
                :title="item.short"
            >
                <template #extra>
                    <a-space>
                        <a-button @click="router.push(`/editar/${item.id}`)"
                            >Editar</a-button
                        >
                        <a-popconfirm
                            title="¿Estás seguro?"
                            ok-text="Yes"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                            @cancel="cancel"
                        >
                            <a-button danger>Eliminar</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
                <p>{{ item.name }}</p>
            </a-card>
        </a-space>
    </div>
</template>

<script setup>
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();
const router = useRouter();

const confirm = (id) => {
    console.log(id);
    databaseStore.deleteUrl(id);
    message.success("Eliminado");
};

const cancel = (e) => {
    console.log(e);
    message.error("No se eliminó");
};

databaseStore.getUrls();
</script>
```

## View Editar

```vue
<template>
    <div>
        <h1>Editar id: route.params</h1>
        <a-form
            :model="formState"
            @finish="onFinish"
            name="basicAdd"
            layout="vertical"
            autocomplete="off"
        >
            <a-form-item
                label="Ingrese URL"
                name="url"
                :rules="[
                    {
                        required: true,
                        whitespace: true,
                        pattern: regExpUrl,
                        message: 'Ingresa una URL válida',
                    },
                ]"
            >
                <a-input v-model:value="formState.url"></a-input>
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="databaseStore.loadingURL"
                    >
                        Editar
                    </a-button>
                    <a-button danger @click="router.push('/')">
                        Volver
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { regExpUrl } from "../utils/regExpUrl";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();

const formState = reactive({
    url: "",
});

const route = useRoute();
const router = useRouter();

const onFinish = async () => {
    const res = await databaseStore.updateUrl(route.params.id, formState.url);
    formState.url = "";
    if (!res) {
        return message.success("URL modificada con éxito");
    }
    message.error(res);
};

onMounted(async () => {
    formState.url = await databaseStore.leerUrl(route.params.id);
});
</script>
```

App.vue

```css
.container {
    background-color: rgb(255, 255, 255);
    padding: 24px;
    min-height: calc(100vh - 64px);
}
.text-center {
    text-align: center;
}
```

## Perfil User

-   [Actualiza el perfil de un usuario](https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile)
-   [upload-files](https://firebase.google.com/docs/storage/web/upload-files)

Crear collection users

:::warning Importante

No olvidar el await en currentUser

```js
await this.getUser(user);
```

Ya que así todas las vistas protegidas esperarán la información del usuario, antes de ser pintada.
:::

```js
async getUser(user) {
    try {
        const objetoUser = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
        };
        const docRef = doc(db, "users", user.uid);
        const docSpan = await getDoc(docRef);
        if (docSpan.exists()) {
            console.log("existe");
            this.userData = { ...docSpan.data(), uid: docSpan.id };
        } else {
            console.log("no existe");
            await setDoc(docRef, objetoUser);
            this.userData = objetoUser;
        }
    } catch (error) {
        console.log(error);
    }
},
async loginUser(email, password) {
    this.loadingUser = true;
    try {
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        this.getUser(user);

        router.push("/");
    } catch (error) {
        // console.log(error.code);
        return error.code;
    } finally {
        this.loadingUser = false;
    }
},
currentUser() {
    return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
            auth,
            async (user) => {
                if (user) {
                    await this.getUser(user);
                } else {
                    this.userData = null;
                    const databaseStore = useDatabaseStore();
                    databaseStore.$reset();
                }
                resolve(user);
            },
            (e) => reject(e)
        );
        unsuscribe();
    });
},
```

Reglas de seguridad

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /urls/{id} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.user;
      allow create: if request.auth != null;
    }
    match /users/{id} {
      allow read, update, delete: if request.auth != null && request.auth.uid == id;
      allow create: if request.auth != null;
    }
  }
}
```

routes.js

```js
{
    name: "perfil",
    path: "/perfil",
    component: Perfil,
    beforeEnter: requireAuth,
},
```

App.vue

```html
<a-menu-item v-if="userStore.userData" key="perfil">
    <router-link to="/perfil">Perfil</router-link>
</a-menu-item>
```

```vue
<template>
    <h1 class="text-center">Administra aquí tu perfil</h1>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="userStore.userData"
                @finish="onFinish"
                name="basicPerfilForm"
                layout="vertical"
                autocomplete="off"
            >
                <a-form-item
                    label="Email (no editable)"
                    name="email"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Por favor escriba un nombre válido',
                        },
                    ]"
                >
                    <a-input
                        disabled
                        v-model:value="userStore.userData.email"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    label="Nombre de usuario"
                    name="displayName"
                    :rules="[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Por favor escriba un nombre válido',
                        },
                    ]"
                >
                    <a-input
                        v-model:value="userStore.userData.displayName"
                    ></a-input>
                </a-form-item>

                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :max-count="1"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <a-button> Subir foto de perfil </a-button>
                </a-upload>

                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="userStore.loadingUser"
                    >
                        Actualizar
                    </a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const fileList = ref([]);

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const handleChange = (info) => {
    // validación de jpg y png
    if (info.file.status !== "uploading") {
        const isJpgOrPng =
            info.file.type === "image/jpeg" || info.file.type === "image/png";

        if (!isJpgOrPng) {
            message.error("Solo .jpg o .png");
            handleRemove(info.file);
            return;
        }

        const isLt2M = info.file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error("Máximo 2MB!");
            handleRemove(info.file);
            return false;
        }
    }

    // solo permitir una imagen
    let resFileList = [...info.fileList];
    resFileList = resFileList.slice(-1);
    resFileList = resFileList.map((file) => {
        if (file.response) {
            file.url = file.response.url;
        }

        return file;
    });
    console.log(resFileList);
    fileList.value = resFileList;
};

const beforeUpload = (file) => {
    return false;
};

const onFinish = async (value) => {
    fileList.value.forEach((file) => {
        userStore.updateUser(file);
    });
};
</script>
```

firebaseConfig.js

```js
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);

export { auth, db, storage };
```

userStore

```js
async updateUser(file) {
    console.log(file.type);
    console.log(file.name);
    console.log(file.size);
    console.log(file);
    try {
        const storageRef = ref(storage, `${this.userData.uid}/perfil`);
        const spanshot = await uploadBytes(
            storageRef,
            file.originFileObj
        );
        const refURL = await getDownloadURL(spanshot.ref);
        console.log(refURL);
    } catch (error) {
        console.log(error);
    }
},
```

:::warning Reglas de seguridad
Pasar las reglas a true
:::
