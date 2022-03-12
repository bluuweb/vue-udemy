# Trucos Vue 3
Trataré de ir detallando diferentes características nuevas de Vue 3.

## VSCode
Comparto las extensiones de VSCode de esta sección:

- [Theme](https://marketplace.visualstudio.com/items?itemName=dbanksdesign.nu-disco)
- [Inteligencia Artificial](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)
- [Bracket color](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

## Vetur can't find jsconfig.json

- Vetur can't find tsconfig.json, jsconfig.json
- [jsconfig.json](https://vuejs.github.io/vetur/guide/setup.html#project-setup)

jsconfig.json
```json
  {
    "include": [
      "./src/**/*"
    ]
  }
```

## script setup
El `<script setup>` genera automaticamente el return al trabajando con Composition API

:::warning
Aún script setup NO está 100% estable por ende <b>no se recomienda en producción.</b>
:::

```vue{8}
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <input type="text" v-model="nombre">
  <p>Hola: {{saludar}}</p>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import HelloWorld from './components/HelloWorld.vue'

  const nombre = ref('')
  const saludar = computed(() => {
    return !nombre.value.trim() ? 'Invitado' : nombre.value
  })
</script>
```

Props
```html
<script setup>
    import { defineProps } from "vue";


    const props = defineProps({
        todo: Object
    })

</script>
```

## Reactive

:::tip
Tenga en cuenta que tanto ``Reactive`` como ``Ref`` son completamente válidas y ninguna se considera una "práctica recomendada".
:::

```vue
<template>
  <form>
    <input type="text" v-model="user.nombre" placeholder="Nombre">
    <input type="number" v-model.number="user.edad" placeholder="Edad">
    <div>
      <input type="checkbox" v-model="user.cursos" value="HTML">
      HTML
      <input type="checkbox" v-model="user.cursos" value="CSS">
      CSS
      <input type="checkbox" v-model="user.cursos" value="JS">
      JS
    </div>
    <div>
      <input type="radio" v-model="user.nacionalidad" value="México">
      México
      <input type="radio" v-model="user.nacionalidad" value="Argentina">
      Argentina
      <input type="radio" v-model="user.nacionalidad" value="Salvador">
      Salvador
    </div>
    <div>
      <select v-model="user.nacionalidad">
        <option value="" disabled>Nacionalidad</option>
        <option>México</option>
        <option>Argentina</option>
        <option>Salvador</option>
      </select>
    </div>
    <pre>{{user}}</pre>
  </form>
  
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
  nombre: '',
  edad: 0,
  cursos: [],
  nacionalidad: ''
})

</script>
```

Reactividad a todo nivel
```vue
<script setup>
import { reactive, ref } from 'vue'

const user = reactive({
  nombre: '',
  edad: 0,
  cursos: [],
  nacionalidad: ''
})

const users = ref([])

const enviarDatos = () => {
  if(!user.nombre.trim()){
    console.log('nombre vacio')
    return
  }
  // const copy = {...user}
  users.value.push(user)
  
  user.nombre = ''
  user.edad = 0
  user.cursos = []
  user.nacionalidad = ''
}

</script>
```

## toRefs()
```vue
<template>
  <form @submit.prevent="enviarDatos">
    <input type="text" v-model="nombre" placeholder="Nombre">
    <input type="number" v-model.number="edad" placeholder="Edad">
    <div>
      <input type="checkbox" v-model="cursos" value="HTML">
      HTML
      <input type="checkbox" v-model="cursos" value="CSS">
      CSS
      <input type="checkbox" v-model="cursos" value="JS">
      JS
    </div>
    <div>
      <input type="radio" v-model="nacionalidad" value="México">
      México
      <input type="radio" v-model="nacionalidad" value="Argentina">
      Argentina
      <input type="radio" v-model="nacionalidad" value="Salvador">
      Salvador
    </div>
    <div>
      <select v-model="nacionalidad">
        <option value="" disabled>Nacionalidad</option>
        <option>México</option>
        <option>Argentina</option>
        <option>Salvador</option>
      </select>
    </div>
    <button type="submit">Enviar</button>
    <pre>{{user}}</pre>
    <pre>{{users}}</pre>
  </form>
  
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'

const user = reactive({
  nombre: '',
  edad: 0,
  cursos: [],
  nacionalidad: ''
})

let {nombre, edad, cursos, nacionalidad} = toRefs(user)

const users = ref([])

const enviarDatos = () => {
  
  if(!nombre.value.trim()){
    console.log('nombre vacio')
    return
  }

  users.value.push({
    nombre: nombre.value,
    edad: edad.value,
    cursos: cursos.value,
    nacionalidad: nacionalidad.value
  })
  
  nombre.value = ''
  edad.value = 0
  cursos.value = []
  nacionalidad.value = ''

}

</script>
```

## Suspense
- [suspense vue 3](https://v3.vuejs.org/guide/migration/suspense.html#introduction)

:::warning
Suspense está en estapa experimental por lo tanto podría cambiar a futuro.
:::

Es común que los componentes necesiten realizar algún tipo de solicitud asincrónica antes de que puedan procesarse correctamente. Los componentes a menudo manejan esto localmente y en muchos casos es un enfoque perfectamente bueno.

El componente ``<suspense>`` proporciona una alternativa, lo que permite que la espera se maneje más arriba en el árbol de componentes en lugar de en cada componente individual.

- [pokeapi.co](https://pokeapi.co/)

:::warning
pokeapi.co es gratuita, por ende si se llegan hacer muchas peticiones en el mes puede encontrar el servidor caído, para trabajar tranquilos probar la api a principios de mes.
:::

App.vue
```vue
<template>
  <suspense>
    <template #default>
      <Pokemones />
    </template>
    <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </suspense>
</template>

<script setup>
import Pokemones from "@/components/Pokemones";

</script>
```

Pokemones.vuejs
```vue
<template>
    <pre>
        {{pokemones}}
    </pre>
</template>

<script>
import { ref } from 'vue'
export default {
    async setup() {
        const pokemones = ref([])
        const uri = 'https://pokeapi.co/api/v2/pokemon'
        try {
            const res = await fetch(uri)
            pokemones.value = await res.json()
        } catch (error) {
            console.log(error)
        }
        return {pokemones}
    },
}
</script>
```

