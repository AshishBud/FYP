import mongoose from 'mongoose';

const faceSchema = mongoose.Schema({
    label : {
        type : String,
        required : [true, 'Label is required'],
        trim : true,
        minLength : 2,
        maxLength : 25
    },
    embedding : {
        type : Array,
        required : [true, 'Embedding is required']
    }
})

const Face = mongoose.model('Face',faceSchema)

export default Face;
