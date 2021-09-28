import {Store} from "vuex/types";
import {createNamespacedHelpers, NamespacedHelpers} from "./namespaced";
import {useActions, useGetters, useMutations, useState} from "./global";
import {KnownKeys, RefTypes, ExtractGetterTypes, ExtractTypes} from "./util";

export type WrappedStore = {
    createNamespacedHelpers: <TState = any, TGetters = any, TActions = any, TMutations = any>(namespace: string) => NamespacedHelpers<TState, TGetters, TActions, TMutations>;
    useState: <TState = any>(map: KnownKeys<TState>[]) => RefTypes<TState>;
    useGetters: <TGetters = any>(map: KnownKeys<TGetters>[]) => ExtractGetterTypes<TGetters>;
    useMutations: <TMutations = any>(map: KnownKeys<TMutations>[]) => ExtractTypes<TMutations, Function>;
    useActions: <TActions = any>(map: KnownKeys<TActions>[]) => ExtractTypes<TActions, Function>;
};

export function wrapStore(store: Store<any>): WrappedStore {
    return {
        createNamespacedHelpers: createNamespacedHelpers.bind(null, store),
        useActions: useActions.bind(null, store),
        useGetters: useGetters.bind(null, store),
        useMutations: useMutations.bind(null, store),
        useState: useState.bind(null, store),
    };
}