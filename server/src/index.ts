import express from 'express';
// import http from 'http';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import cors from 'cors';
import CryptoCurrency from '../routes/CryptoCurrency';

const app = express();

// app.use(cors({
//     credentials: true,
// }))

// app.use(compression());
// app.use(cookieParser());
// app.use(bodyParser.json());

// app.use("/crypto", CryptoCurrency);


const PORT = 3000;

app.use("/crypto", CryptoCurrency);

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
