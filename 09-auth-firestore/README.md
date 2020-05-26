# 09 AUTH + FIRESTORE
Tomando como ejemplo los dos ejercicios anteriores:

## GET tareas
```js
import {auth, db} from '../firebase'

state: {
  tareas: []
},
mutations: {
  setTareas(state, payload){
    state.tareas = payload
  }
},
actions: {
  getTareas({commit, state}){
      const tareas = []
      db.collection(state.usuario.email).get()
      .then(res => {
          res.forEach(doc => {
              let tarea = doc.data()
              tarea.id = doc.id
              tareas.push(tarea)
          })
          commit('setTareas', tareas)
      })
      .catch(error => console.log(error))
  },
  crearUsuario({commit}, usuario){
    auth.createUserWithEmailAndPassword(usuario.email, usuario.password)
      .then(res => {
        console.log(res)
        const usuario = {
          email: res.user.email,
          uid: res.user.uid
        }
        db.collection(usuario.email).add({
          nombre: 'tarea de ejemplo #0'
        }).then(doc => {
          commit('setUsuario', usuario)
          router.push('/')
        })
        .catch(error => console.log(error))
      })
      .catch(error => {
        console.log(error)
        commit('setError', error)
      })
  },
}
```

Inicio.vue
```js
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

## UPDATE Tarea
```js
// state
tarea: {nombre: '', id: ''}

// mutations
setTareas(state, payload){
  state.tareas = payload
},
setTarea(state, payload){
  state.tarea = payload
}

// actions
getTarea({commit, state}, id){
  db.collection(state.usuario.email).doc(id).get()
  .then(doc => {
      let tarea = doc.data()
      tarea.id = doc.id
      commit('setTarea', tarea)
  })
  .catch(error => console.log(error))
},
editarTarea({commit, state}, tarea){
  db.collection(state.usuario.email).doc(tarea.id).update({
      nombre: tarea.nombre
  })
  .then(() => {
      router.push({name: 'Inicio'})
  })
  .catch(error => console.log(error))
},
```

Editar.vue
```js
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

Router
```js
{
  path: '/editar/:id',
  name: 'Editar',
  component: () => import(/* webpackChunkName: "editar" */ '../views/Editar.vue'),
  meta: { requiresAuth: true }
}
```

## POST tarea
```js
agregarTarea({commit, state}, nombreTarea){
    db.collection(state.usuario.email).add({
        nombre: nombreTarea
    })
    .then(doc => {
        router.push({name: 'Inicio'})
    })
    .catch(error => console.log(error))
},
```

Agregar.vue
```js
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

Router
```js
{
  path: '/agregar',
  name: 'Agregar',
  component: () => import(/* webpackChunkName: "editar" */ '../views/Agregar.vue'),
  meta: { requiresAuth: true }
}
```

## DELETE tarea
```js
// mutations
setEliminarTarea(state, payload){
  state.tareas = state.tareas.filter(item => item.id !== payload)
}
// actions
eliminarTarea({commit, state}, id){
    db.collection(state.usuario.email).doc(id).delete()
    .then(() => {
        commit('setEliminarTarea', id)
    })
    .catch(error => console.log(error))
},
```

Inicio.vue
```js{13,27}
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



