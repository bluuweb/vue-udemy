# Fundamentos

## ¿Qué es Vue?
* Vue es un framework progresivo para construir interfaces de usuario.
* Diseñado para ser adoptado gradualmente.
* Podemos crear SPA single web application.
* [https://v3.vuejs.org/guide/introduction.html](https://v3.vuejs.org/guide/introduction.html)

## Instalación
De manera sencilla comenzaremos con el CDN: [https://v3.vuejs.org/guide/installation.html#cdn](https://v3.vuejs.org/guide/installation.html#cdn)

```html
<script src="https://unpkg.com/vue@next"></script>
```

## Primero proyecto

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi primer proyecto con Vue 3!</title>
    <!-- CDN vue 3 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>
<body>
    <div id="app">
        <h1>Hello Vue 3!</h1>
        <h2>Tipo de cuenta: {{cuenta}}</h2>
    </div>
    <script src="main.js"></script>
</body>
</html>
```

```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Vista'
        }
    }
})
```

```html
<script src="main.js"></script>
<script>
    app.mount('#app');
</script>
```

* Estamos representando datos al DOM de manera sencilla.
* Ahora todo es reactivo.

## Llaves dobles
* Nos permite escribir expresiones de JS, osea ejecutar Javascript dentro de nuestro HTML.
* En el ejemplo estamos "preguntando" por nuestro dato, lo cual provoca una comunicación directa generando un DOM actualizado, en otras palabras es reactivo.

```html
{{ cuenta }}
```

Si cambiamos el valor de cuenta, verás que se actualiza automáticamente el DOM.

```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Corriente'
        }
    }
})
```

Ejemplo:
```html
<h2>Saldo disponible: {{ cantidad > 1 ? cantidad : 'Sin saldo' }}</h2>
```
```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Vista',
            cantidad: 0
        }
    }
})
```

## v-bind
Para crear vínculos reactivos entre nuestros datos y los <b>"atributos de HTML"</b> utilizamos una directiva de Vue llamada ``v-bind``

```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Vista',
            cantidad: 0,
            enlaceYoutube: 'https://youtube.com/bluuweb',
        }
    }
})
```

```html
<a href="{{enlaceYoutube}}">Youtube</a>
```

<span style="font-size:30px">😖</span>
Para que nuestro ejemplo funcione tenemos que utilizar ``v-bind``


```html
<a v-bind:href="enlaceYoutube">Youtube</a>
```

<span style="font-size:30px">😍</span>
Abreviado
```html
<a :href="enlaceYoutube">Youtube</a>
```

También puedes utilizar ``v-bind ``por ejemplo en:
```html
<img :src="enlaceImagen" :alt="descripcion">
<p :class="claseCss">Lorem ipsum dolor sit.</p>
<p :style="propiedadCss">Lorem ipsum dolor sit.</p>
```

## v-if v-else
Existen directivas especiales para trabajar con datos condicionales, por ejemplo: 

```html
<h2 v-if="estado">Cuenta activada</h2>
<h2 v-else>Cuenta desactivada</h2>
```

```js{4}
return {
    cuenta: 'Vista',
    cantidad: 0,
    estado: true,
    enlaceYoutube: 'https://youtube.com/bluuweb',
    enlaceImagen: 'assets/escritorio.jpg',
    descripcion: 'Descripción de un escritorio'
}
```

Ahora pasemos este ejercicio a directivas de Vue:
```html
<h2>Saldo disponible: {{ cantidad > 1 ? cantidad : 'Sin saldo' }}</h2>
```

Podemos hacer lo siguiente: 
```html
<h2 v-if="cantidad > 100">Cantidad: {{cantidad}}</h2>
<h2 v-else-if="cantidad <= 100 && cantidad > 0">
    Cantidad: <span style="color:red">{{cantidad}}</span>
</h2>
<h2 v-else>Sin cantidad: {{cantidad}}</h2>
```

## v-for
Podemos recorrer array y array de objetos con directivas de Vue: `v-for`

```js
data() {
    return {
        cuenta: 'Vista',
        cantidad: 200,
        estado: true,
        servicios: ['Transferencias', 'Pagos', 'Giros']
    }
}
```

```html
<hr>
<h2>Servicios disponibles:</h2>
<ul>
    <li v-for="item in servicios">{{item}}</li>
</ul>
```

#### key
Siempre que trabajemos con v-for, Vue nos pedirá que estos elementos tengan una llave única, podemos agregar por ahora un index.
```html
<ul>
    <li 
    v-for="(item, index) in servicios" :key="index"
    >
        {{index + 1}} - {{item}}
    </li>
