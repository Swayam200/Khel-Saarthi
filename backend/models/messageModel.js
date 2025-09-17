const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        text: { type: String, required: true },
        user: {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            name: { type: String, required: true },
        },
        event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;