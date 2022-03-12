const app = Vue.createApp({
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
})