</ul>
```

## v-on:click [Eventos]
Agreguemos un evento que nos permita modificar la cantidad o saldo de nuestra cuenta:

```html
<button v-on:click="agregarSaldo">Agregar Saldo</button>
```

Abreviado:
```html
<button @click="agregarSaldo">Agregar Saldo</button>
```

```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Vista',
            cantidad: 200,
            estado: true,
            servicios: ['Transferencias', 'Pagos', 'Giros'],
        }
    },
    methods: {
        agregarSaldo() {
            this.cantidad = this.cantidad + 100
        }
    }
})
```

## Práctica
Vamos a repasar lo aprendido con el botón disminuir:
```html
<button v-on:click="disminuirSaldo" :disabled="desactivar">Disminuir Saldo</button>
```

```js
const app = Vue.createApp({
    data() {
        return {
            cuenta: 'Vista',
            cantidad: 0,
            estado: true,
            servicios: ['Transferencias', 'Pagos', 'Giros'],
            desactivar: false
        }
    },
    methods: {
        agregarSaldo() {
            this.cantidad = this.cantidad + 100
            this.desactivar = false
        },
        disminuirSaldo() {
            if (this.cantidad === 0) {
                alert('llegaste al final')
                this.desactivar = true
                return
            }
            this.cantidad = this.cantidad - 100
        }
    }
})
```

## Class dinámico
```html
<!-- operador ternario -->
<h2 
    class="bg-dark"
    :class="[cantidad > 100 ? 'text-success' : 'text-danger']"
    :style="{'font-size': '50px'}"
>
    Cantidad: {{cantidad}}
</h2>
```

## Computed
Las propiedades computadas nos sirven para generar calculos en nuestros componentes, por ejemplo no se recomienda colocar demasiada lógica en nuestras plantillas HTML, ya que dificulta la interpretación de nuestros componentes.

```jsx
:class="[cantidad > 100 ? 'text-success' : 'text-danger']"
```

```js
computed: {
    colorCantidad() {
        return this.cantidad > 100 ? 'text-success' : 'text-danger'
    }
}
```

```jsx
:class="colorCantidad"
```

## Componentes
Son instancias reutilizables, así podemos ir estructurando la lógica de nuestro proyecto en diferentes secciones o partes.

::: warning
* Es muy importante el orden en este ejemplo, ya que por ahora estamos conociendo los fundamentos, posteriormente veremos ejemplos más avanzados.
* Nombre del componente en minúsculas y separados de guión medio para evitar errores.
* ``/*html*/`` Extensión de VSC: [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)
:::

```js
// components/Footer.js
app.component('footer-banco', {
    template: 
        /*html*/`
        <div>
            <h3>Pie de página, año 2020</h3>
        </div>
        `
})
```

```html{2,8}
<hr>
<footer-banco />
<footer-banco />
<footer-banco />
<footer-banco />

<script src="main.js"></script>
<script src="components/Footer.js"></script>
<script>
    const mountedApp = app.mount('#app');
</script>
```

## Props
Si quisieramos enviar información desde nuestro componente padre a nuestro nuevo componente, podemos utilizar los `props`

```js
app.component('footer-banco', {
    props: ['cantidad'],
    template: 
        /*html*/`
        <div>
            <h3>Pie de página, año 2020 - cantidad: {{cantidad}}</h3>
        </div>
        `
})
```

```html
<footer-banco cantidad="mil pesos" />
```

Cantidad dinámica con ``v-bind``:
```html
<footer-banco :cantidad="cantidad" />
```

Más de un props:
```js
props: ['cantidad', 'texto'],
```

```html
<footer-banco :cantidad="cantidad" texto="Pie de página" />
```

Tipo de dato:
```js
props: {
    cantidad: Number,
    texto: String
},
```

Documentación oficial:
```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

:::warning CamelCase
Dentro del objeto props podemos agregar palabras compuestas con camelCase pero en el llamado de nuestro componente tiene que ir separado de un guión.

```js
props: {
    cantidad: Number,
    textoFooter: String,
}
```
```html
<footer-banco :cantidad="cantidad" texto-footer="Pie de página" />
```
:::

## Props Default
Podemos establecer un valor predeterminado en caso que el componente no reciba el props en cuestión.
```js
props: {
    texto: String,
    desactivar: {
        type: Boolean,
        default: false
    }
}
```














