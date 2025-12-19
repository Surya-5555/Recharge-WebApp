const app = require('./src/app');
const config = require('./src/config/env');
const connectDB = require('./src/config/database');

const PORT = config.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});