import express, { json, urlencoded } from "express";
import { Server as IOServer } from "socket.io";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import routes from "./routes/index.js";
import Contenedor from "./api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: join(__dirname, "/views/layouts/main.hbs"),
    layoutsDir: join(__dirname, "/views/layouts"),
    partialsDir: join(__dirname, "/views/partials"),
  })
);

app.set("view engine", "hbs");
app.set("views", join(__dirname, "/views"));

app.use("/", routes);

const expressServer = app.listen(8080, () => {
  console.log("Server listening port 8080");
});
const io = new IOServer(expressServer);

const productApi = new Contenedor(
  {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "mibase",
    },
    pool: { min: 0, max: 7 },
  },
  "product"
);

const messageApi = new Contenedor(
  {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "./database/ecommerce.sqlite"),
    },
    useNullAsDefault: true,
  },
  "message"
);

app.use(express.static(__dirname + "/public"));

io.on("connection", async (socket) => {
  console.log(`New connection, socket ID: ${socket.id}`);

  // Mensajes
  socket.emit("server:message", await messageApi.getAll());
  socket.on("client:message", async (messageInfo) => {
    await messageApi.save({
      ...messageInfo,
    });
    io.emit("server:message", await messageApi.getAll());
  });

  // Productos
  socket.emit("server:product", await productApi.getAll());
  socket.on("client:product", async (product) => {
    await productApi.save({
      title: product.title,
      price: Number(product.price),
      thumbnail: product.thumbnail,
    });
    io.emit("server:product", await productApi.getAll());
  });
});
