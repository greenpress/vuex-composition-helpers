# vuex-composition-helpers

![CI](https://github.com/greenpress/vuex-composition-helpers/workflows/CI/badge.svg?branch=master)
[![npm version](https://badge.fury.io/js/vuex-composition-helpers.svg)](https://badge.fury.io/js/vuex-composition-helpers)

A util package to use Vuex with Composition API easily.

## Installation

```shell
$ npm install vuex-composition-helpers
```

This library is not transpiled by default. Your project should transpile it, which makes the final build smaller and more tree-shakeable. Take a look at [transpiling](#transpiling).

Non-typescript projects may import the library from the `dist` subdirectory, where plain javascript distribution files are located.

```
import { useState, ... } from 'vuex-composition-helpers/dist';
```

### Basic Usage Examples

```js
import { useState, useActions } from 'vuex-composition-helpers';

export default {
	props: {
		articleId: String
	},
	setup(props) {
		const { fetch } = useActions(['fetch']);
		const { article, comments } = useState(['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```

### Namespaced Usage Examples

```js
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useState, useActions } = createNamespacedHelpers('articles'); // specific module name

export default {
	props: {
		articleId: String
	},
	setup(props) {
		const { fetch } = useActions(['fetch']);
		const { article, comments } = useState(['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```

You can also import your store from outside the component, and create the helpers outside of the `setup` method, for example:

```js
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import store from '../store'; // local store file
const { useState, useActions } = createNamespacedHelpers(store, 'articles'); // specific module name
const { fetch } = useActions(['fetch']);

export default {
	props: {
		articleId: String
	},
	setup(props) {
		const { article, comments } = useState(['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```

### Typescript mappings

You can also supply typing information to each of the mapping functions to provide a fully typed mapping.

```ts
import { useState, useActions } from 'vuex-composition-helpers';

interface RootGetters extends GetterTree<any, any> {
	article: string;
	comments: string;
}

interface RootActions extends ActionTree<any, any> {
	fetch: (ctx: ActionContext<any, any>, payload: number);
}

export default {
	props: {
		articleId: String
	},
	setup(props) {
		const { fetch } = useActions<RootActions>(['fetch']);
		const { article, comments } = useGetters<RootGetters>(['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```

### Advanced Usage Example

Consider separate the store composition file from the store usage inside the component. i.g.:

```js
// store-composition.js:
import { wrapStore } from 'vuex-composition-helpers';
import store from '@/store'; // local store file

export default wrapStore(store);
```

```js
// my-component.vue:
import { createNamespacedHelpers } from './store-composition.js';
const { useState, useActions } = createNamespacedHelpers('articles'); // specific module name
const { fetch } = useActions(['fetch']);

export default {
	props: {
		articleId: String
	},
	setup(props) {
		const { article, comments } = useState(['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```

### Transpiling

It depends on you project's stack, but let's say it consists of webpack, babel and ts-loader.

The rule processing `.ts` files should whitelist vuex-composition-helpers. If your project uses a raw webpack installation, it should resemble this.

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      test: /\.ts$/,
      // If node_modules is excluded from the rule, vuex-composition-helpers should be an exception
      exclude: /node_modules(?!\/vuex-composition-helpers)/,
      use: [
        {
          loader: 'babel-loader',
          ...
        },
        {
          loader: 'thread-loader',
          options: { ... }
        },
        {
          loader: 'ts-loader',
          ...
        }
    ]
  }
}
```

When using `vue-cli`, use this instead

```js
// vue.config.js
module.exports = {
  ...
  chainWebpack: config => {
    config
      .rule('ts')
      .include
      .add(/vuex-composition-helpers/)
  }
}
```

If your webpack configuration is excluding `node_modules` from the bundle, which is common for SSR, this library should be an exception.

```
// webpack.config.js
module.exports = {
 ...
  externals: [nodeExternals({
    whitelist: [/^vuex-composition-helpers/]
  })],
}
```

Babel should not `exclude` or `ignore` this library. If you use `vue-cli`, you may need the following configuration.

```js
// vue.config.js
module.exports = {
  ...
  transpileDependencies: ['vuex-composition-helpers'],
}
```

Although it's not strictly required, maybe ts-loader needs to have `allowTsInNodeModules` enabled in your project. Finally check that this library is not excluded in `tsconfig.json`, and if it was necessary, put it in the `include` list.

Enjoy!
