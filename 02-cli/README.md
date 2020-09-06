# Vue CLI
Vue viene cuenta con una herramienta para crear nuestros proyectos:

- [https://cli.vuejs.org/](https://cli.vuejs.org/)

## Instalación
- Contar con node.js versión 8.9 o superior (se recomienda v10 +) [https://nodejs.org/es/](https://nodejs.org/es/)
- `node -v` (v.10 +) 
- `npm -v` (v.6 +)

```
npm install -g @vue/cli
```

```
vue --version
```

## Crear un proyecto
[https://cli.vuejs.org/guide/creating-a-project.html#vue-create](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)

```
vue create hello-world
```

Con ``npx`` no es necesario instalar vue de forma global y siempre tendrás la última versión disponible.
```
npx vue create hello-world
```

Entrar a la carpeta
```
cd hello-world
```

Servidor
```
npm run serve
```

## Componentes
```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <TituloBanco titulo="Mi banco 2.0"/>
  </div>
</template>

<script>
import TituloBanco from './components/TituloBanco'

export default {
  name: 'App',
  components: {
    TituloBanco
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

## TituloBanco.vue
```vue
<template>
  <h1>{{titulo}}</h1>
</template>

<script>
export default {
    name: 'TituloBanco',
    props: {
        titulo: String
    }
}
</script>

<style scoped>
    h1 {
        font-weight: 300;
    }
</style>
```

Cuenta.vue
```vue
<template>
  <h3>Saldo: {{saldo}}</h3>
  <h4>Cuenta: {{cuenta}}</h4>
  <h4>Estado: {{estado ? 'Activa' : 'Cerrada'}}</h4>
  <h4 class="mb-0">Servicios disponibles: </h4>
  <div v-for="(item, index) in servicios" :key="index">
      {{ index + 1 }} - {{ item }}
  </div>
</template>

<script>
export default {
    data() {
        return {
            cuenta: 'Visa',
            saldo: 5000,
            estado: true,
            servicios: ['pagos','giros','transferencias']
        }
    }
}
</script>

<style>
    .mb-0 {
        margin-bottom: 0.5rem;
    }
</style>
```


## Custom Events
Supongamos que el componente hijo desea modificar algún dato del elemento padre, para esta operación tenemos que emitir un evento que se encuentre previamente configurado en el componente padre.

[https://es.vuejs.org/v2/guide/components-custom-events.html](https://es.vuejs.org/v2/guide/components-custom-events.html)

```vue
<template>
  <h3>Saldo: {{saldo}}</h3>
  <h4>Cuenta: {{cuenta}}</h4>
  <h4>Estado: {{estado ? 'Activa' : 'Cerrada'}}</h4>
  <h4 class="mb-0">Servicios disponibles: </h4>
  <div v-for="(item, index) in servicios" :key="index">
      {{ index + 1 }} - {{ item }}
  </div>
  <hr>
  <AccionSaldo texto="Agregar Saldo" @accion="agregarSaldo" />
  <AccionSaldo texto="Disminur Saldo" @accion="disminuirSaldo" />
</template>

<script>
import AccionSaldo from './AccionSaldo'
export default {
    components: {
        AccionSaldo
    },
    data() {
        return {
            cuenta: 'Visa',
            saldo: 5000,
            estado: true,
            servicios: ['pagos','giros','transferencias']
        }
    },
    methods: {
        agregarSaldo() {
            this.saldo = this.saldo + 100
        },
        disminuirSaldo() {
            if (this.saldo === 0) {
                alert('llegaste al final')
                return
            }
            this.cantidad = this.cantidad - 100
        }
    },
}
</script>
```

AccionSaldo.vue
```vue
<template>
    <button @click="accion">{{texto}}</button>
</template>

<script>
export default {
    props: {
        texto: String
    },
    methods: {
        accion(){
            this.$emit('accion')
        }
    }
}
</script>
```

## Tarea
Intenta agregar el atributo ``disabled`` dentro de ``AccionSaldo.vue``

<img :src="$withBase('/img/compu-1.gif')">

## Solución
```js
// Template
<AccionSaldo 
    texto="Disminur Saldo" 
    @accion="disminuirSaldo" 
    :desactivar="desactivar"
/>

// Methods
agregarSaldo() {
    this.saldo = this.saldo + 100
    this.desactivar = false
},
disminuirSaldo() {
    if (this.saldo === 0) {
        this.desactivar = true
        alert('llegaste al final')
        return
    }
    this.saldo = this.saldo - 100
}
```

AccionSaldo.vue
```vue
<template>
    <button @click="accion" :disabled="desactivar">{{texto}}</button>
</template>

<script>
export default {
    props: {
        texto: String,
        desactivar: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        accion(){
            this.$emit('accion')
        }
    }
}
</script>
```




