# Vuex + Composition API
En esta sección realizaremos una práctica para conocer como utilizar Vuex y Composition API.

## API
- [https://restcountries.eu/](https://restcountries.eu/)
- [https://top-paises.netlify.app/](https://top-paises.netlify.app/)

## App.vue
```vue
<template>
  <div class="container">
    <h1 class="text-center my-3 text-uppercase">top country population</h1>
    <Continentes />
    <Buscador />
    <CardList />
  </div>
</template>

<script>
import CardList from "./components/CardList";
import Continentes from "./components/Continentes";
import Buscador from "./components/Buscador";

export default {
  name: "App",
  components: {
    CardList, Continentes, Buscador
  },
};
</script>
```

## CardList.vue
```vue
<template>
  <div class="row">
      <div class="col-12"
        v-for="pais in paises" :key="pais.name"
      >
        <Card :pais="pais" />
      </div>
    </div>
</template>

<script>
import Card from './Card'
import { computed, onMounted, watchEffect } from 'vue'
import {useStore} from 'vuex'
export default {
  components: {
    Card
  },
  setup(){
    
    const store = useStore()
    
    const paises = computed(() => {
      // return store.state.paisesFiltrados
      return store.getters.topPaisesPoblacion
    })
    
    // watchEffect(() => {
    //   console.log(paises.value[0])
    // })

    onMounted(async() => {
      await store.dispatch('fetchData')
      await store.dispatch('filtroRegion', 'Asia')
    })

    return {paises}
  }
}
</script>
```

## Vuex
```js
import { createStore } from "vuex";

export default createStore({
  state: {
    paises: [],
    paisesFiltrados: [],
  },
  mutations: {
    setPaises(state, payload) {
      state.paises = payload;
      // state.paisesFiltrados = payload
    },
    setPaisesFiltrados(state, payload) {
      state.paisesFiltrados = payload;
    },
  },
  actions: {
    async fetchData({ commit }) {
      try {
        const res = await fetch("api.json");
        const data = await res.json();
        commit("setPaises", data);
      } catch (error) {
        console.log(error);
      }
    },
    async filtroRegion({ commit, state }, region) {
      // const filtro = state.paises.filter(pais => pais.region === region)
      const filtro = state.paises.filter((pais) =>
        pais.region.includes(region)
      );
      commit("setPaisesFiltrados", filtro);
    },
  },
  getters: {
    topPaisesPoblacion(state) {
      return state.paisesFiltrados.sort((a, b) =>
        a.population < b.population ? 1 : -1
      );
    },
  },
});
```

## Card.vue
```vue
<template>
  <div class="card mb-1">
          <div class="card-body">
            <h5 class="card-title text-center">{{pais.name}}</h5>
            <p class="text-center">
              <img :src="pais.flag" :alt="`bandera-${pais.flag}`" class="img-fluid w-50">
            </p>
            <p class="card-text">
              <span class="badge badge-dark mb-1 d-block">nativeName: {{pais.nativeName}}</span>
              <span class="badge p-3 badge-info mb-1 d-block">Población: {{populationFormato(pais.population)}}</span>
              <span class="badge badge-dark mb-1 d-block">Capital: {{pais.capital}}</span>
              <span class="badge badge-dark d-block">Región: {{pais.region}}</span>
            </p>
          </div>
        </div>
</template>

<script>
export default {
    props: ['pais'],
    setup(){
      const populationFormato = (num) => {
        return new Intl.NumberFormat("de-DE").format(num);
      }
      return {populationFormato}
    }
}
</script>
```

## Continentes.vue
```vue
<template>
<div class="text-center">
  <p class="mb-0">
    Seleccione un continente:
  </p>
  <div class="btn-group mb-3" role="group" aria-label="Basic example">
    <button
      type="button"
      class="btn btn-dark"
      @click="filtroRegion('Americas')"
    >
      AM
    </button>
    <button type="button" class="btn btn-dark" @click="filtroRegion('Europe')">
      EU
    </button>
    <button type="button" class="btn btn-dark" @click="filtroRegion('Asia')">
      AS
    </button>
    <button type="button" class="btn btn-dark" @click="filtroRegion('Africa')">
      AF
    </button>
    <button type="button" class="btn btn-dark" @click="filtroRegion('Oceania')">
      OC
    </button>
    <button type="button" class="btn btn-dark" @click="filtroRegion('')">
      All
    </button>
  </div>
</div>
</template>

<script>
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const filtroRegion = (region) => {
      store.dispatch("filtroRegion", region);
    };
    return { filtroRegion };
  },
};
</script>

<style>
</style>
```

## Buscardor.vue
Vuex
```js
filtroName({ commit, state }, name) {
  const filtro = state.paises.filter((pais) => {
    let nombreApi = pais.name.toLowerCase();
    let nombreInput = name.toLowerCase();
    if (nombreApi.includes(nombreInput)) {
      return pais;
    }
  });
  // console.log(filtro)
  commit("setPaisesFiltrados", filtro);
},
```

```vue
<template>
    <input
      type="text"
      placeholder="Ingrese búsqueda"
      class="form-control my-2"
      v-model="texto"
      @keyup="formulario"
    />
</template>

<script>
import { ref } from 'vue';
import {useStore} from 'vuex'
export default {
    setup(){
        const store = useStore()
        const texto = ref('')
        const formulario = () => {
            // console.log(texto.value)
            store.dispatch('filtroName', texto.value)
        }
        return {texto, formulario}
    }
};
</script>
```