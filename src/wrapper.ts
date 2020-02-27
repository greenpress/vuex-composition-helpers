import {createNamespacedHelpers} from './namespaced';
import {useActions, useGetters, useMutations, useState} from './global'

export function wrapStore(store: any) {
	return {
		createNamespacedHelpers: createNamespacedHelpers.bind(null, store),
		useActions: useActions.bind(null, store),
		useGetters: useGetters.bind(null, store),
		useMutations: useMutations.bind(null, store),
		useState: useState.bind(null, store)
	}
}
