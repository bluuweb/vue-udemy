# Auth & Firestore (Vue 3)
Vamos a comenzar a trabajar con Firestore.

## Instalación

- Crear proyecto con Vue 3/Router
- Intalar las dependencias de Firebase `npm i firebase`
- Instalar `npm i @vueuse/firebase` [https://vueuse.org/](https://vueuse.org/firebase/readme.html)

## Bootstrap (opcional)

- Instalar Bootstrap 5 `npm i bootstrap@next `
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).use(router).mount('#app')
```

## Firebase config
- crear `src/firebase/config.js`

```js
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyAtN_HzTK6TTFPMrB1db_IRhROkuRn2OnI",
    authDomain: "abril-2021-1.firebaseapp.com",
    projectId: "abril-2021-1",
    storageBucket: "abril-2021-1.appspot.com",
    messagingSenderId: "237667483185",
    appId: "1:237667483185:web:432f79700dfcfe5e631f10"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore()
const auth = firebase.auth()
const marcaTiempo = firebase.firestore.FieldValue.serverTimestamp

export {db, auth, firebase, marcaTiempo}
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
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  components: {Navbar},
  setup() {
    
  },
}
</script>
```

## Composables o Hooks
Como vimos anteriormente podemos reutilizar la lógica de cada componente.

## useAuthHook
```js
import { auth, firebase } from "../firebase/config"
import {useRouter} from 'vue-router'

export const useAuthHook = () => {

    const router = useRouter()
    
    const signIn = async() => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await auth.signInWithPopup(provider)
            await router.push('/perfil')
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async() => {
        await auth.signOut()
        await router.push('/')
    }
    
    return {signIn, signOut}

}
```

Navbar.vue
```vue
<template>
  <button class="btn btn-dark" @click="signIn">Acceder</button>
  <button class="btn btn-danger" @click="signOut">Salir</button>       
</template>

<script>
import {useAuthHook} from '../hooks/useAuthHook'

export default {
    setup(){

        const {signIn, signOut} = useAuthHook()

        return {signIn, signOut}
        
    }
}
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
            <router-link to="/" class="navbar-brand">{{titulo}}</router-link>
            <div>
                <button class="btn btn-dark" @click="signIn" v-if="!isAuthenticated">Acceder</button>
                <button class="btn btn-danger" @click="signOut" v-else>Salir</button>
            </div>
        </div>
    </nav>
</template>

<script>
import { computed } from 'vue'
import {useAuthHook} from '../hooks/useAuthHook'
import {useAuth} from '@vueuse/firebase'

export default {
    setup(){

        const {user, isAuthenticated} = useAuth()

        const {signIn, signOut} = useAuthHook()

        const titulo = computed(() => {
            // console.log(user.value)
            // console.log('isAuthenticated', isAuthenticated.value)
            return isAuthenticated.value ? user.value.displayName : 'Firestore'
        })

        return {signIn, signOut, isAuthenticated, titulo}
        
    }
}
</script>
```

## Perfil.vue
```vue
<template>
  <div v-if="isAuthenticated">
    <h1>Ruta protegida</h1>
    <hr>
    <pre>Bienvenido: {{user}}</pre>
  </div>
</template>

<script>
import {useAuth} from '@vueuse/firebase'

export default {
  setup() {
    
    return {...useAuth()}
  },
}
</script>
```

## Router
```js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'

const requiereAuth = (to, from, next) => {
  let user = auth.currentUser
  if (!user) {
    next('/')
  } else {
    next()
  }
}

const sinAutenticacion = (to, from, next) => {
  let user = auth.currentUser
  if (user) {
    next('/perfil')
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    beforeEnter: sinAutenticacion
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import(/* webpackChunkName: "about" */ '../views/Perfil.vue'),
    beforeEnter: requiereAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

## main.js
Esperamos que se detecte al usuario y luego creamos nuestra aplicación.
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css'

import { auth } from './firebase/config'
let app;

// Esperamos que se detecte al usuario y luego creamos nuestra aplicación.
auth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(store).use(router).mount('#app')
    }
})
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
import {useAuth} from '@vueuse/firebase'

export default {
  setup() {
    
    return {...useAuth()}
  },
}
</script>
```

Router
```js
{
  path: '/crud',
  name: 'Crud',
  component: () => import(/* webpackChunkName: "about" */ '../views/Crud.vue'),
  beforeEnter: requiereAuth
}
```
Navbar.vue
```html
 <div>
    <button class="btn btn-sm btn-dark" @click="signIn" v-if="!isAuthenticated">Acceder</button>
    <div v-else>
        <button class="btn btn-sm btn-danger m-1" @click="signOut">Salir</button>
        <router-link class="btn btn-sm btn-dark m-1" to="/crud">CRUD</router-link>
        <router-link class="btn btn-sm btn-dark" to="/perfil">Perfil</router-link>
    </div>
</div>
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

