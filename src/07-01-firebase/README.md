# REST Firebase (option api)

Ya aprendimos a trabajar con LocalStorage pero la cosa se pone más entretenida si utilizamos Firebase, una base de datos proporcionada por Google!

## Firebase
Crear cuenta y acceder:

[https://firebase.google.com/](https://firebase.google.com/)

## LocalStorage
Como ahora vamos a trabajar con un servidor no será necesario guardar nuestros datos en LocalStorage :)

## Async Await
* [https://youtu.be/stiPdlSkTOI](https://youtu.be/stiPdlSkTOI)
* [Conceptos Mozilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona)
* Cuando se llama a una función async, esta devuelve un elemento Promise. 
* Una función async puede contener una expresión await, la cual pausa la ejecución de la función asíncrona y espera la resolución de la Promise pasada y, a continuación, reanuda la ejecución de la función async y devuelve el valor resuelto.
* La finalidad de las funciones async/await es simplificar el comportamiento del uso síncrono de promesas y realizar algún comportamiento específico en un grupo de Promises.

## Agregar

[https://firebase.google.com/docs/database/rest/save-data?hl=es](https://firebase.google.com/docs/database/rest/save-data?hl=es)


```js
async setTareas({ commit }, tarea) {
    try {
        const res = await fetch(`https://nombre-proyecto.firebaseio.com/tareas-api/${tarea.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        })
        const db = await res.json()
        console.log(db)
        commit('set', tarea)
    } catch (error) {
        console.log(error)
    }
},
```

## Leer

```js
async cargarLocalStorage({ commit }) {
      try {
        const res = await fetch(`https://nombre-proyecto.firebaseio.com/tareas-api.json`)
        const db = await res.json()
        
        const arrayDatos = []
        
        for (let id in db){
          // console.log(id)
          // console.log(db[id])
          arrayDatos.push(db[id])
        }
        console.log(arrayDatos)
        commit('cargar', arrayDatos)
      } catch (error) {
        console.log(error)
      }
    },
```

## Editar

```js
async updateTarea({ commit }, tarea) {
      try { 
        const res = await fetch(`https://nombre-proyecto.firebaseio.com/tareas-api/${tarea.id}.json`, {
          method: 'PATCH',
          body: JSON.stringify(tarea)
        })
        commit('update', tarea)
      } catch (error) {
        console.log(error)
      }
    }
  },
```

## Eliminar

```js
try {
        await fetch(`https://nombre-proyecto.firebaseio.com/tareas-api/${id}.json`, {
          method: 'DELETE'
        })
        commit('eliminar', id)
      } catch (error) {
        console.log(error)
      }
    },
```

## Reglas
Estamos trabajando en el modo de prueba, por ende dudará solo 30 días nuestros permisos, los cuales configuraremos en una sección posterior.
