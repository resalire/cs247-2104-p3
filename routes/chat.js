/* GET chat page. */
exports.chat = function(req, res){
  res.render('chat', { username: req.query.username, chat_id: req.query.chat_id });
};