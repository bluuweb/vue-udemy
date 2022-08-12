# AUTH API Firebase (option api)
Configurar auth en nuestra aplicación de Vue.

## Reglas de Seguridad
```js
{
  "rules": {
    "tareas-api": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

Al final de esta sección:
```json
{
  "rules": {
    "tareas-api": {
      "$uid": {
        ".write": "$uid === auth.uid",
        ".read": "$uid === auth.uid"
      }
    }
  }
}
```

## cargarLocalStorage
Pasar la información del ``App.vue`` a ``Home.vue``
```js
  methods: {
    ...mapActions(['setTareas', 'cargarLocalStorage']),
  },
  created(){
    this.cargarLocalStorage()
  }
```

## Ruta Registro
```js
  const routes = [
  {
    path: '/registro',
    name: 'Registro',
    component: () => import(/* webpackChunkName: "about" */ '../views/Registro.vue')
  }
]
```

## Registro.vue
```vue
<template>
    <h1 class="my-5">Registro</h1>
    <form>
        <input 
            type="email" 
            placeholder="email"
            class="form-control my-2"
            v-model.trim="email"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass1"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass2"
        >
        <button 
            type="submit"
            class="btn btn-primary"
            :disabled="bloquear"
        >
            Registro
        </button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            pass1: '',
            pass2: ''
        }
    },
    computed: {
        bloquear(){
            if(!this.email.includes('@')){
                return true
            }
            if(this.pass1 === this.pass2 && this.pass1 !== '' && this.pass1.length > 5){
                return false
            }
            return true
        }
    }
}
</script>
```

## Activar Registro Firebase
Dentro de la administración de Firebase activar "Sign-in method" => "correo electrónico/contraseña"

## Registrar Firebase
[https://firebase.google.com/docs/reference/rest/auth](https://firebase.google.com/docs/reference/rest/auth)

```
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
```

```js
export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
  },
  actions: {
    async registrarUsuario({ commit }, user) {
      try {
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]`, {
            method: 'POST',
            body: JSON.stringify({
                email: user.email, 
                password: user.password,
                returnSecureToken: true
            })
        })
        const dataDB = await res.json()
        console.log(dataDB)
        if (dataDB.error) {
          return console.log(dataDB.error)
        }
        commit('setUser', dataDB)
        router.push('/')
      } catch (error) {
          console.log(error)
      }
  }
})
```

```html
<form 
  @submit.prevent="registrarUsuario({email: email, password: pass1}"
>
```

```js
import {mapActions} from 'vuex'

export default {
    methods: {
        ...mapActions(['registrarUsuario'])
    }
}
```

## Ingreso.vue
```js
  {
    path: '/ingreso',
    name: 'Ingreso',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ingreso.vue')
  }
```

```vue
<template>
    <h1 class="my-5">Registro</h1>
    <form @submit.prevent="ingresoUsuario({email: email, password: pass1})">
        <input 
            type="email" 
            placeholder="email"
            class="form-control my-2"
            v-model.trim="email"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass1"
        >
        <button 
            type="submit"
            class="btn btn-primary"
            :disabled="bloquear"
        >
            Ingresar
        </button>
    </form>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    data() {
        return {
            email: '',
            pass1: '',
        }
    },
    computed: {
        bloquear(){
            if(!this.email.includes('@')){
                return true
            }
            if(this.pass1.length > 5){
                return false
            }
            return true
        }
    },
    methods: {
        ...mapActions(['ingresoUsuario'])
    }
}
</script>
```

vuex
```js
async ingresoUsuario({ commit }, usuario) {
  console.log(usuario)
},
```

## ingresoUsuario Firebase

```sh
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
```

```js
async ingresoUsuario({ commit }, usuario) {
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]`, {
        method: 'POST',
        body: JSON.stringify({
            email: usuario.email, 
            password: usuario.password,
            returnSecureToken: true
        })
    })
    const dataDB = await res.json()
    console.log(dataDB)
    if (dataDB.error) {
      return console.log(dataDB.error)
    }
    commit('setUser', dataDB)
    router.push('/')
  } catch (error) {
      console.log(error)
  }
},
```

## Leer doc con token
[https://firebase.google.com/docs/database/rest/auth#authenticate_with_an_id_token](https://firebase.google.com/docs/database/rest/auth#authenticate_with_an_id_token)
```
"https://<DATABASE_NAME>.firebaseio.com/users/ada/name.json?auth=<ID_TOKEN>"
```

```js
await fetch(`<DATABASE_NAME>.firebaseio.com/tareas-api.json?auth=${state.user.idToken}`)
```

```js
async cargarLocalStorage({ commit, state }) {
  try {
    const res = await fetch(`<DATABASE_NAME>.firebaseio.com/tareas-api.json?auth=${state.user.idToken}`)
    const db = await res.json()
    
    const arrayDatos = []
    
    for (let id in db){
      // console.log(id)
      // console.log(db[id])
      arrayDatos.push(db[id])
    }
    console.log(arrayDatos)
    commit('cargar', arrayDatos)
  } catch (error) {
    console.log(error)
  }
},
```

## Tareas UID
[https://firebase.google.com/docs/database/security](https://firebase.google.com/docs/database/security)

```json
{
  "rules": {
    "tareas-api": {
      "$uid": {
        ".write": "$uid === auth.uid",
        ".read": "$uid === auth.uid"
      }
    }
  }
}
```

```js
async cargarLocalStorage({ commit, state }) {
      console.log('cargarLocalStorage', state)
      try {
        const res = await fetch(`https://<DATABASE_NAME>/tareas-api/${state.user.localId}.json?auth=${state.user.idToken}`)
        const db = await res.json()
        const arrayDatos = [] 
        for (let id in db){
          arrayDatos.push(db[id])
        }
        console.log(arrayDatos)
        commit('cargar', arrayDatos)
      } catch (error) {
        console.log(error)
      }
    },
    async setTareas({ commit, state }, tarea) {
      console.log('setTareas', state)
      try {
        const res = await fetch(`https://<DATABASE_NAME>/tareas-api/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
          method: 'PUT',
          body: JSON.stringify(tarea)
        })
        const db = await res.json()
        console.log(db)
        commit('set', tarea)
      } catch (error) {
        console.log(error)
      }
    },
```

## Getters
```js
getters: {
  userAutenticado(state) {
    return !!state.user
  }
},
```

## Navbar
```vue
<template>
  <div class="navbar navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
          Formularios
      </router-link>
      <div class="d-flex">
          <router-link 
            class="btn btn-dark" 
            to="/"
            v-if="userAutenticado"
          >
            Tareas
          </router-link>
          <button
            class="btn btn-dark"
            v-if="userAutenticado"
          >
            Cerrar Sesión
          </button>
          <router-link 
            class="btn btn-dark" 
            to="/registro"
            v-if="!userAutenticado"
          >
            Registro
          </router-link>
          <router-link 
            class="btn btn-dark" 
            to="/ingreso"
            v-if="!userAutenticado"
          >
            Ingresar
          </router-link>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userAutenticado'])
  }
}
</script>
```

## Cerrar Sesión
```js
actions: {
  cerrarSesion({ commit }) {
    commit('setUser', null)
    router.push('/ingreso')
  },
```

Navbar.vue
```vue
<template>
  <button
    class="btn btn-dark"
    v-if="userAutenticado"
    @click="cerrarSesion"
  >
    Cerrar Sesión
  </button>     
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  methods: {
    ...mapActions(['cerrarSesion'])
  }
}
</script>
```

## Router Guard (documentación)
[https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)

Ejemplo Global before Guards
[https://router.vuejs.org/guide/advanced/navigation-guards.html](https://router.vuejs.org/guide/advanced/navigation-guards.html)


```js{4}
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar/:id',
    name: 'Editar',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editar.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: () => import(/* webpackChunkName: "about" */ '../views/Registro.vue')
  },
  {
    path: '/ingreso',
    name: 'Ingreso',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ingreso.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to.meta.requiresAuth)
  if (to.meta.requiresAuth) {
    if (store.getters.userAutenticado) {
      next()
    } else {
      next('/ingreso')
    }
  } else {
    next()
  }
})

export default router
```

## LocalStorage
```js
async ingresoUsuario({ commit }, usuario) {
  try {
    ...
    commit('setUser', dataDB)
    localStorage.setItem('user', JSON.stringify(dataDB))
    router.push('/')
  } catch (error) {
      console.log(error)
  }
},
async registrarUsuario({ commit }, user) {
  try {
    ...
    commit('setUser', dataDB)
    localStorage.setItem('user', JSON.stringify(dataDB))
    router.push('/')
  } catch (error) {
      console.log(error)
  }
},
async cargarLocalStorage({ commit, state }) {
  if (localStorage.getItem('user')) {
    commit('setUser', JSON.parse(localStorage.getItem('user')))
  } else {
    return commit('setUser', null)
  }
  ...
```

```js
cerrarSesion({ commit }) {
  commit('setUser', null)
  localStorage.removeItem('user')
  router.push('/ingreso')
},
```

App.vue
```js
methods: {
  ...mapActions(['cargarLocalStorage'])
},
created(){
  this.cargarLocalStorage()
}
```

## Deploy
```
npm run build
```

```
npm install -g firebase-tools
```

```
firebase login
```

```
firebase init
```

```
firebase deploy
```

## Errores
Podemos manejar los errores del formulario:

Vuex
```js
state: {
    error: {tipo: null, mensaje: ''}
},
mutations: {
    setError(state, payload) {
      console.log(payload)
      // REINICIAR
      if (payload === null) {
        return state.error = {tipo: null, mensaje: ''}
      }
      // LOGIN
      if (payload === "EMAIL_NOT_FOUND") {
        return state.error = {
          tipo: 'email',
          mensaje: 'Email no registrado'
        }
      }
      // LOGIN
      if (payload === "INVALID_PASSWORD") {
        return state.error = {
          tipo: 'password',
          mensaje: 'Contraseña no válida'
        }
      }
      // LOGIN
      if (payload === "EMAIL_EXISTS") {
        return state.error = {
          tipo: 'email',
          mensaje: 'Email ya registrado'
        }
      }
      // REGISTRO
      if (payload === "INVALID_EMAIL") {
        return state.error = {
          tipo: 'email',
          mensaje: 'Formato email no válido'
        }
      }
    }
}
```

```js
async ingresoUsuario({ commit }, usuario) {
      try {
        ...
        if (dataDB.error) {
          console.log(dataDB.error)
          return commit('setError', dataDB.error.message)
        }
        commit('setUser', dataDB)
        commit('setError', null)
        localStorage.setItem('user', JSON.stringify(dataDB))
        router.push('/')
      } catch (error) {
          console.log(error)
      }
    },
    async registrarUsuario({ commit }, user) {
      try {
        ...
        if (dataDB.error) {
          console.log(dataDB.error)
          return commit('setError', dataDB.error.message)
        }
        commit('setUser', dataDB)
        commit('setError', null)
        localStorage.setItem('user', JSON.stringify(dataDB))
        router.push('/')
      } catch (error) {
          console.log(error)
      }
    },
```

Ingreso.vue
```vue
<template>
  <h1 class="my-5">Ingreso de Usuarios</h1>
  <div class="alert alert-warning" v-if="error.tipo !== null">
      {{error.mensaje}}
  </div>
  <form @submit.prevent="procesarFormulario">
        <input 
            type="email" 
            placeholder="email"
            class="form-control my-2"
            v-model.trim="email"
            :class="[error.tipo === 'email' ? 'is-invalid' : '']"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass1"
            :class="[error.tipo === 'password' ? 'is-invalid' : '']"
        >
        <button 
            type="submit"
            class="btn btn-primary"
            :disabled="bloquear"
        >
        Ingresar
        </button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            email: '',
            pass1: '',
        }
    },
    computed: {
        bloquear(){
            if(!this.email.includes('@')){
                return true
            }
            if(this.pass1.length > 5){
                return false
            }
            return true
        },
        ...mapState(['error'])
    },
    methods: {
        ...mapActions(['ingresoUsuario']),
        procesarFormulario(){
            await this.ingresoUsuario({email: this.email, password: this.pass1})
            if(this.error.tipo !== null){
                return
            }
            this.email = '';
            this.pass1 = '';
        }
    }
}
</script>
```

Registro.vue
```vue
<template>
  <h1 class="my-5">Registro de Usuarios</h1>
  <div class="alert alert-warning" v-if="error.tipo !== null">
      {{error.mensaje}}
  </div>
  <form @submit.prevent="procesarFormulario">
        <input 
            type="email" 
            placeholder="email"
            class="form-control my-2"
            v-model.trim="email"
            :class="[error.tipo === 'email' ? 'is-invalid' : '']"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass1"
        >
        <input 
            type="password" 
            placeholder="password"
            class="form-control my-2"
            v-model.trim="pass2"
        >
        <button 
            type="submit"
            class="btn btn-primary"
            :disabled="bloquear"
        >
        Registrar
        </button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            email: '',
            pass1: '',
            pass2: ''
        }
    },
    computed: {
        bloquear(){
            if(!this.email.includes('@')){
                return true
            }
            if(this.pass1.length > 5 && this.pass1 === this.pass2){
                return false
            }
            return true
        },
        ...mapState(['error'])
    },
    methods: {
        ...mapActions(['registrarUsuario']),
        procesarFormulario(){
            await this.registrarUsuario({email: this.email, password: this.pass1})
            if(this.error.tipo !== null){
                return
            }
            this.email = '';
            this.pass1 = '';
            this.pass2 = '';
        }
    }
}
</script>
```









