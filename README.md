# sass-import-path-resolver

Custom importer for node-sass to help resolve relative paths to node_modules and bower_components.

This importer will only operate on .scss file @import references that start with **node_modules** or **bower_components**. All other references will be ignored and left to be handled by some other custom importer or the regular sass path resolution process.

## Installation

Install NPM dependencies:

```shell
npm install
```

## Usage

1) In your .scss file @import statements, reference another .scss file from a dependent node module or bower component, but don't specify any relative path.

```scss
@import 'bower_components/my_component/main.scss';
@import 'node_modules/my_module/src/sub-module/some-widget.scss';
```

2) Add the custom importer to your node-sass build step.

```json
package.json

{
	"scripts": {
		"build:css": "node-sass --importer sass-path-resolver ./src/app.scss > ./dist/app.css"
	}
}
```

## Contributing
Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) and [eslint](http://eslint.org/) rules and contributions should make use of them.
