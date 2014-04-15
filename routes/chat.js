/* GET chat page. */
exports.chat = function(req, res){
  res.render('chat', { title: 'Chatterbox', username: req.query.username});
};