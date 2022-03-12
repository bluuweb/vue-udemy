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
    },
    computed: {
        colorCantidad() {
            return this.cantidad > 100 ? 'text-success' : 'text-danger'
        }
    }
})