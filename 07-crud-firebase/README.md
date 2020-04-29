# 07 CRUD Firebase

Mi primer CRUD con Vue Router, Vuex y Firebase.

## Vue CLI 4

```
vue create nombre-proyecto
```

## Firebase

```
npm i firebase
```

[https://firebase.google.com/](https://firebase.google.com/)

## firebase.js

```js
import firebase from "firebase/app";
import firestore from "firebase/firestore";

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
```

Router

```js
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Inicio.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

Inicio.vue

```vue
<template>
  <div>
    <h1>Lista de Tareas</h1>
  </div>
</template>
```

App.vue

```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <router-view />
  </div>
</template>
```

## Vuex
[https://firebase.google.com/docs/firestore/query-data/get-data?hl=es-419#get_all_documents_in_a_collection](https://firebase.google.com/docs/firestore/query-data/get-data?hl=es-419#get_all_documents_in_a_collection)
```js
state: {
    tareas: []
},
mutations: {
    setTareas(state, payload){
        state.tareas = payload
    }
},
actions: {
    getTareas({commit}){
        const tareas = []
        db.collection('tareas').get()
        .then(res => {
            res.forEach(doc => {
                console.log(doc.id)
                console.log(doc.data())
                let tarea = doc.data()
                tarea.id = doc.id
                tareas.push(tarea)
            })
            commit('setTareas', tareas)
        })
    }
},
```

## Inicio.vue
```vue
<template>
    <div>
        <h1>Lista de Tareas</h1>
        <ul>
            <li v-for="(item, index) in tareas" :key="index">
                {{item.id}} - {{item.nombre}}
            </li>
        </ul>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'Inicio',
    created(){
        this.getTareas()
    },
    methods:{
        ...mapActions(['getTareas'])
    },
    computed:{
        ...mapState(['tareas'])
    }
}
</script>
```

## Editar Tarea
[https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es-419#update-data](https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es-419#update-data)

```js
{
    path: '/editar/:id',
    name: 'Editar',
    component: () => import(/* webpackChunkName: "editar" */ '../views/Editar.vue')
}
```

Editar.vue
```vue
<template>
    <div>
        <h1>Editar</h1>
        {{id}} - {{tarea}}
        <form @submit.prevent="editarTarea(tarea)">
            <input type="text" v-model="tarea.nombre">
            <button>Editar</button>
        </form>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'Editar',
    data(){
        return {
            id: this.$route.params.id
        }
    },
    created(){
        this.getTarea(this.id)
    },
    methods:{
        ...mapActions(['getTarea', 'editarTarea'])
    },
    computed:{
        ...mapState(['tarea'])
    }
}
</script>
```

vuex
```js
state: {
    tareas: [],
    tarea: {nombre: '', id: ''}
},

getTarea({commit}, id){
    db.collection('tareas').doc(id).get()
    .then(doc => {
        // console.log(doc.data())
        // console.log(doc.id)
        let tarea = doc.data()
        tarea.id = doc.id
        commit('setTarea', tarea)
    })
},
editarTarea({commit}, tarea){
    db.collection('tareas').doc(tarea.id).update({
        nombre: tarea.nombre
    })
    .then(() => {
        router.push({name: 'Inicio'})
    })
}
```

## Agregar
[https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es-419#add_a_document](https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es-419#add_a_document)

Inicio.vue
```vue
<template>
    <div>
        <h1>Lista de Tareas</h1>
        <router-link to='/agregar'>
            <button>Agregar</button>
        </router-link>
        <ul>
            <li v-for="(item, index) in tareas" :key="index">
                {{item.id}} - {{item.nombre}}
                <router-link :to="{name: 'Editar', params: {id: item.id}}">
                    <button>Editar</button>
                </router-link>
            </li>
        </ul>
    </div>
</template>
```

```js
agregarTarea({commit}, nombreTarea){
    db.collection('tareas').add({
        nombre: nombreTarea
    })
    .then(doc => {
        console.log(doc.id)
        router.push({name: 'Inicio'})
    })
}
```

```vue
<template>
    <div>
        <h1>Agregar</h1>
        <form @submit.prevent="agregarTarea(nombre)">
            <input type="text" v-model="nombre">
            <button type="submit">Agregar</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'Agregar',
    data() {
        return {
            nombre: ''
        }
    },
    methods:{
        ...mapActions(['agregarTarea'])
    }
}
</script>
```

## Eliminar
```js
// mutations
setEliminarTarea(state, payload){
    state.tareas = state.tareas.filter(item => item.id !== payload)
}
// actions
eliminarTarea({commit, dispatch}, id){
    db.collection('tareas').doc(id).delete()
    .then(() => {
        // dispatch('getTareas')
        commit('setEliminarTarea', id)
    })
}
```

```vue
<template>
    <div>
        <h1>Lista de Tareas</h1>
        <router-link to='/agregar'>
            <button>Agregar</button>
        </router-link>
        <ul>
            <li v-for="(item, index) in tareas" :key="index">
                {{item.id}} - {{item.nombre}}
                <router-link :to="{name: 'Editar', params: {id: item.id}}">
                    <button>Editar</button>
                </router-link>
                <button @click="eliminarTarea(item.id)">Eliminar</button>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'Inicio',
    created(){
        this.getTareas()
    },
    methods:{
        ...mapActions(['getTareas', 'eliminarTarea'])
    },
    computed:{
        ...mapState(['tareas'])
    }
}
</script>
```