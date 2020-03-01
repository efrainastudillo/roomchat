const debug = require('debug');
const LOG = debug('chat:');

module.exports = {
    index: (req, res) => {
        LOG(`${req.method} ${req.url}`)
        res.render('chat');
    }
}