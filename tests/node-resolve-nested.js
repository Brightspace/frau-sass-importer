'use strict';

const
	expect = require('chai').expect,
	path = require('path'),
	sass = require('node-sass');

const frauImporter = require('../');

describe('node-resolve-nested', () => {
	let cwd;
	before(() => {
		cwd = process.cwd();

		process.chdir(path.join(__dirname, 'node-resolve-nested'));
	});
	after(() => {
		process.chdir(cwd);
	});

	it('should work asynchronously', (done) => {
		sass.render({
			file: 'src/style.scss',
			importer: frauImporter
		}, (err, res) => {
			expect(err).to.be.null;

			expect(res.css.toString('utf8').replace(/\s/g, '')).to.equal('h1{color:#00eeee;}');

			done();
		});
	});

	it('should work synchronously', () => {
		var res = sass.renderSync({
			file: 'src/style.scss',
			importer: frauImporter
		});

		expect(res.css.toString('utf8').replace(/\s/g, '')).to.equal('h1{color:#00eeee;}');
	});
});
