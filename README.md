# frau-sass-importer

Custom importer for node-sass to help resolve relative paths to node modules and bower components.

This importer will attempt to resolve sass references using an npm module style algorithm. If the path can't be resolved and the reference starts with **node_modules** or **bower_components**, it will walk up the ancestor tree looking for the file. All other references will be ignored and left to be handled by some other custom importer or the regular sass path resolution process.

## Installation

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