Crud.vue
```vue
<template>
    <div v-if="isAuthenticated">
        <h1>Crud</h1>
        <Cargando v-if="cargando" />
        <div v-else>
          <todo-form></todo-form>
          <ul>
            <li v-for="todo in todos" :key="todo.id">
              <pre>{{todo}}</pre>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
import {useAuth} from '@vueuse/firebase'
import { onMounted, provide, ref, watchEffect } from 'vue'
import Cargando from '../components/Cargando'
import TodoForm from '../components/TodoForm.vue'

import {db} from '../firebase/config'

export default {
  components: {Cargando, TodoForm},
  setup() {
    
    const todos = ref([])
    const cargando = ref(false)
    const reference = db.collection('todos')
    provide('todos', todos)
    provide('reference', reference)

    const {user, isAuthenticated} = useAuth()

    const read = async() => {
      cargando.value = true
      try {
        console.log('user.value.uid', user.value.uid)
        const res = await reference.where("uid", "==", user.value.uid).get()
        todos.value = res.docs.map(doc => ({id: doc.id, ...doc.data()}))
      } catch (error) {
        console.log(error)
      }
      finally {
        cargando.value = false
      }
    }

    onMounted(() => read())

    watchEffect(() => {
      console.log(todos.value)
    })

    return {user, isAuthenticated, todos, cargando}
  },
}
</script>
```

## TodoForm.vue
components/TodoForm.vue
```vue
<template>
  <form @submit.prevent="agregarTodo">
        <input 
            type="text"
            placeholder="Enter para agregar Tarea"
            class="form-control my-3"
            v-model.trim="texto"
        >
  </form>
</template>

<script>
import { inject, ref } from 'vue'
import { marcaTiempo } from '../firebase/config'
import { useAuth } from '@vueuse/firebase'
export default {
    setup(){
        const texto = ref('')
        const {user} = useAuth()

        const todos = inject('todos')
        const reference = inject('reference')

        const agregarTodo = async() => {
            if(!texto.value.trim()){
                return console.log('texto vacio')
            }

            try {
                const todo = {
                    texto: texto.value,
                    fecha: marcaTiempo(),
                    estado: false,
                    uid: user.value.uid
                }

                const res = await reference.add(todo)
                todos.value = [...todos.value, {id: res.id, ...todo}]

                texto.value = ''

            } catch (error) {
                console.log(error)
            } finally {

            }

        }

        return {texto, agregarTodo}
    }
}
</script>
```

## TodoItem.vue
Crud.vue
```html
<todo-item
  v-for="todo in todos" :key="todo.id"
  :todo="todo"
></todo-item>
```

components/TodoItem.vue
```vue
<template>
  <div class="card shadow-sm mb-2">
    <div class="card-body">
      <p class="m-0" :class="{tachado: todo.estado}">{{ todo.texto }}</p>
      <div class="mt-2">
        <button class="btn btn-sm me-2" :class="todo.estado ? 'btn-success' : 'btn-warning'" @click="modificar(todo)">
          {{todo.estado ? 'Finalizada' : 'Pendiente'}}
        </button>
        <button class="btn btn-sm btn-danger" @click="eliminar(todo.id)">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  props: ["todo"],
  setup() {
    const reference = inject("reference");
    const todos = inject("todos");

    const eliminar = async (id) => {
      try {
        if (window.confirm("Está seguro?")) {
          await reference.doc(id).delete();
          todos.value = todos.value.filter((item) => item.id !== id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const modificar = async (todo) => {
      try {
        await reference.doc(todo.id).update({
          estado: !todo.estado,
        });
        todos.value = todos.value.map(item => item.id === todo.id ? {...item, estado: !todo.estado} : item)
      } catch (error) {
        console.log(error);
      }
    };

    return { eliminar, modificar };
  },
};
</script>

<style>
.tachado {
  text-decoration: line-through;
}
</style>
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

## Error.vue
components/Error.vue
```vue
<template>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    Ocurrió un error: {{error}}
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
import {inject} from 'vue'
export default {
    props: ['error'],
    setup(){
      const error = inject('error')
      return {error}
    }
};
</script>
```

Crud.vue
```vue
<template>
    <div v-if="isAuthenticated">
        <h1>Crud</h1>
        <error :error="error" v-if="error" />
        <Cargando v-if="cargando" />
        ...
    </div>
</template>

<script>
...
import Error from '../components/Error.vue'

export default {
  components: {Cargando, TodoForm, TodoItem, Error},
  setup() {
    
    ...

    const error = ref(null)
    provide('error', error)

    const read = async() => {
      cargando.value = true
      try {
        console.log('user.value.uid', user.value.uid)
        const res = await reference.where("uid", "==", user.value.uid).get()
        todos.value = res.docs.map(doc => ({id: doc.id, ...doc.data()}))
      } catch (e) {
        console.log(e)
        error.value = e

      } finally {
        cargando.value = false
      }
    }

    ...

    return {user, isAuthenticated, todos, cargando, error}
  },
}
</script>
```

TodoForm.vue
```js
const error = inject('error')

const agregarTodo = async() => {
    if(!texto.value.trim()){
        error.value = 'Texto vacío'
        return console.log('texto vacio')
    }

    try {
        const todo = {
            texto: texto.value,
            fecha: marcaTiempo(),
            estado: false,
            uid: user.value.uid
        }

        const res = await reference.add(todo)
        todos.value = [...todos.value, {id: res.id, ...todo}]


    } catch (e) {
        console.log(e)
        error.value = e
    } finally {
        texto.value = ''
    }

}
```


