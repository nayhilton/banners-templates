var metalsmith	= require('metalsmith');
var inplace 	= require('metalsmith-in-place');
var stylus		= require('metalsmith-stylus');
var ignore		= require('metalsmith-ignore');
var watch		= require('metalsmith-watch');
var concat		= require('metalsmith-concat');
var uglify		= require('metalsmith-uglifyjs');
var rename		= require('metalsmith-rename');
var path 		= require('path');

var dev = !!process.argv.filter(function(item){
        return item == '--dev';
}).length;



var program = metalsmith(__dirname)
	.use(ignore(['masterpage/**', 'data/**', '*.hbs']))
	.source('./src')
  	.destination('./output') 
  	.clean(true) 
	.use(stylus({
    	compress: true,
		paths:[ 'src' ]
	}))
	.use(uglify({
		src:['templates/**/*.js']
	}))
	.use(inplace({
		engine: 'handlebars',
		pattern: '**/*.hbs'
	}))
	.use(rename([
		[/\.hbs$/, ".html"]
	]));
	

if( dev ){
	program.use(
		watch({
			paths: { '${source}/**': '**/*' },
			livereload: true
		})
	)
}

program.build(function(err){
	if (err) throw err;
});
