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
    } else {
        return sass.NULL;
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function findInParentDir(relativePath, startingDirPath, done) {
    var dirToTry = path.join(startingDirPath, '..');
    var pathToTry = path.join(dirToTry, relativePath);

    try {
        fs.access(pathToTry, fs.R_OK, function(err) {
            if (err) {
                return findInParentDir(relativePath, dirToTry, done);
            } else {
                done({ file: pathToTry });
            }
        });
    } catch (e) {
        return sass.NULL;
    }
}

module.exports = customImporter;
