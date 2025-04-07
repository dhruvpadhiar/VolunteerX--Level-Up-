import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
});
export const Comment = mongoose.model('Comment', commentSchema);
//below controller works for new users i.e ngo and volunteer

// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   text: { type: String, required: true },

//   // Author can be a Volunteer or NGO
//   author: { type: mongoose.Schema.Types.ObjectId, required: true },
//   authorModel: { type: String, enum: ['Volunteer', 'NGO'], required: true }, // 👈 KEY FIELD

//   post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
// }, { timestamps: true });

// export const Comment = mongoose.model('Comment', commentSchema);
