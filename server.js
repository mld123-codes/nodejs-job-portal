const express = require('express');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('swagger-jsdoc');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const testRoutes = require('./routes/testRoutes');
const colors = require('colors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoute');
const jobRoute = require('./routes/jobRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
connectDB();

const options = {
  definition: {
    openai: '3.0.0',
    info: {
      title: 'Job Portal Application',
      description: 'Node expressjs Job Portal Application',
    },
    servers: {
      url: 'http://localhost:8080',
    },
  },
  apis: ['./routes/*'],
};
const spec = swaggerDoc(options);
const app = express();
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/job', jobRoute);

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(spec));
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on port ${PORT}`.bgCyan.white));
