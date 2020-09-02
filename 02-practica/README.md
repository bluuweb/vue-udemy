# Práctica Cuestionario
Aterrizaremos lo aprendido hasta ahora:

## Vue 3 + Bootstrap

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuestionario</title>

    <!-- CDN Vue 3 -->
    <script src="https://unpkg.com/vue@next"></script>

    <!-- CDN Bootstrap 4 -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

</head>
<body>
    <div id="app" class="container mt-5">
        <titulo titulo="Cuestionario Vue"></titulo>
    </div>

    <script src="app.js"></script>
    <script src="components/Titulo.js"></script>
    <script>
        app.mount('#app')
    </script>
</body>
</html>
```

```js
const app = Vue.createApp({

})
```

```js
// components/Titulo.js

app.component('titulo', {
    props: ['titulo'],
    template: /*html*/`
        <h1>{{titulo}}</h1>
    `
})
```

## Preguntas
```js
// app.js

data() {
    return {
        preguntas: [
            {
                id: 1,
                texto: 'Pregunta #1',
                respuesta: null
            },
            {
                id: 2,
                texto: 'Pregunta #2',
                respuesta: null
            },
            {
                id: 3,
                texto: 'Pregunta #3',
                respuesta: null
            },
            {
                id: 4,
                texto: 'Pregunta #4',
                respuesta: null
            }
        ]
    }
},
```

```js
app.component('pregunta', {
    props: {
        objetoPregunta: Object
    },
    template: /*html*/`
    <div class="my-3">
        <p class="h5 lead">{{objetoPregunta.texto}}</p>
    </div>
    `
})
```

```html
<pregunta
    v-for="item in preguntas" :key="item.id"
    :objeto-pregunta="item"
></pregunta>
```

## Guardar Respuesta
```js
// app.js

methods: {
    guardarRespuesta(objeto) {
        console.log(objeto)
        this.preguntas = this.preguntas.map(item => item.id === objeto.id ? objeto : item)
        console.log(this.preguntas)
    },
}
```

```html
<pregunta
    v-for="item in preguntas" :key="item.id"
    :objeto-pregunta="item"
    @guardar-respuesta="guardarRespuesta"
></pregunta>
```

```js
app.component('pregunta', {
    props: {
        objetoPregunta: Object
    },
    template: /*html*/`
    <div class="my-3">
        <p class="h5 lead">{{objetoPregunta.texto}}</p>
        <button class="btn btn-success mr-2" @click="respuestaCliente(true)">Verdadero</button>
        <button class="btn btn-danger" @click="respuestaCliente(false)">Falso</button>
        <div v-if="objetoPregunta.respuesta !== null" class="text-muted">
            Respuesta: {{objetoPregunta.respuesta}}
        </div>
    </div>
    `,
    methods: {
        respuestaCliente(res) {
            this.objetoPregunta.respuesta = res
            this.$emit('guardar-respuesta', this.objetoPregunta);
        }
    }
})
```

## Botón Enviar
```js
// app.js

computed: {
    revisarRespuestas() {
        const cantidadRespuestas = this.preguntas.filter(item => item.respuesta === null);
        console.log(cantidadRespuestas)
        if (cantidadRespuestas.length === 0) {
            console.log('todas respondidas')
            return true
        } else {
            console.log('faltan')
            return false
        }
    }
}
```

```html
<enviar
    :activar="revisarRespuestas"
>
</enviar>
```

```js
app.component('enviar', {
    props: {
        activar: Boolean
    },
    data() {
        return {
            activarEnvio: false
        }
    },
    template: /*html*/`
    <div>
        <button 
            class="btn btn-dark btn-block" 
            v-if="activar"   
        >
            Enviar...
        </button>
    </div>
    `
})
```

## Enviando y Reiniciar
```js
app.component('enviar', {
    props: {
        activar: Boolean
    },
    data() {
        return {
            activarEnvio: false
        }
    },
    template: /*html*/`
    <div>
        <button 
            class="btn btn-dark btn-block" 
            v-if="activar" 
            @click="enviando"
            :class="[activarEnvio ? 'disabled' : '']"    
        >
            Enviar...
        </button>
        <div class="text-center mt-3" v-if="activarEnvio">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
    `,
    methods: {
        enviando() {
            this.activarEnvio = true
            setTimeout(() => {
                this.activarEnvio = false
                this.$emit('reiniciar')
            }, 2000);
        }
    }
})
```

```html
<enviar
    :activar="revisarRespuestas"
    @reiniciar="reiniciar"
>
</enviar>
```

```js
// app.js

methods: {
    guardarRespuesta(objeto) {
        console.log(objeto)
        this.preguntas = this.preguntas.map(item => item.id === objeto.id ? objeto : item)
        console.log(this.preguntas)
    },
    reiniciar() {
        this.preguntas = [
            {
                id: 1,
                texto: 'Pregunta #1',
                respuesta: null
            },
            {
                id: 2,
                texto: 'Pregunta #2',
                respuesta: null
            },
            {
                id: 3,
                texto: 'Pregunta #3',
                respuesta: null
            },
            {
                id: 4,
                texto: 'Pregunta #4',
                respuesta: null
            }
        ]
    }
},
```