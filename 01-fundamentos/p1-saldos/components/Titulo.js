// Componentes
app.component('titulo-web', {
    data() {
        return {
            mensaje: 'Título desde un componente!'
        }
    },
    template:
        /*html*/
        `
        <h1>{{mensaje}}</h1>
    `
})