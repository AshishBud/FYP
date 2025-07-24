import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'Name is required'],
        trim : true,
        maxLength : 25,
        minLength : 2,

    },
    email : {
        type : String,
        unique : true,
        required : [true, 'Email is required'],
        lowercase : true,
        match : [/\S+@\S+\.+\S/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : [true, 'User password is required'],
    }
})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin;