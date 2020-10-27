# Composition API
Es una alternativa que podrá solucionar diferentes problemas de Vue 2: 

- Legibilidad cuando nuestros componentes son muy grandes
- Reutilización de código tiene sus inconvenientes
- Soporte limitado para TypeScript

## Cuando utilizarla
- Cuando necesitas una compatibilidad al 100% de TypeScript
- El componente es demaciado grande y necesitas organizar por función
- Necesitas reutilizar código de otros componentes

## setup()
La setup se ejecuta antes de que se cree el componente, una vez que props se resuelven, y sirve como punto de entrada para las API de composición.

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h2>{{contador}}</h2>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const contador = ref(5);
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
    const contador = ref(5);
    console.log(contador.value)
    return {contador}
  }
};
</script>
```

## Methods

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>{{ contador }}</h2>
    <button @click="incrementar">Aumentar</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(){
    const contador = ref(5)

    function incrementar() {
      contador.value ++
    }

    return {contador, incrementar}
  }
}
</script>
```

Hasta el momento también funcionan las funciones de flecha.
```js
const incrementar = () => {
    contador.value ++
}
```

## Computed
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>{{ contador }}</h2>
    <button @click="incrementar" :disabled="bloquear">Aumentar</button>
    <h3>Aumento máximo 10, quedan {{10 - contador}}</h3>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup(){
    const contador = ref(5)

    const bloquear = computed(() => {
      return 10 === contador.value ? true : false
    })

    const incrementar = () => {
      contador.value ++
    }

    return {contador, incrementar, bloquear}
  }
}
</script>
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

