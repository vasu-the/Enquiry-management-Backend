require("./mongoose/db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();



const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.use(morgan('dev'));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTION'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use((err, req, res, next) => {
  console.error("🔥 Global error handler caught:", err.message);
  console.dir(err, { depth: null });
  res.status(500).json({ error: 'Unhandled server error', message: err.message });
});
//Routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api', require('./routes/enquiryRoute'));
app.use('/api/admin', require('./routes/adminRoute'));


app.get('/', (req, res) => {
  res.json({ msg: "Welcome to the app" });
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
});
