'use strict';

const
	expect = require('chai').expect,
	path = require('path'),
	sass = require('node-sass');

const frauImporter = require('../');

describe('node-resolve-flattened', () => {
	let cwd;
	before(() => {
		cwd = process.cwd();

		process.chdir(path.join(__dirname, 'node-resolve-flattened'));
	});
	after(() => {
		process.chdir(cwd);
	});

	it('should work', (done) => {
		sass.render({
			file: 'src/style.scss',
			importer: frauImporter
		}, (err, res) => {
			expect(err).to.not.be.defined;

			expect(res.css.toString('utf8').replace(/\s/g, '')).to.equal('h1{color:#00eeee;}');

			done();
		});
	});
});
