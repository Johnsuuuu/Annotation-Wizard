const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    instruction: String,
    author_id: String,
    author_name: String,
    annotator_id: String,
    annotator_name: String,
    labels: [String],
    images: [
        {
            url: String,
            status: String,
            annotation: [{ label: String, left: Number, top: Number, width: Number, height: Number }]
        }
    ],
    status: String

});

module.exports = User = mongoose.model("tasks", TaskSchema);
