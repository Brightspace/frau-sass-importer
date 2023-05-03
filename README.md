# frau-sass-importer

Custom importer for node-sass to help resolve relative paths to node modules and bower components.

This importer will attempt to resolve sass references using an npm module style algorithm. If the path can't be resolved and the reference starts with **node_modules** or **bower_components**, it will walk up the ancestor tree looking for the file. All other references will be ignored and left to be handled by some other custom importer or the regular sass path resolution process.

## Installation

## Node Version Requirement

Note: Node v18 required, i.e. this will not work with earlier versions of Node (and might not work with later versions also). Using Node Version Manager (NVM) recommended.

Install via NPM:

```shell
npm install frau-sass-importer
```

## Usage

1) In your .scss file @import statements, reference another .scss file from a dependent node module or bower component. Examples:

```scss
@import 'my-module/src/main.scss';
@import 'my-module/src/main';
@import 'node_modules/my-module/src/widget/widget.scss';
@import 'bower_components/my-component/main.scss';
```

2) Add the custom importer to your node-sass build step.

```json
package.json

{
	"scripts": {
		"build:css": "node-sass --importer ./node_modules/frau-sass-importer/ ./src/app.scss > ./dist/app.css"
	}
}
```

## Tests
This project uses [mocha](https://mochajs.org/), [chai](http://chaijs.com/), and [sinon](http://sinonjs.org/) for unit testing. To run the tests:

```shell
npm test
```

## Contributing
Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them.

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...
The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)

[npm-url]: https://www.npmjs.org/package/frau-appconfig-builder
[npm-image]: https://img.shields.io/npm/v/frau-appconfig-builder.svg
