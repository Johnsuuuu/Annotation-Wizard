const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Task = require("../../models/Task");

router.post("/create", (req, res) => {
    const newTask = new Task({
        instruction: req.body.instruction,
        author_id: req.body.author_id,
        author_name: req.body.author_name,
        annotator_id: req.body.annotator_id,
        annotator_name: req.body.annotator_name,
        labels: req.body.labels,
        images: req.body.images,
        status: req.body.status
    });

    newTask.save()
        .then(task => res.json(task))
        .catch(err => console.log(err));
});

router.get("/unassigned-tasks", (req, res) => {
    Task.find({ status: "pending", annotator_id: "" }, function (err, foundTasks) {
        if (foundTasks.length === 0) {
            res.send([]);
        }
        else {
            res.send(foundTasks);
        }
    });

})

router.get("/published-tasks/:authorId", (req, res) => {
    Task.find({ author_id: req.params.authorId }, function (err, foundTasks) {
        if (foundTasks.length === 0) {
            res.send([]);
        }
        else {
            res.send(foundTasks);
        }
    });
})


router.get("/taken-tasks/:annotatorId", (req, res) => {
    Task.find({ annotator_id: req.params.annotatorId }, function (err, foundTasks) {
        if (foundTasks.length === 0) {
            res.send([]);
        }
        else {
            res.send(foundTasks);
        }
    });
})


router.patch("/taken-tasks/:taskId", (req, res) => {
    Task.updateOne(
        { _id: req.params.taskId },
        { $set: req.body },
        function (err) {
            if (!err) {
                res.send('successfully taken the task');
            } else {
                res.send(err);
            }
        }
    )
})


router.get("/annotate/:taskId", (req, res) => {
    Task.find({ _id: req.params.taskId }, function (err, foundTask) {
        if (foundTask.length === 0) {
            res.send([]);
        }
        else {
            res.send(foundTask);
        }
    });
})


router.post("/annotate/submit-annotation", (req, res) => {
    Task.findOneAndUpdate({ "_id": req.body.task_id, "images._id": req.body.image_id },
        { $set: { "images.$.annotation": req.body.entries, "images.$.status": "completed" } }, function (err, docs) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Successfully updated.");
            }
        });

});


router.post("/annotate/finish-annotation", (req, res) => {
    Task.findByIdAndUpdate(req.body.task_id, { status: "finished" }, function (err, docs) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Successfully updated.");
        }
    });

});


module.exports = router;

