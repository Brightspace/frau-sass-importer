/* global describe, it, beforeEach, afterEach */

var chai = require('chai'),
	expect = chai.expect,
	sass = require('node-sass')
	fs = require('fs'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai');

var importer = require('../');

chai.use(sinonChai);

describe('Custom importer', function () {
	it('should ignore relative paths starting with \'..\'', function () {
		var url = '../node_modules/module-name/some-sass.scss',
			prev = '/parent/file/parent.scss';

		var result = importer(url, prev, function (done) {
			expect.fail();
		});

		expect(result).to.equal(sass.NULL);
	});

	it('should ignore relative paths starting with \'.\'', function () {
		var url = './node_modules/module-name/some-sass.scss',
			prev = '/parent/file/parent.scss';

		var result = importer(url, prev, function (done) {
			expect.fail();
		});

		expect(result).to.equal(sass.NULL);
	});

	it('should ignore relative paths starting with an unhandled base folder name', function () {
		var url = 'foo_modules/module-name/some-sass.scss',
			prev = '/parent/file/parent.scss';

		var result = importer(url, prev, function (done) {
			expect.fail();
		});

		expect(result).to.equal(sass.NULL);
	});

	it('should ignore absolute paths', function () {
		var url = '/node_modules/module-name/some-sass.scss',
			prev = '/parent/file/parent.scss';

		var result = importer(url, prev, function (done) {
			expect.fail();
		});

		expect(result).to.equal(sass.NULL);
	});

	it('should return an error when the file cannot be found', function (done) {
		var url = 'node_modules/module-name/some-sass.scss',
			prev = '/parent/file/parent.scss';

		importer(url, prev, function (result) {
			expect(result).to.be.an('Error');
			done();
		});
	});

	describe('Path resolution', function () {
		var sandbox,
			resolvedPath;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			sandbox.stub(fs, 'access', accessCheckHandler);
			resolvedPath = null;
		});

		afterEach(function () {
			sandbox.restore();
		});

		function accessCheckHandler (path, mode, callback) {
			if (path === resolvedPath) {
				callback();
			} else {
				callback(new Error('File not found'));
			}
		}

		it('should find the file at the same level as the referencing file', function (done) {
			var url = 'node_modules/module/module.scss',
				prev = '/project-root/main.scss';

			resolvedPath = '/project-root/node_modules/module/module.scss';

			importer(url, prev, function (result) {
				expect(result).to.have.property('file', resolvedPath);
				done();
			});
		});

		it('should find the file one level up from referencing file', function (done) {
			var url = 'node_modules/module/module.scss',
				prev = '/project-root/styles/main.scss';

			resolvedPath = '/project-root/node_modules/module/module.scss';

			importer(url, prev, function (result) {
				expect(result).to.have.property('file', resolvedPath);
				done();
			});
		});

		it('should find the file two levels up from referencing file', function (done) {
			var url = 'node_modules/module/module.scss',
				prev = '/project-root/src/styles/main.scss';

			resolvedPath = '/project-root/node_modules/module/module.scss';

			importer(url, prev, function (result) {
				expect(result).to.have.property('file', resolvedPath);
				done();
			});
		});

		it('should find the file when referenced without an extension', function (done) {
			var url = 'node_modules/module/module',
				prev = '/project-root/main.scss';

			resolvedPath = '/project-root/node_modules/module/module.scss';

			importer(url, prev, function (result) {
				expect(result).to.have.property('file', resolvedPath);
				done();
			});
		});

		it('should find the file when referenced from a bower component', function (done) {
			var url = 'bower_components/component/component.scss',
				prev = '/project-root/main.scss';

			resolvedPath = '/project-root/bower_components/component/component.scss';

			importer(url, prev, function (result) {
				expect(result).to.have.property('file', resolvedPath);
				done();
			});
		});
	});
});
