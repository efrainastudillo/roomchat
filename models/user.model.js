const m = require('mongoose');

const UserSchema = new m.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstname: { type: String, required: false },
    password: { type: String, required: true },
    messages: [ { msg: String, timestamp: Date } ],
    created_at: {type: Date, required: true, default: Date.now },
    updated_at: {type: Date, required: true, default: Date.now }
});
// UserSchema.plugin(uniqueValidator);
const User = m.model('User', UserSchema);
module.exports =  User;
