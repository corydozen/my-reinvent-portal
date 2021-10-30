import { createBrowserHistory } from "history";
import { createStore } from "redux";

import createRootReducer from "./reducers";

export const history = createBrowserHistory();

export default function configureStore(preloadedState = {}) {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    undefined
  );

  if (process.env.NODE_ENV !== "production" && (module as any).hot) {
    (module as any).hot.accept("./reducers", () =>
      store.replaceReducer(createRootReducer(history))
    );
  }

  return store;
}
