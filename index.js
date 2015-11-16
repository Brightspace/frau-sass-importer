var sass = require('node-sass'),
    path = require('path'),
    fs = require('fs');

var handledBaseFolderNames = {
    'bower_components': 'bower_components',
    'node_modules': 'node_modules'
};

function customImporter (url, prev, done) {
    var baseFolderName = url.split(path.sep)[0];

    if (handledBaseFolderNames[baseFolderName]) {
        if (!endsWith(url, '.scss')) {
            url += '.scss';
        }
        findInParentDir(url, prev, done);
    }

    return sass.NULL;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function findInParentDir(relativePath, startingDirPath, done) {
    // For node modules we may want to try using require.resolve() here instead.
    var dirToTry = path.join(startingDirPath, '..');
    var pathToTry = path.join(dirToTry, relativePath);

    fs.access(pathToTry, fs.R_OK, function(err) {
        if (err) {
            if (pathToTry === ('/' + relativePath)) {
                done(new Error('File not found: ' + relativePath));
            } else {
                return findInParentDir(relativePath, dirToTry, done);
            }
        } else {
            done({ file: pathToTry });
        }
    });
}

module.exports = customImporter;
