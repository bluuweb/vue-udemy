# Fundamentos Vue 3 (composition api)

## Objetivos
- Comprender los fundamentos de Vue 3.
- Realizar nuestro primer proyecto conociendo algunos conceptos claves.
- Poner en producción proyecto.

## Archivos del curso
- [github repo](https://github.com/bluuweb/mi-primer-proyecto-con-vu3)

## ¿Qué es Vue?
- [introduction](https://vuejs.org/guide/introduction.html#what-is-vue)
- Vue es un marco (Framework) de JavaScript para construir interfaces de usuario. 
- Se basa en HTML, CSS y JavaScript estándar, y proporciona un modelo de programación declarativo y basado en componentes que lo ayuda a desarrollar interfaces de usuario de manera eficiente, ya sea simple o compleja.

## Mi primer proyecto
- [herramientas de construcción](https://vuejs.org/guide/quick-start.html)
- herramientas de construcción: Una configuración de compilación nos permite usar **Single File Components (SFC)**. La configuración de compilación oficial de Vue se basa en Vite , una herramienta de compilación de interfaz que es moderna, liviana y extremadamente rápida.

:::warning node.js
- Se necesita tener instalado node.js
- [node.js](https://nodejs.org/en/)
- [curso de node.js](https://www.youtube.com/watch?v=xkHyM-K3Cd8&list=PLPl81lqbj-4Iy7yuRrVLn4V6isOVpvlpl&index=4)
:::

```sh
npm init vue@latest
```

```sh
✔ Project name: … <your-project-name>
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit testing? … No / Yes
✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in ./<your-project-name>...
Done.
```

```sh
> cd <your-project-name>
> npm install
> npm run dev
```

:::tip extension VSCode
- [extensión volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
:::

## Sintaxis de plantilla
- Vue utiliza una sintaxis de plantilla basada en HTML que le permite vincular declarativamente el DOM.
- Todas las plantillas de Vue son HTML sintácticamente válidas.
- Debajo del capó, Vue compila las plantillas en un código JavaScript altamente optimizado.
- Combinado con la reactividad, Vue es capaz de calcular la cantidad mínima de componentes a renderizar y aplicar la cantidad mínima de manipulaciones en el DOM.

```vue
<template>
    <h1>Hola Vue 3!<h1>
</template>
```

## interpolación de texto
- Interpolación de texto (bigote o llaves dobles) es una forma de insertar valores en una plantilla.

```vue
<script setup>
const name = 'Vue 3';
</script>

<template>
    <h1>Hola {{name}}!<h1>
</template>
```

## Enlaces de atributos
- Lo bigotes o llaves dobles no se pueden insertar dentro de los atributos HTML. En su lugar utilice una **`v-bind`** para enlazar el valor de un atributo.

```vue
<script setup>
    const name = "Vue 3";
    const styleColor = "color: red;";
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-bind:style="styleColor">Hola {{ name }}</h2>
</template>
```

Debido a que **`v-bind`** se usa con tanta frecuencia, tiene una sintaxis abreviada dedicada:


```vue
<h2 :style="styleColor">Hola {{ name }}</h2>
```

## Uso de expresiones de JavaScript
- Las expresiones de JavaScript se pueden usar en las plantillas de Vue.

```vue
<script setup>
    const name = "Vue 3";
    const styleColor = "color: red;";
    const active = true;
    const colors = ["blue", "red", "green"];
    const counter = 1;
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 :style="styleColor">Hola {{ name.toUpperCase() }}</h2>
    <h3>{{ active ? "Estoy activado" : "Estoy desactivado" }}</h3>
    <h4 :style="`color: ${colors[2]}`">Color con interpolación</h4>
    <h5>Contador: {{ counter + 1 }}</h5>
</template>
```

Cada enlace solo puede contener una sola expresión , lo siguiente NO funcionará:
```vue
<p>{{if(active) {return counter}}}</p>
```

## Directivas
- Las directivas son atributos especiales con el prefijo **``v-``** .
- El trabajo de una directiva es aplicar actualizaciones de forma reactiva al DOM

## v-if
- [doc v-if](https://vuejs.org/guide/essentials/conditional.html)
- La directiva **``v-if``** se usa para mostrar o ocultar un elemento de la plantilla.

```vue
<script setup>
    const name = "Vue 3";
    const active = true;
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-if="active">v-if en acción</h2>
</template>
```

## v-else
- Un elemento **``v-else``** debe seguir inmediatamente a un ``v-if`` o un ``v-else-if`` elemento; de lo contrario, no se reconocerá.

```vue
<script setup>
    const name = "Vue 3";
    const active = false;
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-if="active">v-if en acción</h2>
    <h2 v-else>v-else en acción</h2>
</template>
```

```vue
<script setup>
    const name = "Vue 3";
    const active = null;
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-if="active === true">Estoy en true</h2>
    <h2 v-else-if="active === false">Estoy en false</h2>
    <h2 v-else>Estoy indeciso</h2>
</template>
```

💔 Incorrecto:
```vue
<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-if="active === true">Estoy en true</h2>
    <h2 v-else-if="active === false">Estoy en false</h2>
    <p>Lorem ipsum dolor sit</p>
    <h2 v-else>Estoy indeciso</h2>
</template>
```

## v-show
- La directiva **``v-show``** se usa para mostrar o ocultar un elemento de la plantilla.
- **``v-show``** solo cambia la propiedad display CSS del elemento.
- En términos generales, **v-if** tiene costos de alternancia más altos mientras que **v-show** tiene costos de renderización inicial más altos. Así que prefiera **v-show** si necesita alternar algo con mucha frecuencia, y prefiera **v-if** si es poco probable que la condición cambie en el tiempo de ejecución.

```vue
<script setup>
    const name = "Vue 3";
    const active = false;
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 v-show="active">Estoy en true</h2>
</template>
```

## v-for
- [doc v-for](https://vuejs.org/guide/essentials/list.html)
- La directiva **``v-for``** se usa para iterar sobre una lista de elementos.
- Para darle a Vue una pista para que pueda rastrear la identidad de cada nodo y, por lo tanto, reutilizar y reordenar los elementos existentes, debe proporcionar un atributo **key** único para cada elemento.

```vue
<script setup>
    const name = "Vue 3";
    const arrayFrutas = ["🍎", "🍌", "🍉", "🍓", "🍒"];
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <ul>
        <li v-for="(fruta, index) in arrayFrutas" :key="index">
            {{ fruta }}
        </li>
    </ul>
</template>
```

```vue
<script setup>
    const name = "Vue 3";
    const arrayFrutas = [
        {
            name: "Manzana",
            price: "$1.00",
            description: "Una manzana",
        },
        {
            name: "Pera",
            price: "$2.00",
            description: "Una pera",
        },
        {
            name: "Naranja",
            price: "$3.00",
            description: "Una naranja",
        },
    ];
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <ul>
        <li v-for="fruta in arrayFrutas" :key="name">
            {{ fruta.name }} - {{ fruta.price }} - {{ fruta.description }}
        </li>
    </ul>
</template>
```

Objetos:
```vue
<script setup>
    const name = "Vue 3";

    const fruta = {
        name: "Naranja",
        price: "$3.00",
        description: "Una naranja",
    };
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <ul>
        <li v-for="(value, propiedad) in fruta">
            {{ propiedad }} : {{ value }}
        </li>
    </ul>
</template>
```

## v-for v-if
- [doc v-for v-if](https://vuejs.org/guide/essentials/list.html#v-for-with-v-if)
- Cuando existen en el mismo nodo, **v-if** tiene una prioridad más alta que **v-for**.
- Eso significa que la condición **v-if** no tendrá acceso a las variables del alcance de **v-for**:

```vue
<script setup>
const name = "Vue 3";
const arrayFrutas = [
    {
        name: "Manzana",
        price: "$1.00",
        description: "Una manzana",
        stock: 0,
    },
    {
        name: "Pera",
        price: "$2.00",
        description: "Una pera",
        stock: 10,
    },
    {
        name: "Naranja",
        price: "$3.00",
        description: "Una naranja",
        stock: 20,
    },
];
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <ul>
        <li
            v-for="fruta in arrayFrutas"
            :key="fruta.name"
            v-if="fruta.stock > 0"
        >
            {{ fruta }}
        </li>
    </ul>
</template>
```

Solución:
```html
<ul>
    <template v-for="fruta in arrayFrutas" :key="fruta.name">
        <li v-if="fruta.stock > 0">
            {{ fruta }}
        </li>
    </template>
</ul>
```

## Eventos
- [doc eventos](https://vuejs.org/guide/essentials/event-handling.html)
- Podemos usar la directiva **v-on**, que normalmente acortamos al símbolo **@**, para escuchar eventos DOM y ejecutar JavaScript cuando se activan. El uso sería **``v-on:click="handler"``** o con el atajo, **``@click="handler"``**.

```vue
<script setup>
    const name = "Vue 3";

    // método handleClick
    const handleClick = () => {
        console.log("me diste cick");
    };
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <button v-on:click="handleClick">Click aquí</button>
    <button @click="handleClick">Click aquí</button>
</template>
```

Parámetros:
```vue
<script setup>
    const name = "Vue 3";

    const handleClick = (message) => {
        console.log(message);
    };
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <button @click="handleClick('Mensaje desde botón')">Click aquí</button>
</template>
```

- [doc Modificadores](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers)

```html
<button @click.right.prevent="handleClick('Mensaje desde botón')">
    Click right
</button>
<button @click.middle="handleClick('Mensaje desde botón')">
    Click middle
</button>
```

## Variables reactivas

Siguiendo el ejemplo:

```vue
<script setup>
const name = "Vue 3";

let counter = 0;

const increment = () => {
    counter++;
    // efectivamente aumentar
    console.log(counter);
};
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2>{{ counter }}</h2>
    <button @click="increment">Click incremet</button>
</template>
```

## ref()

- **ref** es una forma de trabajar con la reactividad de Vue 3.
- **ref**: Es una referencia reactiva, en nuestro ejemplo necesitamos un entero que sea **"rastreable"**, por ende utilizaremos ref, una forma de trabajar con la reactividad de Vue 3.
- **ref** toma el argumento y lo devuelve envuelto dentro de un objeto con una value propiedad, que luego puede usarse para acceder o mutar el valor de la variable reactiva.
- DOM: Cuando muta el estado reactivo, **el DOM se actualiza automaticamente.**
- En el template no es necesario acceder al **.value**, ya que el valor de la variable reactiva se puede acceder directamente.

```vue
<script setup>
import { ref } from "vue";

const name = "Vue 3";

// counter ahora es una variable reactiva
const counter = ref(0);

const increment = () => {
    // mutamos el valor a través de .value
    counter.value++;
};
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2>{{ counter }}</h2>
    <button @click="increment">Click incremet</button>
</template>
```

## Práctica
- Agrega un botón para disminuir el contador.
- Agrega un botón para resetear el contador.
- Pinta el contador en rojo cuando el valor sea menor a cero.
- Pinta el contador en verde cuando el valor sea mayor a cero.

```vue
<script setup>
import { ref } from "vue";

const name = "Vue 3";

const counter = ref(0);

const increment = () => {
    counter.value++;
};

const decrement = () => {
    counter.value--;
};

const reset = () => {
    counter.value = 0;
};
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 :class="counter >= 0 ? 'positive' : 'negative'">
        {{ counter }}
    </h2>
    <button @click="increment">Incremet</button>
    <button @click="decrement">Decrement</button>
    <button @click="reset">Reset</button>
</template>

<style>
.negative {
    color: red;
}

.positive {
    color: green;
}
</style>
```

## Computed

- [doc computed](https://vuejs.org/guide/essentials/computed.html)
- Las propiedades computadas nos sirven para generar calculos en nuestros componentes, por ejemplo no se recomienda colocar demasiada lógica en nuestras plantillas HTML, ya que dificulta la interpretación de nuestros componentes.
- Por eso, para la lógica compleja que incluye datos reactivos, se recomienda utilizar una propiedad calculada 

```vue
<script setup>
import { ref, computed } from "vue";

const name = "Vue 3";

const counter = ref(0);

const increment = () => {
    counter.value++;
};

const decrement = () => {
    counter.value--;
};

const reset = () => {
    counter.value = 0;
};

const classCounter = computed(() => {
    if (counter.value === 0) {
        return "zero";
    }
    return counter.value > 0 ? "positive" : "negative";
});

</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 :class="classCounter">
        {{ counter }}
    </h2>
    <button @click="increment">Incremet</button>
    <button @click="decrement">Decrement</button>
    <button @click="reset">Reset</button>
</template>

<style>
.negative {
    color: red;
}

.positive {
    color: green;
}

.zero {
    color: black;
}
</style>
```

:::tip
- En lugar de una propiedad calculada, podemos definir la misma función como un método. Para el resultado final, los dos enfoques son exactamente iguales. Sin embargo, **la diferencia es que las propiedades calculadas se almacenan en caché en función de sus dependencias reactivas.**
- Una propiedad calculada solo se volverá a evaluar cuando algunas de sus dependencias reactivas hayan cambiado. 

```js
// método
const classCounter = () => {
    if (counter.value === 0) {
        return "zero";
    }
    return counter.value > 0 ? "positive" : "negative";
};
```

Es necesario invocar al método
```html
<h2 :class="classCounter()">
    {{ counter }}
</h2>
```

:::

## Bootstrap 5:
- CDN: revísalo en la página oficial: [getbootstrap](https://getbootstrap.com/)
- Puedes agregarlo en el index.HTML

```html
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
        <!-- CSS only -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
            crossorigin="anonymous"
        />
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/src/main.js"></script>
    </body>
</html>
```

## Practica
- Agrega un array y su respectivo método y botón add para almacenar los números favoritos del usuario.
- Pinta ese array utilizando **v-for**.
- Utiliza **:disabled** en el botón add, para que solo se pueda presionar si el array no contiene números repetidos. (utiliza una propiedad computada).

**:disabled** si es true el botón se bloquea:
```html
<button @click="add" :disabled="true">Add</button>
```

Solución:
```vue
<script setup>
import { ref, computed } from "vue";

const name = "Vue 3";

const counter = ref(0);
const arrayCounter = ref([]);

const increment = () => {
    counter.value++;
};

const decrement = () => {
    counter.value--;
};

const reset = () => {
    counter.value = 0;
};

const add = () => {
    arrayCounter.value.push(counter.value);
};

const blockNumber = computed(() => {
    const number = arrayCounter.value.find((num) => num === counter.value);
    return number || number === 0;
});

const classCounter = computed(() => {
    if (counter.value === 0) {
        return "zero";
    }
    return counter.value > 0 ? "positive" : "negative";
});
</script>

<template>
    <h1>Hola {{ name }}!</h1>
    <h2 :class="classCounter">
        {{ counter }}
    </h2>
    <button @click="increment">Incremet</button>
    <button @click="decrement">Decrement</button>
    <button @click="reset">Reset</button>
    <button @click="add" :disabled="blockNumber">Add</button>
    <ul>
        <li v-for="(item, index) in arrayCounter" :key="index">
            {{ item }}
        </li>
    </ul>
</template>

<style>
.negative {
    color: red;
}

.positive {
    color: green;
}

.zero {
    color: black;
}
</style>
```

## Con Bootstrap 5
```vue
<script setup>
import { ref, computed } from "vue";

const name = "Vue 3";

const counter = ref(0);
const arrayCounter = ref([]);

const increment = () => {
    counter.value++;
};

const decrement = () => {
    counter.value--;
};

const reset = () => {
    counter.value = 0;
};

const add = () => {
    arrayCounter.value.push(counter.value);
};

const blockNumber = computed(() => {
    const number = arrayCounter.value.find((num) => num === counter.value);
    return number || number === 0;
});

const classCounter = computed(() => {
    if (counter.value === 0) {
        return "zero";
    }
    return counter.value > 0 ? "positive" : "negative";
});
</script>

<template>
    <div class="container text-center mt-5">
        <h1>Hola {{ name }}!</h1>
        <h2 :class="classCounter">
            {{ counter }}
        </h2>

        <div class="btn-group">
            <button @click="increment" class="btn btn-success">Incremet</button>
            <button @click="decrement" class="btn btn-danger">Decrement</button>
            <button @click="reset" class="btn btn-secondary">Reset</button>
            <button
                @click="add"
                :disabled="blockNumber"
                class="btn btn-primary"
            >
                Add
            </button>
        </div>
        <h2 class="mt-3">Mis Favoritos</h2>
        <ul class="list-group mt-2">
            <li
                class="list-group-item"
                v-for="(item, index) in arrayCounter"
                :key="index"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<style>
.negative {
    color: red;
}

.positive {
    color: green;
}

.zero {
    color: black;
}
</style>

```

## Deploy
```sh
npm run build
npm run preview
```

- [netlify.com](https://www.netlify.com/)

## Archivos del curso
- [github repo](https://github.com/bluuweb/mi-primer-proyecto-con-vu3)
