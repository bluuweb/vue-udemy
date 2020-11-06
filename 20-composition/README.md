# Composition API
[https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api)

Es una alternativa que podrá solucionar diferentes problemas de Vue 2: 

- Legibilidad cuando nuestros componentes son muy grandes
- Reutilización de código tiene sus inconvenientes
- Soporte limitado para TypeScript

## Cuando utilizarla
- Cuando necesitas una compatibilidad al 100% de TypeScript.
- El componente es demasiado grande y necesitas organizar por función.
- Necesitas reutilizar código de otros componentes.

## API de opciones
Disponible para Vue 2 como Vue 3
```vue
<template>
  <div class="home">
    <h1
      :style="{'color': color}"
    >
      Contador: {{contador}}
    </h1>
    <button @click="aumentar">+</button>
    <button @click="disminuir">-</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contador: 0
    }
  },
  methods: {
    aumentar(){
      this.contador ++
    },
    disminuir(){
      this.contador --
    }
  },
  computed: {
    color(){
      if(this.contador < 0) {
        return 'red'
      }else{
        return 'blue'
      }
    }
  }
}
</script>
```

## setup()
La setup se ejecuta antes de que se cree el componente, una vez que props se resuelven, y sirve como punto de entrada para las API de composición.

```vue
<template>
  <div class="about">
    <h1>
      contador {{contador}}
    </h1>
  </div>
</template>

<script>
export default {
  setup() {
    const contador = 0;
    return {contador}
  }
};
</script>
```

## ref
Es una referencia reactiva, en nuestro ejemplo necesitamos un entero que sea "rastreable", por ende utilizamos ref. Por ende ahora contador es reactivo.

ref toma el argumento y lo devuelve envuelto dentro de un objeto con una value propiedad, que luego puede usarse para acceder o mutar el valor de la variable reactiva

```vue
<script>
import { ref } from 'vue';
export default {
  setup() {
    const contador = ref(0)
    console.log(contador.value)
    return {contador}
  }
};
</script>
```

## Methods

```vue
<template>
  <div class="about">
    <h1>
      contador {{contador}}
    </h1>
    <button @click="aumentar">+</button>
    <button @click="disminuir">-</button>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup(){
    const contador = ref(0)

    const aumentar = () => {
      contador.value ++
    }

    const disminuir = () => {
      contador.value --
    }
    
    return {contador, aumentar, disminuir}
  }
}
</script>
```

## Computed
```vue
<template>
  <div class="about">
    <h1
      :style="{'color': color}"
    >
      contador {{contador}}
    </h1>
    <button @click="aumentar">+</button>
    <button @click="disminuir">-</button>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  setup(){
    const contador = ref(0)

    const aumentar = () => {
      contador.value ++
    }

    const disminuir = () => {
      contador.value --
    }

    const color = computed(() => {
      if(contador.value < 0){
        return 'red'
      }else{
        return 'blue'
      }
    })
    
    return {contador, aumentar, disminuir, color}
  }
}
</script>
```

## v-model
```vue
<template>
  <div class="about">
    <h1
      :style="{'color': color}"
    >
      contador {{contador}}
    </h1>
    <button @click="aumentar">+</button>
    <button @click="disminuir">-</button>
    
    <hr>
    <input type="text" v-model="texto">
    <p>{{texto}}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  setup(){
    const contador = ref(0)
    const texto = ref('')

    const aumentar = () => {
      contador.value ++
    }

    const disminuir = () => {
      contador.value --
    }

    const color = computed(() => {
      if(contador.value < 0){
        return 'red'
      }else{
        return 'blue'
      }
    })
    
    return {contador, aumentar, disminuir, color, texto}
  }
}
</script>
```

## props
components/Titulo.vue
```vue
<template>
    <h1
      :style="{'color': color}"
    >
      contador {{signoPeso}}
    </h1>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['color', 'contador'],
    
    setup(props){
        const signoPeso = computed(() => {
            return '$ ' + props.contador
        })

        return {signoPeso}
    
    }
}
</script>
```

About.vue
```vue
<template>
  <div class="about">

    <Titulo :contador="contador" :color="color" />
    ...
  </div>
</template>

<script>
import Titulo from '../components/Titulo'
import { computed, ref } from 'vue'
export default {
  components: {
    Titulo
  },
  setup(){
    
    ...
    
    return {contador, aumentar, disminuir, color, texto}
  }
}
</script>
```

