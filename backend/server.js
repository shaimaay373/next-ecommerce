import 'dotenv/config';
import app from './src/app.js'
import connectDB from './src/config/db.js';

//connect to database
const port = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is Running at http://localhost:${port}`);
    });
});