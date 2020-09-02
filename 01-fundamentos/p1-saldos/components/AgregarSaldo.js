app.component('agregar-saldo', {
    template: /*html*/`
        <button v-on:click="agregarSaldoHijo">Agregar Saldo</button>
    `,
    methods: {
        agregarSaldoHijo() {
            this.$emit('agregar-saldo');
        }
    }
})