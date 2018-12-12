var fs = require('fs');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'staging';
var config = require('../config/config.' + env + '.js');
var file = fs.readFileSync('./config/config.base.xml', "utf8");
var template = _.template(file);
var output = template(config);

fs.writeFileSync('./config.xml', output, 'utf8');
console.log("[ config.xml generated from config/config.base.xml ]")

if (fs.existsSync('./platforms/android')) {
    fs.createReadStream('./build-extras.gradle').pipe(
        fs.createWriteStream('./platforms/android/build-extras.gradle')
    );
}
