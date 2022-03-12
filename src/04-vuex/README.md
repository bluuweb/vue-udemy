# Vuex
[https://vuex.vuejs.org/](https://vuex.vuejs.org/)
Sirve como un almacén centralizado para todos los componentes de una aplicación, con reglas que garantizan que el estado solo se puede modificar de una manera predecible.

- La idea principal es generar un estado global para que todos los componentes puedan acceder a la información, así también podemos tener mutaciones, acciones y getters.

<img src="https://vuex.vuejs.org/vuex.png">

## DevTools
Extensión: [https://github.com/vuejs/vue-devtools](https://github.com/vuejs/vue-devtools)

## Instalación
A través del CLI podemos escoger la opción de agregar Vuex a nuestro proyecto.

## Tienda
```js
import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

## State
[https://vuex.vuejs.org/guide/state.html](https://vuex.vuejs.org/guide/state.html)
Vuex utiliza un árbol de estado único , es decir, este objeto único contiene todo el estado de su aplicación y sirve como la "fuente única de la verdad".

```js
state: {
  contador: 100
},
```

Método no recomendado
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Contador: {{ $store.state.contador }}</h1>
  </div>
</template>
```

## mapState
- mapState: Podemos mapear nuestros state para acceder su información
- mapState devolverá un objeto y para juntarlo con nuestras propiedades computadas podemos utilizar el operador de propagación de javascript. [spread operator](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Spread_operator)
- [Operador de propagación](https://github.com/tc39/proposal-object-rest-spread)

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Contador: {{ contador }}</h1>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState(['contador'])
  }
}
</script>
```

:::warning
La data se puede seguir utilizando en los componentes, no es obligación llevar todo a nuestra tienda.
:::

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1
      :style="colorContador"
    >
      {{titulo}} {{ contador }}
    </h1>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      titulo: 'Contador Vuex:'
    }
  },
  computed: {
    ...mapState(['contador']),
    colorContador(){
      return [this.contador > 10 ? {'color': 'green'} : {'color': 'red'}]
    }
  }
}
</script>
```

## Mutations
La única forma de cambiar el estado en una tienda Vuex es realizando una mutación. Las mutaciones de Vuex son muy similares a los eventos: cada mutación tiene un tipo de cadena y un controlador.
[https://vuex.vuejs.org/guide/mutations.html](https://vuex.vuejs.org/guide/mutations.html)

```js
state: {
  contador: 100
},
mutations: {
  incrementar(state) {
    state.contador = state.contador + 1
  }
},
```

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1
      :style="colorContador"
    >
      {{titulo}} {{ contador }}
    </h1>
    <button @click="incrementar">Aumentar</button>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      titulo: 'Contador Vuex:'
    }
  },
  computed: {
    ...mapState(['contador']),
    colorContador(){
      return [this.contador > 10 ? {'color': 'green'} : {'color': 'red'}]
    }
  },
  methods: {
    ...mapMutations(['incrementar'])
  }
}
</script>
```

## Actions
Las acciones nos sirven para ejecutar una mutación ya que no se recomienda ejecutar una mutación directamente. También serán de mucha utilidad cuando hagamos llamados a nuestra api o bases de datos.

```js
import { createStore } from 'vuex'

export default createStore({
  state: {
    contador: 100
  },
  mutations: {
    incrementar(state) {
      state.contador = state.contador + 1
    }
  },
  actions: {
    incrementar({ commit }) {
      commit('incrementar')
    }
  },
  modules: {
  }
})
```

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1
      :style="colorContador"
    >
      {{titulo}} {{ contador }}
    </h1>
    <button @click="incrementar">Aumentar</button>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      titulo: 'Contador Vuex:'
    }
  },
  computed: {
    ...mapState(['contador']),
    colorContador(){
      return [this.contador > 10 ? {'color': 'green'} : {'color': 'red'}]
    }
  },
  methods: {
    // ...mapMutations(['incrementar']),
    ...mapActions(['incrementar'])
  }
}
</script>
```

## Práctica
```js
import { createStore } from 'vuex'

export default createStore({
  state: {
    contador: 100
  },
  mutations: {
    incrementar(state) {
      state.contador = state.contador + 1
    },
    disminuir(state, payload) {
      state.contador = state.contador - payload
    }
  },
  actions: {
    incrementar({ commit }) {
      commit('incrementar')
    },
    disminuir({ commit }, numero) {
      commit('disminuir', numero)
    }
  },
  modules: {
  }
})
```

```vue
// BtnDisminuir.vue (component)
<template>
  <button @click="disminuir(10)">Disminuir</button>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    methods:{
        ...mapActions(['disminuir'])
    }
}
</script>
```

```vue
// Home.vue (view)
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1
      :style="colorContador"
    >
      {{titulo}} {{ contador }}
    </h1>
    <button @click="incrementar">Aumentar</button>
    <BtnDisminuir />
  </div>
</template>
```

## Actions (práctica)
- ¿Qué pasaría si nuestro actions recibiera dos parámetros?
- En este caso tendríamos que pasar un objeto:

```vue
// BotonAccion.vue (component)
<template>
  <button @click="accionEstado({estado, numero: 10})">
      {{textoBoton}}
  </button>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    props:{
        estado: Boolean
    },
    computed: {
        textoBoton(){
            return this.estado ? 'Aumentar' : 'Disminuir'
        }
    },
    methods: {
        ...mapActions(['accionEstado'])
    }
}
</script>
```

```js
import { createStore } from 'vuex'

export default createStore({
  state: {
    contador: 100
  },
  mutations: {
    incrementar(state, payload) {
      state.contador = state.contador + payload
    },
    disminuir(state, payload) {
      state.contador = state.contador - payload
    }
  },
  actions: {
    incrementar({ commit }) {
      commit('incrementar')
    },
    disminuir({ commit }, numero) {
      commit('disminuir', numero)
    },
    accionEstado({ commit }, objeto) {
      if (objeto.estado) {
        commit('incrementar', objeto.numero)
      } else {
        commit('disminuir', objeto.numero)
      }
    }
  },
  modules: {
  }
})
```

```vue
// Home.vue (view)
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1
      :style="colorContador"
    >
      {{titulo}} {{ contador }}
    </h1>
    <button @click="incrementar">Aumentar</button>
    <BtnDisminuir />
    <hr>
    <BotonAccion :estado="true" />
    <BotonAccion :estado="false" />
  </div>
</template>
```