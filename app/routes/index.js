'use strict';
var path = process.cwd();

module.exports = {init};
function init(app,passport){

	app.route('/').get(function(req,res){
		res.render('layout.pug');
	})

}
