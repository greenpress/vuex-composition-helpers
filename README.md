# vuex-composition-helpers

A util package to use Vuex with Composition API easily.

## Installation
```
$ npm install vuex-composition-helpers
```


###  Basic Usage Examples

```js
import { useState, useActions } from 'vuex-composition-helpers';

export default {
	props: {
		articleId: String
	},
	setup(props, { root }) {
		const { fetch } = useActions(root.store, ['fetch']);
		const { article, comments } = useState(root.store, ['article', 'comments']);
		fetch(props.articleId); // dispatch the "fetch" action

		return {
			// both are computed compositions for to the store
			article,
			comments
		}
	}
}
```



###  Namespaced Usage Examples

```js
import { createNamespacedHelpers } from 'vuex-composition-helpers';

export default {
	props: {
		articleId: String
	},
	setup(props, { root }) {
		const { useState, useActions } = createNamespacedHelpers(store, 'articles'); // specific module name
		const { fetch } = useActions(root.store, ['fetch']);
		const { article, comments } = useState(root.store, ['article', 'comments']);
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
const { fetch } = useActions(root.store, ['fetch']);

export default {
	props: {
		articleId: String
	},
	setup(props, { root }) {
		const { article, comments } = useState(root.store, ['article', 'comments']);
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
