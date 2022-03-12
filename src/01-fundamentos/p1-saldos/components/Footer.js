app.component('footer-banco', {
    // props: ['cantidad', 'texto'],
    props: {
        cantidad: Number,
        texto: String
    },
    template: 
        /*html*/`
        <div>
            <h3>{{texto}}, año 2020 - cantidad: {{cantidad}}</h3>
        </div>
        `
})
