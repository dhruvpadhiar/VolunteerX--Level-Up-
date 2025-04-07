import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
});
export const Post = mongoose.model('Post', postSchema);
//below controller works for new users i.e ngo and volunteer

// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema({
//   caption: { type: String, default: '' },
//   image: { type: String, required: true },
  
//   // Author can be a Volunteer or NGO
//   author: { type: mongoose.Schema.Types.ObjectId, required: true },
//   authorModel: { type: String, enum: ['Volunteer', 'NGO'], required: true }, // 👈 KEY FIELD

//   // You can decide whether to support likes from both, or just Volunteers
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],

//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
// }, { timestamps: true });

// export const Post = mongoose.model('Post', postSchema);
