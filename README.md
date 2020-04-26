# vuex-composition-helpers

[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/greenpress/vuex-composition-helpers%2Ftest?type=cf-1)]( https%3A%2F%2Fg.codefresh.io%2Fpipelines%2Ftest%2Fbuilds%3Ffilter%3Dtrigger%3Abuild~Build%3Bpipeline%3A5e915b7d4c3d6b0fd35ac83d~test)

A util package to use Vuex with Composition API easily.

## Installation

```shell
$ npm install vuex-composition-helpers
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

consider separate the store composition file from the store usage inside the component. i.g.:

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

Enjoy!
