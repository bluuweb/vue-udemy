# Formularios
Una parte esencial de todo proyecto son los formularios, por ende vamos a jugar!

## Opcional
Configuraré un navbar con Bootstrap 4 pero es 100% opcional:
```vue
<template>
  <div class="navbar navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">APP</router-link>
    <div class="d-flex">
        <router-link to="/" class="btn btn-dark">Tareas</router-link>
    </div>
  </div>
</template>
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
export default {
  components: {
    Navbar
  }
}
</script>
```

## v-model
[https://v3.vuejs.org/guide/forms.html#form-input-bindings](https://v3.vuejs.org/guide/forms.html#form-input-bindings)

Puede usar la ``v-model`` directiva para crear enlaces de datos bidireccionales en la entrada de formulario, área de texto y elementos seleccionados. 

```vue
<template>
  <form class="mt-3">
    <input 
      type="text" 
      placeholder="Nombre Tarea"
      class="form-control"
      v-model="nombre"
    >
  </form>
  <div>
    <p>{{nombre}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: ''
    }
  },
}
</script>
```

Objeto:
```vue
<template>
  <form class="mt-3">
    <input 
      type="text" 
      placeholder="Nombre Tarea"
      class="form-control"
      v-model="tarea.nombre"
    >
  </form>
  <div>
    <p>{{tarea}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tarea: {nombre: ''}
    }
  },
}
</script>
```

## checkbox
```html
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
```

## Radio
```html
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
```

## Number
```html
<div class="my-2">
  <input 
    type="number"
    class="form-control"
    placeholder="numero"
    v-model.number="tarea.numero"
  >
</div>
```

## Trim
Si desea que los espacios en blanco de la entrada del usuario se recorten automáticamente
```html
<input 
  type="text" 
  placeholder="Nombre Tarea"
  class="form-control"
  v-model.trim="tarea.nombre"
>
```

## Submit
```js
@submit.prevent="procesarFormulario"
```

```js
methods: {
  procesarFormulario(){
    if(this.tarea.nombre.trim() === ''){
      console.log('nombre Vacío')
      return
    }
    console.log(this.tarea)
  }
}
```

## Disabled
```js
computed: {
  bloquear(){
    return this.tarea.nombre.trim() === '' ? true : false
  }
}
```

```html
<button 
  class="btn btn-block btn-dark" 
  type="submit"
  :disabled="bloquear"
>
  Agregar
</button>
```

## Limpiar
```js
methods: {
  procesarFormulario(){
    if(this.tarea.nombre.trim() === ''){
      console.log('nombre Vacío')
      return
    }
    console.log(this.tarea)
    this.tarea = {nombre: '', categoria: [], estado: '', numero: 0}
  }
},
```

