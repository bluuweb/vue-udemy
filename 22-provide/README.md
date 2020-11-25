# Provide Inject

- [Definición](https://v3.vuejs.org/guide/component-provide-inject.html#working-with-reactivity)
- [Composition API](https://v3.vuejs.org/guide/composition-api-provide-inject.html#using-provide)

Por lo general, cuando necesitamos pasar datos del componente principal al secundario, usamos props. Pero esto en algunos casos puede ser molesto, sobre todo cuando tenemos muchos componentes secundarios anidados.

Una solución es utilizar provide e inyect, los componentes principales puedes servir como proveedores de dependencia para todos sus componentes secundarios.

<img :src="$withBase('/img/components_provide.png')">

## Ejemplo Reactivo

App.vue
```js
setup(){
  const contador = ref(0)

  provide("contador", contador)
}
```

Home.vue
```vue
<template>
  <div class="home">
    <h1>Home</h1>
    <contador-uno />
    <aumentar />
    <disminuir />
    <contador-dos />
  </div>
</template>

<script>
import Aumentar from '../components/Aumentar.vue'
import ContadorDos from '../components/ContadorDos.vue'
import ContadorUno from '../components/ContadorUno.vue'
import Disminuir from '../components/Disminuir.vue'

export default {
  name: 'Home',
  components: {ContadorUno, Aumentar, Disminuir, ContadorDos}
}
</script>
```

ContadorUno.vue
```vue
<template>
  <h2>Contador: {{contadorUno}}</h2>
</template>

<script>
import { inject } from 'vue'
export default {
    setup(){
        const contadorUno = inject("contador")
        return {contadorUno}
    }
}
</script>
```

Aumentar.vue
```vue
<template>
  <button @click="aumentar">Aumentar</button>
</template>

<script>
import { inject } from 'vue'
export default {
    setup(){
        const contador = inject("contador")

        const aumentar = () => {
            contador.value ++
        }

        return {aumentar}
    }
}
</script>
```

Disminuir.vue
```vue
<template>
  <button @click="disminuir">Disminuir</button>
</template>

<script>
import { inject } from 'vue'
export default {
    setup(){
        const contador = inject('contador')
        const disminuir = () => {contador.value --}
        return {disminuir}
    }
}
</script>
```

ContadorDos.vue
```vue
<template>
  <h3>Contador Dos: {{contador}}</h3>
</template>

<script>
import { inject } from 'vue'
export default {
    setup(){
        const contador = inject('contador')
        return {contador}
    }
}
</script>
```

## Práctica ToDo

App.vue
```vue
<template>
  <div class="container">
    <tarea-app />
  </div>
</template>

<script>
import TareaApp from './components/TareaApp.vue'

export default {
  components: { TareaApp },
  name: 'App'
}
</script>
```

TareaApp.vue
```vue
<template>
    <h1 class="my-5">Lista de tareas</h1>
    <hr>

    <tarea-formulario />

    <div 
        class="alert alert-dark mt-3"
        v-if="Object.keys(tareas).length === 0"
    >
        No hay tareas 😍
    </div>

    <tarea-item
        v-for="tarea in tareas" :key="tarea.id"
        :tarea="tarea"
    />
</template>

<script>
import { provide, ref, watchEffect } from 'vue'
import TareaFormulario from './TareaFormulario.vue'
import TareaItem from './TareaItem.vue'

export default {
    components: {
        TareaFormulario,
        TareaItem
    },
    setup(){
        const tareas = ref({})
        provide('tareas', tareas)

        if(localStorage.getItem('tareas')){
        tareas.value = JSON.parse(localStorage.getItem('tareas'))
        }

        watchEffect(() => {
        localStorage.setItem('tareas', JSON.stringify(tareas.value))
        })

        return {tareas}
    }
}
</script>
```

TareaFormulario.vue
```vue
<template>
  <form @submit.prevent="agregarTarea">
    <input 
        type="text"
        placeholder="Agregar tarea..."
        class="form-control my-2"
        v-model="texto"
    >
    <button
        type="submit"
        class="btn btn-dark btn-block"
    >Agregar</button>
  </form>
</template>

<script>
import { inject, ref } from 'vue'
export default {
    setup(){
        const texto = ref('')
        const tareas = inject('tareas')
        const agregarTarea = () => {
            const tarea = {
                texto: texto.value,
                id: Date.now(),
                estado: false
            }

            texto.value = ''
            tareas.value[tarea.id] = tarea
        }
        return {texto, agregarTarea}
    }
}
</script>
```

TareaItem.vue
```vue
<template>
  <div
    class="mt-3 alert d-flex justify-content-between align-items-center"
    :class="tarea.estado ? 'alert-primary' : 'alert-warning'"
  >
    <p class="m-0" :class="{ tachado: tarea.estado }">
      {{ tarea.texto }}
    </p>
    <h3 class="m-0">
      <i
        class="fas text-success mr-2"
        :class="tarea.estado ? 'fa-undo-alt' : 'fa-check-circle'"
        role="button"
        @click="accionTarea(tarea.id)"
      ></i>
      <i
        class="fas fa-minus-circle text-danger"
        role="button"
        @click="eliminarTarea(tarea.id)"
      ></i>
    </h3>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  props: {
    tarea: { type: Object, required: true },
  },
  setup() {
    const tareas = inject("tareas");

    const eliminarTarea = (id) => {
      // console.log(id)
      delete tareas.value[id];
    };

    const accionTarea = (id) => {
      tareas.value[id].estado = !tareas.value[id].estado;
    };

    return { eliminarTarea, accionTarea };
  },
};
</script>

<style>
.tachado {
  text-decoration: line-through;
}
</style>

```