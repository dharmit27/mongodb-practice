import postsModel from "../../models/posts.js"

export default async (req, res, next) => {
    if (!req.params.postId) {
        return res.status(400).send({
            responseCode: 0,
            responseMessage: 'Provide Post Id',
            responseObject: []
        })
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'body'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            responseCode: 0,
            responseMessage: 'Invalid Updates',
            responseObject: []
        });
    }

    try {
        const post = await postsModel.findOne({ _id: req.params.postId, userId: req.user._id });
        updates.forEach(update => post[update] = req.body[update]);

        await post.save();

        return res.status(200).send({
            responseCode: 1,
            responseMessage: 'Updated successfully',
            responseObject: post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            responseCode: 0,
            responseMessage: 'Internal Server Error',
            responseObject: []
        })
    }
}