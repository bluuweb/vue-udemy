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