## Custom Events
[https://v3.vuejs.org/guide/composition-api-setup.html#arguments](https://v3.vuejs.org/guide/composition-api-setup.html#arguments)
```html
<Btn :textoBoton="'Aumentar'" @accion="aumentar" />
<Btn :textoBoton="'Disminuir'" @accion="disminuir" />
```

Btn.vue
```vue
<template>
<!-- <button @click="$emit('accion')">{{textoBoton}}</button> -->
  <button @click="accionBoton">{{textoBoton}}</button>
</template>

<script>
export default {
    props: ['textoBoton'],
    setup(props, context){

        const accionBoton = () => {
            context.emit('accion')
        }

        return {accionBoton}
    }
}
</script>
```

## Reutilización
Llamados como Hooks o Composables.

contadorHook.js
```js
import { ref } from 'vue'
export function contadorHook() {
    const contador = ref(0)

    const aumentar = () => {
      contador.value ++
    }

    const disminuir = () => {
      contador.value --
    }
    
    return {contador, aumentar, disminuir}
}
```

Contador.vue
```vue
<template>
  <div class="about">
    <h1>Contador {{contador}}</h1>
    <button @click="aumentar">+</button>
    <button @click="disminuir">-</button>
  </div>
</template>

<script>
import {contadorHook} from '../hooks/contadorHook'
export default {
    setup(){
        // console.log(contadorHook())
        return {...contadorHook()}
    }
}
</script>
```

## Export vs Export Default
- [https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910](https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910)

Puede que confunda a veces que opción utilizar cuando reutilizamos nuestras funciones, las dos son válidas y aquí trato de explicar sus dos implementaciones:

- export: Se pueden exportar más de una función por archivo, por ende al momento de llamar (importar) tenemos que utilizar ``{}`` y el nombre utilizado, en este caso sería `{contadorHook}`
```js
import { ref } from 'vue'
export function contadorHook() {
    ...   
    return {contador, aumentar, disminuir}
}
```

```js
import {contadorHook} from '../hooks/contadorHook'
```

- export default: Solo permite una exportación por archivo y puede recibir un nombre o no la función, como vemos a continuación, pero lo importante es que al momento de importar ya no utilizamos las ``{}``
```js
import { ref } from 'vue'

// el nombre contadorHook es opcional -> se podría omitir:
// export default function () {
export default function contadorHook() {
    ...   
    return {contador, aumentar, disminuir}
}
```

```js
import contadorHook from '../hooks/contadorHook'
```

## Ciclo de vida de Vue
[https://v3.vuejs.org/guide/composition-api-lifecycle-hooks.html](https://v3.vuejs.org/guide/composition-api-lifecycle-hooks.html)
Los enlaces de ciclo de vida en la API de composición tienen el mismo nombre que la API de opciones, pero tienen el prefijo on:

``mounted => onMounted``

```vue
<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from "vue";

export default {
  setup() {
    onBeforeMount(() => {
      console.log("onBeforeMount");
    });
    onMounted(() => {
      console.log("onMounted");
    });
    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });
    onUpdated(() => {
      console.log("onUpdated");
    });
    onBeforeUnmount(() => {
      console.log("onBeforeUnmount");
    });
    onUnmounted(() => {
      console.log("onUnmounted");
    });
  }
};
</script>
```

Como vemos faltan "beforeCreate" y "created" los cuales no son necesarios en la API de composición.

- beforeCreate: se llama justo antes del setup()
- created: después del setup()

Por lo tanto el llamado a las apis irian dentro del setup() sin necesidad de un ciclo de vida en particular.

## Consumir API
[https://restcountries.eu/](https://restcountries.eu/)

Paises.vue
```vue
<template>
  <h1>API País</h1>
  <p v-for="(pais, index) in arrayData" :key="index">
      {{pais.name}}
  </p>
</template>

<script>
import { ref } from 'vue'
export default {
    setup(){
        const arrayData = ref([])
        
        onMounted(async() => {    
            try {
                const res = await fetch('api.json')
                arrayData.value = await res.json()
            } catch (error) {
                console.log(error)
            }
        })
        
        return {arrayData}
    }
}
</script>
```

Router
```js{4}
{
  path: '/paises/:nombre',
  name: 'Pais',
  props: true,
  component: () => import(/* webpackChunkName: "Paises" */ '../views/Pais.vue')
}
```

Router-link
```html
<template>
  <h1>API País</h1>
  <p v-for="(pais, index) in arrayData" :key="index">
      <router-link :to="`/paises/${pais.name}`">
        {{pais.name}}
      </router-link>
  </p>
</template>
```

Hook/fetchData.js
```js
import { onMounted, ref } from 'vue'
export function fetchData(url) {
    const arrayData = ref([])
        
    onMounted(async() => {    
        try {
            const res = await fetch(url)
            arrayData.value = await res.json()
        } catch (error) {
            console.log(error)
        }
    })
    
    return {arrayData}
}
```

Paises.vue
```vue
<template>
  <h1>API País</h1>
  <p v-for="(pais, index) in arrayData" :key="index">
      <router-link :to="`/paises/${pais.name}`">
        {{pais.name}}
      </router-link>
  </p>
</template>

<script>
import {fetchData} from '../hooks/fetchData'
export default {
    setup(){
        return {...fetchData('api.json')}
    }
}
</script>
```

Pais.vue
```vue
<template>
  <h1>Detalle País</h1>
  {{$route.params.nombre}}
  {{nombre}}
  <p v-for="(pais, index) in arrayData" :key="index">  
    {{pais.name}} - {{pais.region}} <br>
    {{pais.population}}
  </p>
</template>

<script>
import {fetchData} from '../hooks/fetchData'
export default {
    props: ['nombre'],
    setup(props){
        console.log(props.nombre)
        const {arrayData} = fetchData(`https://restcountries.eu/rest/v2/name/${props.nombre}`)
        return {arrayData}
    }
}
</script>
```

## useRoute
```vue
<script>
import {fetchData} from '../hooks/fetchData'
import {useRoute} from 'vue-router'
export default {
    props: ['nombre'],
    setup(props){

        const route = useRoute();
        console.log(route.params.nombre)

        const {arrayData} = fetchData(`https://restcountries.eu/rest/v2/name/${route.params.nombre}`)
        
        return {arrayData}
    }
}
</script>
```


## Vue Router

404
[https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/](https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/)