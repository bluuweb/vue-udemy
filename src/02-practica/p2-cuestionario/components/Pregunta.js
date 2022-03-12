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