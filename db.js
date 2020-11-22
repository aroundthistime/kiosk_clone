import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/kiosk',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

const db = mongoose.connection;

const handleDBOpen = () => console.log('✅ Connected to DB');
const handleDBError = (error) => console.log(`❗ Error with DB connection : ${error}`);

db.once('open', handleDBOpen);
db.on('error', handleDBError);