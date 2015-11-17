var sass = require('node-sass'),
    path = require('path'),
    fs = require('fs'),
    resolve = require('resolve');

var handledBaseFolderNames = {
    'bower_components': 'bower_components',
    'node_modules': 'node_modules'
};

function customImporter (url, prev, done) {
    if (!endsWith(url, '.scss')) {
        url += '.scss';
    }

    try {
        var resolvedNpmPath = resolveNpm(url, prev);
        if (resolvedNpmPath) {
            done({
                file: resolvedNpmPath
            });
            return;
        }
    } catch (e) {}

    var baseFolderName = url.split(path.sep)[0];

    if (handledBaseFolderNames[baseFolderName]) {
        findInParentDir(url, prev, done);
    } else {
        return sass.NULL;
    }
}

function endsWith(str, suffix) {
    return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function resolveNpm (id, referencingFile) {
    return resolve.sync(id, {
        basedir: path.dirname(referencingFile)
    });
}

function findInParentDir(relativePath, startingDirPath, done) {
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
