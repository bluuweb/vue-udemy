# 08 AUTH Firebase
Configurar auth en nuestra aplicación de Vue.

## Instalaciones
```
vue create auth-firebase (seleccionar vuex/router/babel)
cd auth-firebase
npm i firebase
```

## Vue.js devtools (opcional)
[https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=es](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=es)

## Firebase
Inicilizar app en consola
```js
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()

export {db, auth}
```

## Ruta Registro
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/registro',
    name: 'Registro',
    component: () => import(/* webpackChunkName: "about" */ '../views/Registro.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

## Registro.vue
```js
<template>
    <div>
        <h1>Registro de usuarios</h1>
        <form>
            <input 
                type="email" 
                placeholder="Ingrese email"
                v-model="email"
            >
            <input 
                type="password" 
                placeholder="Ingrese contraseña"
                v-model="pass1"
            >
            <input 
                type="password" 
                placeholder="Repita contraseña"
                v-model="pass2"
            >
            <button type="submit">Registrar</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Registro',
    data(){
        return{
            email: '',
            pass1: '',
            pass2: ''
        }
    }
}
</script>
```

## store
[https://firebase.google.com/docs/auth/web/start?hl=es-419#sign_up_new_users](https://firebase.google.com/docs/auth/web/start?hl=es-419#sign_up_new_users)
```js
import Vue from 'vue'
import Vuex from 'vuex'

import {auth} from '../firebase'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    usuario: null,
    error: null
  },
  mutations: {
    setUsuario(state, payload){
      state.usuario = payload
    },
    setError(state, payload){
      state.error = payload
    }
  },
  actions: {
    crearUsuario({commit}, usuario){
      auth.createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then(res => {
          console.log(res)
          const usuario = {
            email: res.user.email,
            uid: res.user.uid
          }
          commit('setUsuario', usuario)
          router.push('/')
        })
        .catch(error => {
          console.log(error)
          commit('setError', error)
        })
    }
  },
  modules: {
  }
})
```

## mapAction, mapState
```js
<template>
    <div>
        <h1>Registro de usuarios</h1>
        <form @submit.prevent="crearUsuario({email: email, password: pass1})">
            <input 
                type="email" 
                placeholder="Ingrese email"
                v-model="email"
            >
            <input 
                type="password" 
                placeholder="Ingrese contraseña"
                v-model="pass1"
            >
            <input 
                type="password" 
                placeholder="Repita contraseña"
                v-model="pass2"
            >
            <button type="submit">Registrar</button>
        </form>
        <p>{{error}}</p>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'Registro',
    data(){
        return{
            email: '',
            pass1: '',
            pass2: ''
        }
    },
    created(){

    },
    methods:{
        ...mapActions(['crearUsuario'])
    },
    computed:{
        ...mapState(['error'])
    }
}
</script>
```

## Contraseñas
```js
computed:{
        ...mapState(['error']),
        desactivar(){
            return this.pass1 === this.pass2 && this.pass1.trim() !== ''
        }
    }
```
```html
<button type="submit" :disabled='!desactivar'>Registrar</button>
```

## Inicio.vue
```js
<template>
    <div>
        <h1>Ruta protegida</h1>
    </div>
</template>

<script>
export default {
    name: 'Inicio'
}
</script>
```
## Ingreso.vue
```js
<template>
    <div>
        <h1>Ingreso de usuarios</h1>
        <form @submit.prevent="ingresoUsuario({email:email, password:pass})">
            <input 
                type="email"
                placeholder="Ingrese email"
                v-model="email"
            >
            <input 
                type="password"
                placeholder="Ingrese contraseña"
                v-model="pass"
            >
            <button type="submit">Acceder</button>
        </form>
        <p>{{error}}</p>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Ingreso',
    data() {
        return {
            email: '',
            pass: ''
        }
    },
    created(){

    },
    methods:{
        ...mapActions(['ingresoUsuario'])
    },
    computed:{
        ...mapState(['error'])
    }
}
</script>
```

## ingresoUsuario
[https://firebase.google.com/docs/auth/web/start?hl=es-419#sign_in_existing_users](https://firebase.google.com/docs/auth/web/start?hl=es-419#sign_in_existing_users)
```js
ingresoUsuario({commit}, usuario){
    auth.signInWithEmailAndPassword(usuario.email, usuario.password)
    .then(res => {
        console.log(res)
        const usuario = {
            email: res.user.email,
            uid: res.user.uid
        }
        commit('setUsuario', usuario)
        router.push('/')
    })
    .catch(error => {
        console.log(error)
        commit('setError', error)
    })
}
```

## store
```js
// actions
detectarUsuario({commit}, usuario){
    commit('setUsuario', usuario)
}
```

## main.js
[https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user](https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user)
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import {auth} from './firebase'

auth.onAuthStateChanged(user => {
  if(user){
    console.log(user)
    store.dispatch('detectarUsuario', {email: user.email, uid: user.uid})
  }else{
    console.log(user)
    store.dispatch('detectarUsuario', user)
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

## Inicio.vue
```js
<template>
    <div>
        <h1>Ruta protegida</h1>
        <p>{{usuario}}</p>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Inicio',
    computed:{
        ...mapState(['usuario'])
    }
}
</script>
```

## Cerrar sesión
[https://firebase.google.com/docs/auth/web/password-auth#next_steps](https://firebase.google.com/docs/auth/web/password-auth#next_steps)
Store
```js
// actions
cerrarSesion({commit}){
    auth.signOut()
    router.push('/ingreso')
}
```

App.vue
```js
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/registro">Registro</router-link> |
      <router-link to="/ingreso">Ingreso</router-link> |
      <router-link to="/">Inicio</router-link> |
      <button @click="cerrarSesion">Cerrar Sesión</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods:{
    ...mapActions(['cerrarSesion'])
  }
}
</script>
```

## Router Guard (documentación)
[https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)

Ejemplo Route Meta Fields
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
```

Ejemplo Global before Guards
[https://router.vuejs.org/guide/advanced/navigation-guards.html](https://router.vuejs.org/guide/advanced/navigation-guards.html)
```js
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Rutas protegidas
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

import {auth} from '../firebase'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/registro',
    name: 'Registro',
    component: () => import(/* webpackChunkName: "about" */ '../views/Registro.vue')
  },
  {
    path: '/',
    name: 'Inicio',
    component: () => import(/* webpackChunkName: "about" */ '../views/Inicio.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ingreso',
    name: 'Ingreso',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ingreso.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {

    const usuario = auth.currentUser
    console.log(usuario)

    if (!usuario) {
      next({
        path: '/Ingreso'
      })
    } else {
      next()
    }

  } else {
    next()
  }
})

export default router

```

main.js
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import {auth} from './firebase'

auth.onAuthStateChanged(user => {
  if(user){
    console.log(user)
    store.dispatch('detectarUsuario', {email: user.email, uid: user.uid})
  }else{
    console.log(user)
    store.dispatch('detectarUsuario', user)
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

})
```

## Getters
```js
getters:{
    existeUsuario(state){
        if(state.usuario === null){
            return false
        }else{
            return true
        }
    }
},
```

App.vue
```js
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/registro" v-if="!existeUsuario">Registro</router-link> |
      <router-link to="/ingreso" v-if="!existeUsuario">Ingreso</router-link> |
      <router-link to="/" v-if="existeUsuario">Inicio</router-link> |
      <button @click="cerrarSesion" v-if="existeUsuario">Cerrar Sesión</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  methods:{
    ...mapActions(['cerrarSesion'])
  },
  computed:{
    ...mapGetters(['existeUsuario'])
  }
}
</script>
```











