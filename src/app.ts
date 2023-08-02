import express from 'express';
import router from './routes/Routes';
import cors, {CorsOptions} from 'cors';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const corsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  maxAge: 43200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
