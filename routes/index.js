/* GET login page. */
exports.index = function(req, res){
        res.render('index', { title: 'Chatterbox', chat_id: req.query.chat_id});
};