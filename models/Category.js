import mongoose, { model, models } from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema ({
    name: {type: String, required: true},
    parent: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type:Object}]
});

export const Category = models.Category || model('Category', CategorySchema);
