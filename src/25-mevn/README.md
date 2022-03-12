# MEVN
- MongoDB
- Express
- Vue.js
- Node.js

- [https://api-prueba-200.herokuapp.com/](https://api-prueba-200.herokuapp.com/)

## API REST
Configuraremos un Servidor de Express con JWT y MongoDB.

## Paso a paso
- Crear Servidor con Express
- Configurar Rutas de Usuario
- Validar req.body con Express Validator
- Conectar a MongoDB a través de Mongoose
- Crear Schema Usuarios
- Crear nuevos usuarios en DB
- Encriptar contraseñas con bcryptjs
- Generar Token con jsonwebtoken

## Enlaces útiles
- [respuestas del servidor "status"](https://developer.mozilla.org/es/docs/Web/HTTP/Status)
- [mongoosejs](https://mongoosejs.com/)
- [validators](https://github.com/validatorjs/validator.js#validators)

## ¿Qué es API REST?
Para este ejercicio práctico realizaremos una API REST, que un estándar (reglas y especificaciones) para la transferencia de información entre cliente y servidor, utilizaremos respuestas en JSON y los típicos verbos HTTP: POST, GET, DELETE, PUT.

Ventajas de hacer una API REST (existen más, se los dejo como tarea):
* Podemos conectar múltiples aplicaciones a nuestro servidor, ya sea página web, aplicación móvil, aplicación para escritorio, etc.
* Youtube por ejemplo cuenta con una api rest para poder implementar sus videos ya sea desde el sitio web o su aplicación móvil.

## JWT
JWT (JSON Web Token): [https://jwt.io/](https://jwt.io/)
1. Es un token de seguridad que nosotros creamos al momento que el usuario se registra con sus credenciales.
2. Este token se devuelve al cliente el cual tendrá que enviar cada vez que solicita información al servidor.
3. Se divide en 3 partes: Header, Payload y Verify Signature: Revisar: [https://jwt.io/](https://jwt.io/)

Recursos:
* [jwt cómo funciona](https://openwebinars.net/blog/que-es-json-web-token-y-como-funciona/)
* [jwt autenticación](https://www.developerro.com/2019/03/12/jwt-api-authentication/)

Ya que sabemos más o menos como se comportará nuestro login, es momento de configurar nuestro servidor con Express y JWT.

## Requisitos

1. Haber realizado el curso de node.js Fundamentos: [Ver curso aquí](https://www.youtube.com/watch?v=mG4U9t5nWG8&list=PLPl81lqbj-4IEnmCXEJeEXPepr8gWtsl6)
2. Tener instalado node.js [https://nodejs.org/es/](https://nodejs.org/es/)
3. Instalar Postman [postman.com](https://www.postman.com/downloads/)

## Servidor Express
```
npm init -y
```

```
Crear index.js
```

```
npm i express
npm i express-validator
npm i mongoose
npm i bcryptjs
npm i dotenv
npm i jsonwebtoken
npm i cors
npm i -D nodemon
```

Si quisieran instalar una versión específica
```
npm i express@4.10.1
```

package.json
```json
"scripts": {
    "dev": "nodemon .",
    "start": "node ."
},
```

.gitignore
```
node_modules
.env
```

carpetas
```
routes/api
models
config
middlewares
```

index.js
```js
const express = require("express");
const cors = require('cors');

const app = express();

// Middleware aceptar req.body y CORS
app.use(express.json({ extended: false }));
app.use(cors())

// Rutas
app.get("/", (req, res) => res.send("api 🚀"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("3 2 1... 🚀");
});
```

.env
```
mongoURI=
TOKEN_SECRET=
```

Ejecutar servidor
```
npm run dev
```

Hacer petición en Postman
```
http://localhost:5000/
```

## Rutas
NOTA: Se puede llamar a router de diferentes formas:
```js
const router = require('express').Router();
```
```js
const express = require('express');
const router = express.Router()
```
```js
const {Router}= require('express');
const router = Router()
```

routes/api/auth.js
```js
const router = require('express').Router();

// Ruta: api/user/signup
// Acceso: Público
// Descripción: Permite crear cuentas de usuario
router.post('/signup', async (req, res) => {

    res.send('ruta signup')
})

module.exports = router;
```

index.js
```js
// Rutas
app.use("/api/user", require("./routes/auth"));
```

probar en postman:
```
http://localhost:5000/api/user/signup
```

## Express Validator
- [express-validator](https://express-validator.github.io/docs/)

routes/api/auth.js
```js
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

// Ruta: api/user/signup
// Acceso: Público
// Descripción: Permite crear cuentas de usuario
router.post(
  "/signup",
  [
    body("name", "Ingrese un nombre").trim().notEmpty(),
    body("email", "Ingrese un email válido").isEmail(),
    body("password", "Contraseña de 6 o más carácteres").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    res.send("ruta signup");
  }
);

module.exports = router;
```

```js
// Ruta: api/user/login
// Acceso: Público
// Descripción: Permite accedera a usuarios
router.post(
  "/login",
  [
    body("email", "Ingrese un email válido").isEmail(),
    body("password", "Contraseña de 6 o más carácteres").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    res.send("ruta login");
  }
);
```

## MongoDB
[https://cloud.mongodb.com/](https://cloud.mongodb.com/)

Crear usuario Database Access y agregar a .env
```
mongoURI=mongodb+srv://usuario:contraseña@cluster0.ncdk5.mongodb.net/api-rest
```

config/db.js
```js
const mongoose = require("mongoose");
require("dotenv").config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB conectada...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = conectarDB;
```

index.js
```js
const express = require("express");
const conectarDB = require("./config/db");

const app = express();

// Conectar a DB
conectarDB();
```

## Schema
models/User.js
```js
const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = model("user", UserSchema);
```

## Signup
routes/api/auth.js
```js
const User = require("../models/User");

// Ruta: api/user/signup
// Acceso: Público
// Descripción: Permite crear cuentas de usuario
router.post(
  "/signup",
  [
    body("name", "Ingrese un nombre").trim().notEmpty(),
    body("email", "Ingrese un email válido").isEmail(),
    body("password", "Contraseña de 6 o más carácteres").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Usuario ya existe en db" }] });
      }
      user = new User(req.body);
      await user.save();
      return res.json({
        errors: false,
        uid: user.id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
      });
    }
  }
);
```

## Encriptar Contraseña

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

```js
const bcrypt = require("bcryptjs");

// Todo lo anterior...
user = new User(req.body);

const salt = bcrypt.genSaltSync(10);
user.password = bcrypt.hashSync(password, salt);

await user.save();
```

## JSON Web Token

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [https://jwt.io/](https://jwt.io/)

```js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Todo lo anterior...
const payload = {
    uid: user.id,
    name: user.name,
    email: user.email,
};

jwt.sign(
  payload,
  process.env.jwtSecret,
  { expiresIn: "20 days" },
  (err, token) => {
    if (err) throw err;
    res.json({
      errors: false,
      token: token,
    });
  }
);
```

## Login

```js
/ Ruta: api/user/login
// Acceso: Público
// Descripción: Permite accedera a usuarios
router.post(
  "/login",
  [
    body("email", "Ingrese un email válido").isEmail(),
    body("password", "Contraseña de 6 o más carácteres").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "No existe correo" }],
        });
      }

      const passwordOK = bcrypt.compareSync(password, user.password);
      if (!passwordOK) {
        return res.status(400).json({
          errors: [{ msg: "Contraseña incorrecta" }],
        });
      }

      const payload = {
        uid: user.id,
        name: user.name,
        email: user.email,
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: "20 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            errors: false,
            token: token,
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
      });
    }
  }
);
```

## Validar Token

middlewares/requireAuth.js
```js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      errors: [{ msg: "Sin token 😲" }],
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.jwtSecret);

    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      errors: [{ msg: "Token no válido 🤬" }],
    });
  }
};

module.exports = requireToken;
```

Ruta: api/user/validar
```js
router.get("/validar", tokenAuth, (req, res) => {
  res.json({
    errors: false,
    msg: "Todo perfecto!",
  });
});
```

## TODO

routes/todo.js
```js
const router = require("express").Router();
const tokenAuth = require("../middlewares/tokenAuth");

router.get("/", tokenAuth, (req, res) => {
  res.json(req.uid);
});

module.exports = router;
```

```js
const router = require("express").Router();
const tokenAuth = require("../middlewares/tokenAuth");
const { body, validationResult } = require("express-validator");

router.get("/", tokenAuth, (req, res) => {
  res.json(req.uid);
});

router.post(
  "/",
  [tokenAuth, body("text", "Ingrese un texto").trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    res.json(req.body);
  }
);

module.exports = router;
```

## Schema Todo
```js
const { Schema, model } = require("mongoose");

const TodoSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Todo = model("todo", TodoSchema);
```

## POST Todo
```js
router.post(
  "/",
  [tokenAuth, body("text", "Ingrese un texto").trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const objetoTodo = new Todo(req.body);
    objetoTodo.uid = req.uid;

    try {
      const todo = await objetoTodo.save();
      res.json({
        errors: false,
        todo: todo,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
      });
    }
  }
);
```

## Get Todos
```js
router.get("/", tokenAuth, async (req, res) => {
  try {
    const todos = await Todo.find({ uid: req.uid });

    res.json({
      errors: false,
      todos: todos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
    });
  }
});
```

## Delete Todo
```js
router.delete("/:id", tokenAuth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({
        errors: [{ msg: "No existe el todo 🤷" }],
      });
    }

    if (todo.uid.toString() !== req.uid) {
      return res.status(401).json({
        errors: [{ msg: "Cuidado no es tu todo 🤬" }],
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      errors: false,
      msg: "Todo eliminado!",
    });
  } catch (error) {
    // console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        errors: [{ msg: "No existe el todo 🤷" }],
      });
    }
    return res.status(500).json({
      errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
    });
  }
});
```

## Update Todo
```js
router.put(
  "/:id",
  [
    tokenAuth,
    body("text", "Ingrese un texto").trim().notEmpty(),
    body("done", "Ingrese un done").trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const todo = await Todo.findOne({ _id: req.params.id });
      if (!todo) {
        return res.status(404).json({
          errors: [{ msg: "No existe el todo 🤷" }],
        });
      }

      if (todo.uid.toString() !== req.uid) {
        return res.status(401).json({
          errors: [{ msg: "Cuidado no es tu todo 🤬" }],
        });
      }

      const { done, text } = req.body;

      const todoUpdate = await Todo.findByIdAndUpdate(
        req.params.id,
        { done, text },
        { new: true }
      );

      res.json({
        errors: false,
        todoUpdate,
      });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(400).json({
          errors: [{ msg: "No existe el todo 🤷" }],
        });
      }
      if (error.kind === "Boolean") {
        return res.status(400).json({
          errors: [{ msg: "Formato done incorrecto 🤷" }],
        });
      }
      return res.status(500).json({
        errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
      });
    }
  }
);
```

## Get todo id
```js
router.get("/id/:id", tokenAuth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({
        errors: [{ msg: "No existe el todo 🤷" }],
      });
    }

    if (todo.uid.toString() !== req.uid) {
      return res.status(401).json({
        errors: [{ msg: "Cuidado no es tu todo 🤬" }],
      });
    }

    res.json({
      errors: false,
      todo,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        errors: [{ msg: "No existe el todo 🤷" }],
      });
    }
    return res.status(500).json({
      errors: [{ msg: "Error de Servidor 🤦‍♂️" }],
    });
  }
});
```

## History + SPA
- [npm history](https://www.npmjs.com/package/connect-history-api-fallback)
- [static express](https://expressjs.com/es/starter/static-files.html)

```js{4-5,21-22}
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const path = require("path");
const history = require("connect-history-api-fallback");

const app = express();

// Conectar a DB
conectarDB();

// Middleware (acepta req.body)
app.use(express.json({ extended: false }));
app.use(cors());

// Rutas
app.use("/api/user", require("./routes/auth"));
app.use("/api/todo", require("./routes/todo"));

// app.get("/", (req, res) => res.send("api 🚀"));
app.use(history());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("3 2 1... 🚀");
});
```

## Heroku
- [heroku cli install](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

Despliegue Heroku
- Crear proyecto en heroku
```sh
git init
git add .
git commit -m "su super commit"

heroku login
heroku git:remote -a nombre-app-heroku
git push heroku master
```

Config Vars
```
mongoURI
jwtSecret
```

- Hacer pruebas en Postman

## Frontend (Vue.js)

- Vue 3 (composition API)
- Router
- Vuex
- [npm i jwt-decode](https://www.npmjs.com/package/jwt-decode)

## Theme Bootstrap
- [bootswatch](https://bootswatch.com/)

## main.js
```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/bootstrap.min.css";

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
```

## Router.js
```js
import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
    meta: { requireAuth: true },
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Edit.vue"),
    meta: { requireAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Signup.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const rutaProtegida = to.matched.some((record) => record.meta.requireAuth);

  store.commit("moduleAuth/setErrors", null);

  if (!rutaProtegida) return next();

  if (localStorage.getItem("token")) {
    // console.log(store.state.moduleAuth.token);
    // console.log(await store.dispatch("moduleAuth/verificarToken"));
    if (await store.dispatch("moduleAuth/verificarToken")) {
      next();
    } else {
      next("/login");
    }
  } else {
    next("/login");
  }
});

export default router;

```

## Vuex
```js
import { createStore } from "vuex";
import { moduleAuth } from "./moduleAuth";
import { moduleTodo } from "./moduleTodo";

export default createStore({
  state: {},
  modules: {
    moduleAuth,
    moduleTodo,
  },
});
```

## moduleAuth.js
```js
import router from "../router";
// const BASE_URL = "http://localhost:5000/api/user";
const BASE_URL = "https://api-prueba-200.herokuapp.com/api/user";
import jwt_decode from "jwt-decode";

const moduleAuth = {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
    errors: null,
  }),
  mutations: {
    setToken(state, payload) {
      if (payload) {
        const user = jwt_decode(payload);
        console.log("user", user);
        state.user = user;
        // localStorage.setItem("token", payload);
      } else {
        state.user = null;
      }
      state.token = payload;
    },
    setErrors(state, payload) {
      state.errors = payload;
    },
  },
  actions: {
    async verificarToken({ dispatch, commit }) {
      try {
        const res = await fetch(BASE_URL + "/validar", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        const token = await res.json();
        if (token.errors) {
          console.log(token.errors);
          dispatch("cerrarSesion");
          return false;
        } else {
          // console.log("token válido!");
          commit("setToken", localStorage.getItem("token"));
          return true;
        }
      } catch (error) {
        console.log("error", error);
        return false;
      }
    },
    async acceder({ commit, dispatch }, data) {
      try {
        const res = await fetch(BASE_URL + data.path, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data.form),
        });

        const user = await res.json();

        if (user.errors) {
          return commit("setErrors", user.errors);
        }

        // commit("setToken", user.token);
        // commit("setToken", "fasdfasdf");
        localStorage.setItem("token", user.token);
        commit("setErrors", null);
        router.push("/");
      } catch (error) {
        console.log("error", error);
        dispatch("cerrarSesion");
      }
    },
    cerrarSesion({ commit }) {
      localStorage.removeItem("token");
      commit("setToken", null);
      router.push("/login");
    },
  },
};

export { moduleAuth };
```

## moduleTodo.js
```js
import router from "../router";

// const BASE_URL = "http://localhost:5000/api/todo";
const BASE_URL = "https://api-prueba-200.herokuapp.com/api/todo";
const moduleTodo = {
  namespaced: true,
  state: () => ({
    todos: [],
    errors: [],
  }),
  mutations: {
    setTodos(state, todos) {
      state.todos = todos;
    },
    addTodo(state, todo) {
      state.todos.push(todo);
    },
    removeTodo(state, id) {
      state.todos = state.todos.filter((item) => item._id !== id);
    },
    editTodo(state, todo) {
      state.todos = state.todos.map((item) => {
        if (item._id === todo._id) {
          return todo;
        }
        return item;
      });
    },
    setErrors(state, payload) {
      state.errors = payload;
    },
  },
  actions: {
    async addTodo({ commit }, text) {
      try {
        const res = await fetch(BASE_URL + "/", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ text }),
        });
        const api = await res.json();
        console.log(api);
        if (api.errors) {
          return commit("setErrors", api.errors);
        }
        commit("addTodo", api.todo);
        commit("setErrors", null);
      } catch (error) {
        console.log(error);
      }
    },
    async editTodo({ commit }, todo) {
      try {
        const res = await fetch(BASE_URL + "/" + todo._id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(todo),
        });
        const api = await res.json();
        console.log(api);
        if (api.errors) {
          return commit("setErrors", api.errors);
        }
        commit("editTodo", api.todoUpdate);
        commit("setErrors", null);
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    async getTodos({ commit }) {
      try {
        const res = await fetch(BASE_URL + "/", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        const api = await res.json();
        if (api.errors) {
          return commit("setErrors", api.errors);
        }

        commit("setTodos", api.todos);
        commit("setErrors", null);
      } catch (error) {
        console.log(error);
      }
    },
    async removeTodo({ commit }, id) {
      try {
        const res = await fetch(BASE_URL + "/" + id, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        const api = await res.json();
        if (api.errors) {
          return commit("setErrors", api.errors);
        }
        commit("removeTodo", id);
        commit("setErrors", null);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchTodo({ commit }, id) {
      try {
        const res = await fetch(BASE_URL + "/id/" + id, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        const api = await res.json();
        console.log(api);
        if (api.errors) {
          return commit("setErrors", api.errors);
        }

        commit("setErrors", null);
        return api.todo;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export { moduleTodo };

```

## App.vue
```vue
<template>
	<div class="container">
		<Navbar />
		<div class="mt-3">
			<router-view />
		</div>
	</div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
	components: { Navbar },
	setup() {},
};
</script>
```

## Navbar.vue
```vue
<template>
	<nav class="navbar navbar-dark bg-dark">
		<div class="container">
			<router-link to="/" class="navbar-brand">API</router-link>
			<div>
				<router-link v-if="!user" class="btn btn-info me-2" to="/login">
					Login
				</router-link>
				<router-link v-if="!user" class="btn btn-info" to="/signup">
					Signup
				</router-link>
				<button v-if="user" @click="logout" class="btn btn-danger">
					Logout
				</button>
			</div>
		</div>
	</nav>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
	setup() {
		const store = useStore();
		const user = computed(() => store.state.moduleAuth.user);
		const logout = () => {
			store.dispatch("moduleAuth/cerrarSesion");
			store.commit("moduleTodo/setTodos", null);
		};
		return {
			logout,
			user,
		};
	},
};
</script>
```

## Login.vue (views)
```vue
<template>
	<h1 class="text-center mt-5 text-info">Login</h1>
	<form class="row" @submit.prevent="procesarFormulario">
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Ingrese Email"
				v-model="email"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Ingrese Password"
				v-model="password"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<button
				class="btn btn-info me-2"
				type="submit"
				:disabled="
					!email.trim() || !password.trim() || password.length < 6
				"
			>
				Acceder
			</button>
			<router-link to="/signup" class="btn btn-outline-dark"
				>¿No tienes cuenta?</router-link
			>
		</div>
		<div class="col-md-6 offset-md-3 mt-3" v-if="errors">
			<div
				class="alert alert-danger"
				v-for="(error, index) in errors"
				:key="index"
			>
				{{ error.msg }}
			</div>
		</div>
	</form>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
	setup() {
		const store = useStore();
		const email = ref("bluuweb@prueba.com");
		const password = ref("123123");

		const errors = computed(() => store.state.moduleAuth.errors);

		const procesarFormulario = async () => {
			await store.dispatch("moduleAuth/acceder", {
				path: "/login",
				form: {
					email: email.value,
					password: password.value,
				},
			});
		};

		return {
			procesarFormulario,
			email,
			password,
			errors,
		};
	},
};
</script>
```

## Signup.vue (views)
```vue
<template>
	<h1 class="text-center mt-5 text-info">Signup</h1>
	<form class="row" @submit.prevent="procesarFormulario">
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Ingrese Nombre"
				v-model="name"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Ingrese Email"
				v-model="email"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Ingrese Password"
				v-model="password"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<input
				type="text"
				class="form-control mb-2"
				placeholder="Repita Password"
				v-model="repassword"
			/>
		</div>
		<div class="col-md-6 offset-md-3">
			<button
				class="btn btn-info me-2"
				type="submit"
				:disabled="
					repassword !== password ||
					!password.trim() ||
					password.length < 6
				"
			>
				Crear cuenta
			</button>
			<router-link to="/login" class="btn btn-outline-dark"
				>¿Ya tienes cuenta?</router-link
			>
		</div>
		<div class="col-md-6 offset-md-3 mt-3" v-if="errors">
			<div
				class="alert alert-danger"
				v-for="(error, index) in errors"
				:key="index"
			>
				{{ error.msg }}
			</div>
		</div>
	</form>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
	setup() {
		const email = ref("");
		const name = ref("");
		const password = ref("");
		const repassword = ref("");

		const store = useStore();

		const errors = computed(() => store.state.moduleAuth.errors);

		const procesarFormulario = async () => {
			await store.dispatch("moduleAuth/acceder", {
				path: "/signup",
				form: {
					email: email.value,
					password: password.value,
					name: name.value,
				},
			});
		};

		return {
			name,
			email,
			password,
			repassword,
			procesarFormulario,
			errors,
		};
	},
};
</script>
```

## Home.vue (views)
```vue
<template>
	<div class="my-3" v-if="errors">
		<div
			class="alert alert-danger"
			v-for="(error, index) in errors"
			:key="index"
		>
			{{ error.msg }} 🤦‍♂️
		</div>
	</div>
	<AddTodo />
	<div class="my-2" v-if="user">
		<h4>TODOS: {{ user.name }}</h4>
		<Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
	</div>
	<pre>
        user: {{ user }}
    </pre>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import AddTodo from "../components/AddTodo.vue";
import Todo from "../components/Todo.vue";

export default {
	components: { AddTodo, Todo },
	setup() {
		const store = useStore();

		const user = computed(() => store.state.moduleAuth.user);
		const todos = computed(() => store.state.moduleTodo.todos);
		const errors = computed(() => store.state.moduleTodo.errors);

		onMounted(() => store.dispatch("moduleTodo/getTodos"));

		return {
			user,
			todos,
			errors,
		};
	},
};
</script>
```

## AddTodo.vue
```vue
<template>
	<form @submit.prevent="procesarFormulario" class="input-group my-2">
		<input
			type="text"
			class="form-control"
			v-model="text"
			placeholder="Ingrese Todo"
		/>
		<button
			class="btn btn-outline-dark"
			type="sumbit"
			:disabled="!text.trim()"
		>
			Agregar
		</button>
	</form>
</template>
<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
	setup() {
		const text = ref("");
		const store = useStore();

		const procesarFormulario = () => {
			store.dispatch("moduleTodo/addTodo", text.value);
			text.value = "";
		};

		return {
			text,
			procesarFormulario,
		};
	},
};
</script>
```

## Todo.vue
```vue
<template>
	<div class="my-2 alert alert-dark">
		<p>{{ todo }}</p>
		<router-link class="btn btn-warning me-2" :to="`/edit/${todo._id}`"
			>Editar</router-link
		>
		<button class="btn btn-danger" @click="eliminar(todo._id)">
			Eliminar
		</button>
	</div>
</template>

<script>
import { useStore } from "vuex";
export default {
	props: ["todo"],
	setup() {
		const store = useStore();

		const eliminar = (id) => {
			store.dispatch("moduleTodo/removeTodo", id);
		};

		return {
			eliminar,
		};
	},
};
</script>
```

## Edit.vue (views)
```vue
<template>
	<div class="my-3" v-if="errors">
		<div
			class="alert alert-danger"
			v-for="(error, index) in errors"
			:key="index"
		>
			{{ error.msg }} 🤦‍♂️
		</div>
	</div>
	<form @submit.prevent="procesarFormulario" v-if="todo">
		<pre>todo: {{ todo }}</pre>
		<input type="text" class="form-control my-2" v-model="todo.text" />
		<div class="form-check form-switch">
			<input
				class="form-check-input"
				type="checkbox"
				id="flexSwitchCheckDefault"
				v-model="todo.done"
			/>
			<label class="form-check-label" for="flexSwitchCheckDefault">{{
				todo.done
			}}</label>
		</div>
		<button class="btn btn-warning me-2" type="submit">
			Guardar cambios
		</button>
		<router-link class="btn btn-info" to="/">Volver</router-link>
	</form>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
export default {
	setup() {
		const route = useRoute();
		const store = useStore();
		const todo = ref({});

		const errors = computed(() => store.state.moduleTodo.errors);

		onMounted(async () => {
			todo.value = await store.dispatch(
				"moduleTodo/fetchTodo",
				route.params.id
			);
			console.log("todo.value", todo.value);
		});

		const procesarFormulario = () => {
			store.dispatch("moduleTodo/editTodo", todo.value);
		};

		return {
			todo,
			errors,
			procesarFormulario,
		};
	},
};
</script>
```

## 404.vue (views)
```vue
<template>
	<h1 class="mt-5 text-center">Página no encontrada 🤷‍♂️</h1>
</template>
```






