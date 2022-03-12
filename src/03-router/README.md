# Vue Router
Vue Router es el enrutador oficial de Vue.js [https://router.vuejs.org/](https://router.vuejs.org/)

## Crear Proyecto
Elegir la opción de Vue Router en el CLI de vue.

- Tendremos dos carpetas adicionales, las cuales son "router" y "views"
- router: Archivo de configuración de rutas
- views: Almacena todos los componentes que se comportarán como componentes padres de nuestras vistas.

## router-link
- [https://router.vuejs.org/api/#router-link](https://router.vuejs.org/api/#router-link)
- Es el componente para permitir la navegación del usuario.
- La ubicación de destino se especifica con el atributo `to`

```vue{3-4}
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
</template>
```

```css
#nav a.router-link-exact-active {
  color: #42b983;
}
```

## router-view
- [https://router.vuejs.org/api/#router-view](https://router.vuejs.org/api/#router-view)
- Pintará al componente dinámico que tendremos configurado en ``router/index.js``

```vue{6}
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
</template>
```

## router/index.js
Este es el archivo de configuración de nuestras rutas: 
- Se llaman a los componentes que están dentro de las carpeta ``views``

```js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

## Mi primera ruta
Vamos a realizar un ejemplo para aterrizar la teoría.

- Crear un nuevo componente en la carpeta ``views``

```vue
<template>
  <h1>Blog</h1>
</template>

<script>
export default {

}
</script>
```

- Abrir `router/index.js` para agregar nueva vista:
- Tenemos dos opciones para llamar a nuestra vista, en este caso lo hacemos directamente en el objeto.

```js
{
    path: '/blog',
    name: 'Blog',
    component: () => import(/* webpackChunkName: "about" */ '../views/Blog.vue')
}
```

Visitar: `http://localhost:8080/blog`

```vue
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/blog">Blog</router-link> 
  </div>
  <router-view/>
</template>
```

## Componentes
No confundir con componentes, estos siguen cumpliendo su función principal que es encapsular nuestra lógica y hacerla reutilizable. Aunque son practiamente lo mismo que las vistas, es para manter un orden en nuestro trabajo.

Creando un título dinámico:
```vue
// Blog.vue
<template>
  <Titulo texto="Página de Blog v2" />
</template>

<script>
import Titulo from '../components/Titulo'
export default {
    components: {
        Titulo
    }
}
</script>
```

## Rutas con parámetros
Frecuentemente necesitamos una vista que pueda leer los parámetros de nuestra ruta, por ejemplo en el caso de un blog haciendo el llamado a un artículo en específico. [https://router.vuejs.org/guide/essentials/dynamic-matching.html#dynamic-route-matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html#dynamic-route-matching)

1. Crear Vista
```vue
<template>
  <Titulo texto="Artículo específico" />
</template>

<script>
import Titulo from '../components/Titulo'
export default {
    components: {
        Titulo
    }
}
</script>
```

2. Configurar `router/index.js`
```js
{
    path: '/blog/:id',
    name: 'Articulo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Articulo.vue')
}
```

3. Visitar `/blog/1` y cargará vista ``Articulo.vue``

```vue
<template>
  <Titulo texto="Artículo específico" />
  <h2>Parámetro: {{ $route.params.id }}</h2>
</template>
```

## Práctica
Vamos a realizar una práctica para aterrizar todo lo aprendido.

[https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)

```vue
<template>
  <Titulo texto="Página de Blog v2" />
  <button @click="consumirApi">Obtener datos</button>
</template>

<script>
import Titulo from '../components/Titulo'
export default {
    components: {
        Titulo
    },
    data() {
        return {
            arrayBlog: []
        }
    },
    methods: {
        async consumirApi(){
            try {
                const data = await fetch('https://jsonplaceholder.typicode.com/posts')
                const array = await data.json()
                console.log(array)
                this.arrayBlog = array
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
```

## Ciclo de vida de Vue
[https://v3.vuejs.org/guide/instance.html#instance-lifecycle-hooks](https://v3.vuejs.org/guide/instance.html#instance-lifecycle-hooks)

Cada instancia pasa por una serie de pasos de inicialización cuando se crea; por ejemplo, necesita configurar la observación de datos, compilar la plantilla, montar la instancia en el DOM y actualizar el DOM cuando los datos cambian. En el camino, también ejecuta funciones llamadas enlaces de ciclo de vida , lo que brinda a los usuarios la oportunidad de agregar su propio código en etapas específicas.

## created()
[https://v3.vuejs.org/api/options-lifecycle-hooks.html#beforecreate](https://v3.vuejs.org/api/options-lifecycle-hooks.html#beforecreate)
Se llama sincrónicamente después de que se crea la instancia. En esta etapa, la instancia ha terminado de procesar las opciones, lo que significa que se ha configurado lo siguiente: 

- data observation
- computed properties
- methods
- watch/event callbacks

```js
created() {
    this.consumirApi()
}
```

```vue
<template>
  <Titulo texto="Página de Blog v2" />
  <!-- <button @click="consumirApi">Obtener datos</button> -->
  <div v-for="item in arrayBlog" :key="item.id">
      {{ item.id }} - {{ item.title }}
  </div>
</template>
```

## router-link (práctica)
```vue
<template>
  <Titulo texto="Página de Blog v2" />
  <!-- <button @click="consumirApi">Obtener datos</button> -->
  <div v-for="item in arrayBlog" :key="item.id">
      <router-link :to="`/blog/${item.id}`">
        {{ item.id }} - {{ item.title }}
      </router-link>
  </div>
</template>
```

## articulo.vue (práctica)
```vue
<template>
  <Titulo texto="Artículo específico" />
  <h2>Parámetro: {{ $route.params.id }}</h2>
  <h3>{{ articulo.title }}</h3>
  <hr>
  <p>{{ articulo.body }}</p>
</template>

<script>
import Titulo from '../components/Titulo'
export default {
    components: {
        Titulo
    },
    data() {
        return {
            articulo: {}
        }
    },
    methods: {
        async getArticulo() {
            try {
                console.log(this.$route.params.id)
                const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`)
                const objeto = await data.json()
                this.articulo = objeto;
            } catch (error) {
                console.log(error)
            }
        }
    },
    created() {
        this.getArticulo()
    }
}
</script>
```