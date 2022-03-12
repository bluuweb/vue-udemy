# CRUD Vuex
Realizaremos una práctica de Vuex y Formularios:

## Create
[https://www.npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)

```
npm i shortid
```

```vue
<template>
  <form class="mt-3" @submit.prevent="procesarFormulario">
    
    <Input :tarea="tarea" />

  </form>

  <hr>
  <p>{{tarea}}</p>
</template>

<script>
import Input from '../components/Input'

export default {
  components: {
    Input
  }
}
</script>
```

Input.vue
```vue
<template>
    <input 
        type="text" 
        placeholder="Nombre Tarea"
        class="form-control"
        v-model.trim="tarea.nombre"
    >

    <!-- checkbox -->
    <div class="my-2">
        <div class="form-check form-check-inline">
        <input 
            type="checkbox"
            class="form-check-input"
            id="check-1"
            v-model="tarea.categoria"
            value="Javascript"
        >
        <label 
            for="check-1"
            class="form-check-label"
        >Javascript</label>
        </div>
        <div class="form-check form-check-inline">
        <input 
            type="checkbox"
            class="form-check-input"
            id="check-2"
            v-model="tarea.categoria"
            value="Desarrollo"
        >
        <label 
            for="check-2"
            class="form-check-label"
        >Desarrollo web</label>
        </div>
    </div>

    <!-- radio -->
    <div class="my-2">
        <div class="form-check form-check-inline">
        <input 
            class="form-check-input" 
            type="radio" 
            id="inlineRadio1" 
            value="urgente"
            v-model="tarea.estado"
        >
        <label class="form-check-label" for="inlineRadio1">
            Urgente
        </label>
        </div>

        <div class="form-check form-check-inline">
        <input 
            class="form-check-input" 
            type="radio" 
            id="inlineRadio2" 
            value="relax"
            v-model="tarea.estado"
        >
        <label class="form-check-label" for="inlineRadio2">
            Relax
        </label>
        </div>
    </div>

    <div class="my-2">
        <input 
        type="number"
        class="form-control"
        placeholder="numero"
        v-model.number="tarea.numero"
        >
    </div>

    <button 
        class="btn btn-block btn-dark" 
        type="submit"
        :disabled="bloquear"
    >
        Agregar
    </button>
</template>

<script>
export default {
    props: {
        tarea: Object
    },
    computed: {
        bloquear(){
            return this.tarea.nombre.trim() === '' ? true : false
        }
    }
}
</script>
```

vuex
```js
import { createStore } from 'vuex'

export default createStore({
  state: {
    tareas: [],
    tarea: {nombre: '', categoria: [], estado: '', numero: 0}
  },
  mutations: {
    set(state, payload) {
      console.log(payload)
      state.tareas.push(payload)
    }
  },
  actions: {
    setTareas({ commit }, tarea) {
      console.log(tarea)
      commit('set', tarea)
    }
  },
  modules: {
  }
})
```

Home.vue
```vue
<script>
import {mapActions} from 'vuex'

const shortid = require('shortid');

export default {
  data() {
    return {
      tarea: {id: '', nombre: '', categoria: [], estado: '', numero: 0}
    }
  },
  methods: {
    ...mapActions(['setTareas']),
    procesarFormulario(){
      if(this.tarea.nombre.trim() === ''){
        console.log('nombre Vacío')
        return
      }

      this.tarea.id = shortid.generate()
      console.log(this.tarea)

      this.setTareas(this.tarea)

      this.tarea = {id: '', nombre: '', categoria: [], estado: '', numero: 0}
    }
  },
  computed: {
    bloquear(){
      return this.tarea.nombre.trim() === '' ? true : false
    }
  }
}
</script>
```

## Read
ListaTareas.vue (components)
```vue
<template>
  <h1>Lista de Tareas</h1>
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categorías</th>
            <th scope="col">Estado</th>
            <th scope="col">Número</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(tarea, index) in tareas" :key="index">
                <th scope="row">{{tarea.id}}</th>
                <td>{{tarea.nombre}}</td>
                <td>{{tarea.categoria}}</td>
                <td>{{tarea.estado}}</td>
                <td>{{tarea.numero}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed:{
        ...mapState(['tareas'])
    }
}
</script>
```

```vue
<template>
  <h1>Lista de Tareas</h1>
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categorías</th>
            <th scope="col">Estado</th>
            <th scope="col">Número</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(tarea, index) in tareas" :key="index">
                <th scope="row">{{index}}</th>
                <td>{{tarea.nombre}}</td>
                <td>
                    <span v-for="(item, i) in tarea.categoria" :key="i">
                        {{
                            tarea.categoria.length  === (index + 1) ? item : item + ', ' 
                        }}
                    </span>
                </td>
                <td>{{tarea.estado}}</td>
                <td>{{tarea.numero}}</td>
            </tr>
        </tbody>
    </table>
</template>
```

## Delete
```js
import { createStore } from 'vuex'

export default createStore({
  mutations: {
    delete(state, payload) {
      state.tareas = state.tareas.filter(item => item.id !== payload)
    }
  },
  actions: {
    deleteTarea({commit}, id){
      commit('delete', id)
    }
  }
})
```

```html
<td>
    <button
        class="btn btn-danger btn-sm"
        @click="deleteTarea(tarea.id)"
    >
        Eliminar
    </button>
</td>
```

```vue
<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed:{
        ...mapState(['tareas'])
    },
    methods:{
        ...mapActions(['deleteTarea'])
    }
}
</script>
```

## Update
ListaTareas.vue
```html
<router-link
    class="btn btn-warning btn-sm"
    :to="{
        name: 'Editar',
        params: {
            id: tarea.id
        }
    }"
>
    Editar
</router-link>
```

```js
{
  path: '/editar/:id',
  name: 'Editar',
  component: () => import(/* webpackChunkName: "about" */ '../views/Editar.vue')
}
```

```js
import { createStore } from 'vuex'

export default createStore({
  state: {
    tareas: [],
    tarea: {id: '', nombre: '', categoria: [], estado: '', numero: 0}
  },
  mutations: {
    tarea(state, payload) {
      state.tarea = state.tareas.find(item => item.id === payload)
      console.log('tarea vuex: ', state.tarea)
    }
  },
  actions: {
    setTarea({ commit }, id) {
      commit('tarea', id)
    }
  },
})
```

Ojo que si refrescas el sitio web la tarea desaparecerá, más adelante veremos como resolverlo con localStorage
```vue
<template>
     {{tarea}}
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
    computed: {
        ...mapState(['tarea'])
    },
    methods: {
        ...mapActions(['setTarea'])
    },
    created(){
        this.setTarea(this.$route.params.id)
    }
}
</script>
```

Vuex
```js
// importar
import router from '../router'

//mutations
update(state, payload) {
  state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item)
}

//Actions
updateTarea({ commit }, tarea) {
  commit('update', tarea)
  router.push('/')
}
```

Agregar Formulario
```vue
<template>
    <form class="mt-3" @submit.prevent="updateTarea(tarea)">
    
        <Input :tarea="tarea" />

    </form>

    <hr>
    <p>{{tarea}}</p>
</template>

<script>
import Input from '../components/Input'
import {mapActions, mapState} from 'vuex'

export default {
    components: {
        Input
    },
    computed: {
        ...mapState(['tarea'])
    },
    methods: {
        ...mapActions(['setTarea', 'updateTarea'])
    },
    created(){
        this.setTarea(this.$route.params.id)
    }
}
</script>
```

Opcionales:
```js
tarea(state, payload) {
  if (!state.tareas.find(item => item.id === payload)){
    console.log('no existe el id')
    router.push('/')
    return 
  }
  state.tarea = state.tareas.find(item => item.id === payload)
  console.log(state.tarea)
  console.log('tarea vuex: ', state.tarea)
},
```

## LocalStorage

### Leer o crear

```js
// Vuex

// Mutations
cargar(state, payload) {
  state.tareas = payload
}

// Actions
cargarLocalStorage({ commit }) {
  if (localStorage.getItem('tareas1')) {
    console.log('existe')
    const tareas = JSON.parse(localStorage.getItem('tareas1'))
    commit('cargar', tareas)
  } else {
    localStorage.setItem('tareas1', JSON.stringify([]))
  }
}
```

```vue
// App.vue
<template>
  <div class="container mt-2">
    <Navbar />
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import {mapActions} from 'vuex'
export default {
  components: {
    Navbar
  },
  methods:{
    ...mapActions(['cargarLocalStorage'])
  },
  created(){
    this.cargarLocalStorage()
  }
}
</script>
```

### Mutations
```js
 mutations: {
  cargar(state, payload) {
    state.tareas = payload
  },
  set(state, payload) {
    console.log(payload)
    state.tareas.push(payload)
    localStorage.setItem('tareas1', JSON.stringify(state.tareas))
  },
  delete(state, payload) {
    state.tareas = state.tareas.filter(item => item.id !== payload)
    localStorage.setItem('tareas1', JSON.stringify(state.tareas))
  },
  tarea(state, payload) {
    if (!state.tareas.find(item => item.id === payload)){
      console.log('entro aquí')
      router.push('/')
      return 
    }
    state.tarea = state.tareas.find(item => item.id === payload)
    localStorage.setItem('tareas1', JSON.stringify(state.tareas))
  },
  update(state, payload) {
    state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item)
    localStorage.setItem('tareas1', JSON.stringify(state.tareas))
  }
}
```