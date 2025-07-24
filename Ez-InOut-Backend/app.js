import express from 'express';
import urlencoded from 'express';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import fileUpload from 'express-fileupload';
import {loadModels} from './utils/faceUtils.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';


const app = express()

app.use(express.json())
app.use(urlencoded({extended : true}))
app.use(fileUpload({useTempFiles : true}))
app.use(cors())


//app.use('/api/v1/auth', authRoute)
//app.use('/api/v1/users' userRoute)


//This function will start the face recognition model
await loadModels()

//app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/auth', authRouter)


app.listen(PORT, async ()=>{
    console.log(`Server is listening on server ${PORT}`);
    await connectToDatabase();
})  


export default app;