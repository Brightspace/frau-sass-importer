'use strict';

var chai = require('chai'),
	expect = chai.expect,
	sass = require('node-sass'),
	path = require('path'),
	mockFs = require('mock-fs'),
	fs = require('fs'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai');

var importer = require('../');

chai.use(sinonChai);

describe('Custom importer', function() {
	describe('async', function() {
		describe('Unresolved path handling', function() {
			it('should ignore relative path that cannot be resolved', function() {
				var url = '../node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev, function() {
					expect.fail();
				});

				expect(result).to.equal(sass.NULL);
			});

			it('should ignore relative path starting with an unhandled base folder name that cannot be resolved', function() {
				var url = 'foo_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev, function() {
					expect.fail();
				});

				expect(result).to.equal(sass.NULL);
			});

			it('should ignore absolute path that canont be resolved', function() {
				var url = '/node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev, function() {
					expect.fail();
				});

				expect(result).to.equal(sass.NULL);
			});

			it('should return an error when a node_modules path cannot be found', function(done) {
				var url = 'node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				importer(url, prev, function(result) {
					expect(result).to.be.an('Error');
					done();
				});
			});

			it('should return an error when a bower_components path cannot be found', function(done) {
				var url = 'bower_components/component/component.scss',
					prev = '/parent/file/parent.scss';

				importer(url, prev, function(result) {
					expect(result).to.be.an('Error');
					done();
				});
			});
		});

		describe('npm path resolution', function() {
			afterEach(function() {
				mockFs.restore();
			});

			it('should resolve scss reference using module name and file name in module root', function(done) {
				var url = 'some-module/module.scss',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/module.scss': ''
				});

				var returnValue = importer(url, prev, function(result) {
					expect(result).to.have.property('file', path.resolve('node_modules/some-module/module.scss'));
					done();
				});

				expect(returnValue).to.be.undefined;
			});

			it('should resolve scss reference using module name and file name in module sub folder', function(done) {
				var url = 'some-module/src/component/module.scss',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/src/component/module.scss': ''
				});

				var returnValue = importer(url, prev, function(result) {
					expect(result).to.have.property('file', path.resolve('node_modules/some-module/src/component/module.scss'));
					done();
				});

				expect(returnValue).to.be.undefined;
			});

			it('should resolve scss reference using module name and file name without .scss extension', function(done) {
				var url = 'some-module/module',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/module.scss': ''
				});

				var returnValue = importer(url, prev, function(result) {
					expect(result).to.have.property('file', path.resolve('node_modules/some-module/module.scss'));
					done();
				});

				expect(returnValue).to.be.undefined;
			});
		});

		describe('node_modules and bower_components path resolution', function() {
			var sandbox,
				resolvedPath;

			beforeEach(function() {
				sandbox = sinon.sandbox.create();
				sandbox.stub(fs, 'accessSync', accessCheckHandler);
				resolvedPath = null;
			});

			afterEach(function() {
				sandbox.restore();
			});

			function accessCheckHandler(path) {
				if (path === resolvedPath) {
					return path;
				}
				throw new Error('File not found');
			}

			it('should find the file at the same level as the referencing file', function(done) {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				importer(url, prev, function(result) {
					expect(result).to.have.property('file', resolvedPath);
					done();
				});
			});

			it('should find the file one level up from referencing file', function(done) {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/styles/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				importer(url, prev, function(result) {
					expect(result).to.have.property('file', resolvedPath);
					done();
				});
			});

			it('should find the file two levels up from referencing file', function(done) {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/src/styles/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				importer(url, prev, function(result) {
					expect(result).to.have.property('file', resolvedPath);
					done();
				});
			});

			it('should find the file when referenced without an extension', function(done) {
				var url = 'node_modules/module/module',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				importer(url, prev, function(result) {
					expect(result).to.have.property('file', resolvedPath);
					done();
				});
			});

			it('should find the file when referenced from a bower component', function(done) {
				var url = 'bower_components/component/component.scss',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/bower_components/component/component.scss';

				importer(url, prev, function(result) {
					expect(result).to.have.property('file', resolvedPath);
					done();
				});
			});
		});
	});

	describe('sync', function() {
		describe('Unresolved path handling', function() {
			it('should ignore relative path that cannot be resolved', function() {
				var url = '../node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev);
				expect(result).to.equal(sass.NULL);
			});

			it('should ignore relative path starting with an unhandled base folder name that cannot be resolved', function() {
				var url = 'foo_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev);
				expect(result).to.equal(sass.NULL);
			});

			it('should ignore absolute path that canont be resolved', function() {
				var url = '/node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev);
				expect(result).to.equal(sass.NULL);
			});

			it('should return an error when a node_modules path cannot be found', function() {
				var url = 'node_modules/module-name/some-sass.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev);
				expect(result).to.be.an('Error');
			});

			it('should return an error when a bower_components path cannot be found', function() {
				var url = 'bower_components/component/component.scss',
					prev = '/parent/file/parent.scss';

				var result = importer(url, prev);
				expect(result).to.be.an('Error');
			});
		});

		describe('npm path resolution', function() {
			afterEach(function() {
				mockFs.restore();
			});

			it('should resolve scss reference using module name and file name in module root', function() {
				var url = 'some-module/module.scss',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/module.scss': ''
				});

				var result = importer(url, prev);
				expect(result).to.have.property('file', path.resolve('node_modules/some-module/module.scss'));
			});

			it('should resolve scss reference using module name and file name in module sub folder', function() {
				var url = 'some-module/src/component/module.scss',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/src/component/module.scss': ''
				});

				var result = importer(url, prev);
				expect(result).to.have.property('file', path.resolve('node_modules/some-module/src/component/module.scss'));
			});

			it('should resolve scss reference using module name and file name without .scss extension', function() {
				var url = 'some-module/module',
					prev = 'app.scss';

				mockFs({
					'node_modules/some-module/module.scss': ''
				});

				var result = importer(url, prev);
				expect(result).to.have.property('file', path.resolve('node_modules/some-module/module.scss'));
			});
		});

		describe('node_modules and bower_components path resolution', function() {
			var sandbox,
				resolvedPath;

			beforeEach(function() {
				sandbox = sinon.sandbox.create();
				sandbox.stub(fs, 'accessSync', accessCheckHandler);
				resolvedPath = null;
			});

			afterEach(function() {
				sandbox.restore();
			});

			function accessCheckHandler(path) {
				if (path === resolvedPath) {
					return path;
				}
				throw new Error('File not found');
			}

			it('should find the file at the same level as the referencing file', function() {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				var result = importer(url, prev);
				expect(result).to.have.property('file', resolvedPath);
			});

			it('should find the file one level up from referencing file', function() {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/styles/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				var result = importer(url, prev);
				expect(result).to.have.property('file', resolvedPath);
			});

			it('should find the file two levels up from referencing file', function() {
				var url = 'node_modules/module/module.scss',
					prev = '/project-root/src/styles/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				var result = importer(url, prev);
				expect(result).to.have.property('file', resolvedPath);
			});

			it('should find the file when referenced without an extension', function() {
				var url = 'node_modules/module/module',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/node_modules/module/module.scss';

				var result = importer(url, prev);
				expect(result).to.have.property('file', resolvedPath);
			});

			it('should find the file when referenced from a bower component', function() {
				var url = 'bower_components/component/component.scss',
					prev = '/project-root/main.scss';

				resolvedPath = '/project-root/bower_components/component/component.scss';

				var result = importer(url, prev);
				expect(result).to.have.property('file', resolvedPath);
			});
		});
	});
});
