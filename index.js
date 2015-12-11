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
            return complete({ file: resolvedNpmPath }, done);
        }
    } catch (e) {}

    var baseFolderName = url.split('/')[0];

    if (handledBaseFolderNames[baseFolderName]) {
        var result = findInParentDirSync(url, prev);
        return complete(result, done);
    } else {
        return sass.NULL;
    }
}

function complete(result, done) {
    if (isAsync(done)) {
        done(result);
        return;
    }
    return result;
}

function isAsync(doneCallback) {
    return typeof doneCallback === 'function';
}

function endsWith(str, suffix) {
    return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function resolveNpm (id, referencingFile) {
    return resolve.sync(id, {
        basedir: path.dirname(referencingFile)
    });
}

function findInParentDirSync(relativePath, startingDirPath) {
    var dirToTry = path.join(startingDirPath, '..');
    var pathToTry = path.join(dirToTry, relativePath);

    try {
        fs.accessSync(pathToTry, fs.R_OK);
        return {
            file: pathToTry
        };
    } catch (err) {
        if (pathToTry === ('/' + relativePath)) {
            return new Error('File not found: ' + relativePath);
        } else {
            return findInParentDirSync(relativePath, dirToTry);
        }
    }
}

module.exports = customImporter;
