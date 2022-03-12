# Auth & Firestore (Vue 3)

Vamos a comenzar a trabajar con Firestore.

:::danger
Cuidado al utilizar `<script setup>` ya que aún está en beta, y no se recomienda para producción. Podría traer problemas al desplegar su aplicación en Firebase. Esperemos que a futuro esté estable.
:::

## VSCode

Comparto las extensiones de VSCode de esta sección:

- [Theme](https://marketplace.visualstudio.com/items?itemName=dbanksdesign.nu-disco)
- [Inteligencia Artificial](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)
- [Firebase Rules](https://marketplace.visualstudio.com/items?itemName=toba.vsfire)
- [Bracket color](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

## Repo

- [Repo auth](https://github.com/bluuweb/vue-firebase-auth-currentuser/tree/01-auth-google)
- [Repo auth + firestore](https://github.com/bluuweb/vue-firebase-auth-currentuser/tree/02-firestore)

## Instalación

- Crear proyecto con Vue 3/Router
- Intalar las dependencias de Firebase `npm i firebase`
- Instalar `npm i @vueuse/firebase` [https://vueuse.org/](https://vueuse.org/firebase/readme.html)

## Bootstrap (opcional)

- Instalar Bootstrap 5 `npm i bootstrap@next `

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// JS de Bootstrap 5
import "bootstrap";

// CSS de Bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App).use(router).mount("#app");
```

## Firebase config

- crear `src/firebase.js`

```js
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: xxx,
  authDomain: xxx,
  projectId: xxx,
  storageBucket: xxx,
  messagingSenderId: xxx,
  appId: xxx,
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const marcaTiempo = firebase.firestore.FieldValue.serverTimestamp;

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export { db, auth, firebase, marcaTiempo };
```

## Navbar

- Crear `components/Navbar.vue`

```vue
<template>
  <nav class="navbar navbar-dark bg-primary">
    <div class="container">
      <router-link to="/" class="navbar-brand">Firestore</router-link>
      <div>
        <button class="btn btn-dark">Acceder</button>
        <button class="btn btn-danger">Salir</button>
      </div>
    </div>
  </nav>
</template>
```

App.vue

```vue
<template>
  <Navbar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  components: { Navbar },
  setup() {},
};
</script>
```

## Composables o Hooks

Como vimos anteriormente podemos reutilizar la lógica de cada componente.

## useAuthHook

```js
import { auth, firebase } from "../firebase/config";
import { useRouter } from "vue-router";

export const useAuthHook = () => {
  const router = useRouter();

  const signIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      await router.push("/perfil");
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    await auth.signOut();
    await router.push("/");
  };

  return { signIn, signOut };
};
```

Navbar.vue

```vue
<template>
  <button class="btn btn-dark" @click="signIn">Acceder</button>
  <button class="btn btn-danger" @click="signOut">Salir</button>
</template>

<script>
import { useAuthHook } from "../hooks/useAuthHook";

export default {
  setup() {
    const { signIn, signOut } = useAuthHook();

    return { signIn, signOut };
  },
};
</script>
```

## useAuth

Recuerda instalar:

```
npm i @vueuse/firebase
```

```vue
<template>
  <nav class="navbar navbar-dark bg-primary">
    <div class="container">
      <router-link to="/" class="navbar-brand">{{ titulo }}</router-link>
      <div>
        <button class="btn btn-dark" @click="signIn" v-if="!isAuthenticated">
          Acceder
        </button>
        <button class="btn btn-danger" @click="signOut" v-else>Salir</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useAuthHook } from "../hooks/useAuthHook";
import { useAuth } from "@vueuse/firebase";

export default {
  setup() {
    const { user, isAuthenticated } = useAuth();

    const { signIn, signOut } = useAuthHook();

    const titulo = computed(() => {
      // console.log(user.value)
      // console.log('isAuthenticated', isAuthenticated.value)
      return isAuthenticated.value ? user.value.displayName : "Firestore";
    });

    return { signIn, signOut, isAuthenticated, titulo };
  },
};
</script>
```

## Perfil.vue

```vue
<template>
  <div v-if="isAuthenticated">
    <h1>Ruta protegida</h1>
    <hr />
    <pre>Bienvenido: {{ user }}</pre>
  </div>
</template>

<script>
import { useAuth } from "@vueuse/firebase";

export default {
  setup() {
    return { ...useAuth() };
  },
};
</script>
```

## Router

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import { firebase } from "../firebase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: () =>
      import(/* webpackChunkName: "perfil" */ "../views/Perfil.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/crud",
    name: "Crud",
    component: () => import(/* webpackChunkName: "crud" */ "../views/Crud.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !(await firebase.getCurrentUser())) {
    next("/");
  } else {
    next();
  }
});

export default router;
```

## Cargando.vue

components/Cargando.vue

- [spinners/#flex](https://getbootstrap.com/docs/5.0/components/spinners/#flex)
  components/Cargando.vue

```vue
<template>
  <div class="d-flex justify-content-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>
```

## App.vue
```vue
<template>
  <Cargando v-if="loading" />
  <div v-else>
    <Navbar />
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>


<script>
import Navbar from '@/components/Navbar'
import Cargando from '@/components/Cargando'
import {firebase} from '@/firebase'
import { onMounted, ref } from 'vue'

export default {
  components: {Navbar, Cargando},
  setup(){

    const loading = ref(false)

    onMounted(async() => {
      loading.value = true
      await firebase.getCurrentUser()
      loading.value = false
    })

    return {loading}
  }
}
</script>
```

## CRUD

views/Crud.vue

```vue
<template>
  <div v-if="isAuthenticated">
    <h1>Crud</h1>
  </div>
</template>

<script>
import { useAuth } from "@vueuse/firebase";

export default {
  setup() {
    const { isAuthenticated } = useAuth();
    return { isAuthenticated };
  },
};
</script>
```

Router

```js
{
  path: '/crud',
  name: 'Crud',
  component: () => import(/* webpackChunkName: "crud" */ '../views/Crud.vue'),
  meta: {
    requiresAuth: true
  },
}
```

Navbar.vue

```html
<div>
  <button class="btn btn-sm btn-dark" @click="signIn" v-if="!isAuthenticated">
    Acceder
  </button>
  <div v-else>
    <button class="btn btn-sm btn-danger m-1" @click="signOut">Salir</button>
    <router-link class="btn btn-sm btn-dark m-1" to="/crud">CRUD</router-link>
    <router-link class="btn btn-sm btn-dark" to="/perfil">Perfil</router-link>
  </div>
</div>
```

## useDb.js

```js
import {
    useAuth
} from "@vueuse/firebase";
import {
    db,
    marcaTiempo
} from "../firebase";
import {
    ref
} from "vue";

export const useDb = () => {

    const {
        user
    } = useAuth();

    const cargando = ref(false);
    const reference = db.collection("todos");

    const getTodos = async () => {
        try {
            cargando.value = true;
            const res = await reference.where("uid", "==", user.value.uid).get();
            return res.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            return {
                error: error,
                res: true
              }
        } finally {
            cargando.value = false;
        }
    };

    const agregarTodo = async (texto) => {
        console.log("texto", texto);
        try {
            const todo = {
                texto: texto,
                fecha: marcaTiempo(),
                estado: false,
                uid: user.value.uid,
            };
            const res = await reference.add(todo);

            return {
                id: res.id,
                ...todo
            };
        } catch (error) {
            return {
                error: error,
                res: true
              }
        }
    };

    const eliminarTodo = async (id) => {
        try {
          await reference.doc(id).delete();
      
          return { res: false };
        } catch (error) {
          return {
            error: error,
            res: true,
          };
        }
      };

      const modificarTodo = async (todo) => {
        try {
          await reference.doc(todo.id).update({
            estado: !todo.estado,
          });
      
          return { res: false };
        } catch (error) {
          return {
            error: error,
            res: true,
          };
        }
      };

    return {
        getTodos,
        cargando,
        agregarTodo,
        eliminarTodo,
        modificarTodo
    };

}
```

Crud.vue

```vue
<template>
    <div v-if="isAuthenticated">
        <h1>CRUD</h1>
        <Cargando v-if="cargando" />
        <div v-else>
            <Error v-if="pintarError" />
            <TodoForm />
            <Todo v-for="todo in todos" :key="todo.id" :todo="todo" />
            
            <div v-if="todos.length === 0">
                <p>Sin TODOS</p>
            </div>
        </div>
    </div>
</template>

<script>
import Cargando from '../components/Cargando'
import Error from '../components/Error'
import TodoForm from '../components/TodoForm'
import Todo from '../components/Todo'

import {useAuth} from '@vueuse/firebase'
import {useDb} from '../composables/useDb'
import { computed, onMounted, provide, ref } from 'vue'

export default {
    components: {Cargando, Error, TodoForm, Todo},
    setup(){
        const {isAuthenticated} = useAuth()
        const {cargando, getTodos} = useDb()
        const todos = ref([])
        const error = ref(null)

        provide('todos', todos)
        provide('error', error)

        const pintarError = computed(() => error.value ? true : false)

        onMounted(async() => {
            todos.value = await getTodos()
            if (todos.value.res) {
                error.value = todos.value.error;
            }
        })

        return {isAuthenticated, cargando, todos, pintarError}
    }
}
</script>
```

## TodoForm.vue

TodoForm.vue

```vue
oForm.vue

<template>
  <form @submit.prevent="procesarFormulario">
    <input
      type="text"
      placeholder="Enter para agregar Tarea"
      class="form-control my-3"
      v-model.trim="texto"
    />
  </form>
</template>

<script>
import { inject, ref } from "vue";
import { useDb } from "../composables/useDb";

export default {
  setup() {
    const { agregarTodo } = useDb();

    const texto = ref("");
    const todos = inject("todos");

    const procesarFormulario = async () => {
      if (!texto.value.trim()) {
        console.log("texto vacio");
        return;
      }

      const todo = await agregarTodo(texto.value);

      todos.value = [...todos.value, todo];
      texto.value = "";
    };

    return { texto, procesarFormulario };
  },
};

</script>
```

## Error.vue

```vue
<template>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    Ocurrió un error: {{ error }}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="error = null"
    ></button>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const error = inject("error");
    return { error };
  },
};
</script>
```

## Todo.vue

Todo.vue

```vue
<template>
  <div class="card shadow-sm mb-2">
    <div class="card-body">
      <p class="m-0" :class="{ 'text-decoration-line-through': todo.estado }">
        {{ todo.texto }}
      </p>
      <div class="mt-2">
        <button
          class="btn btn-sm me-2"
          :class="todo.estado ? 'btn-success' : 'btn-warning'"
          @click="modificar(todo)"
          :disabled="bloquear"
        >
          {{ todo.estado ? "Finalizada" : "Pendiente" }}
        </button>
        <button
          class="btn btn-sm btn-danger"
          @click="eliminar(todo.id)"
          :disabled="bloquear"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { useDb } from "../composables/useDb";
export default {
  props: {
    todo: Object,
  },
  setup() {
    const error = inject("error");
    const todos = inject("todos");
    const { eliminarTodo, modificarTodo } = useDb();
    const bloquear = ref(false);

    const eliminar = async (id) => {
      bloquear.value = true;
      const respuesta = await eliminarTodo(id);

      if (respuesta.res) {
        error.value = respuesta.error;
        bloquear.value = false;
        return;
      }

      todos.value = todos.value.filter((item) => item.id !== id);
      bloquear.value = false;
    };

    const modificar = async (todo) => {
      bloquear.value = true;
      const respuesta = await modificarTodo(todo);

      if (respuesta.res) {
        error.value = respuesta.error;
        bloquear.value = false;
        return;
      }

      todos.value = todos.value.map((item) =>
        item.id === todo.id ? { ...item, estado: !todo.estado } : item
      );
      bloquear.value = false;
    };
    return { modificar, eliminar, bloquear };
  },
};
</script>
```



## Reglas Firestore

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

```js
const getTodos = async () => {
  try {
    cargando.value = true;
    const res = await refencia.where("uid", "==", user.value.uid).get();
    return res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.log(error);
    return {
      error: error,
      res: true,
    };
  } finally {
    cargando.value = false;
  }
};
```
