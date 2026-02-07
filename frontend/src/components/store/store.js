import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import {productsReducer} from "../product page/productsReducer";
import thunk from "redux-thunk"
import ProductRed from "../singleProduct page/productReducer";

const combinedReducer = combineReducers({
  singlePR:ProductRed,
  product: productsReducer
});

const store = legacy_createStore(combinedReducer, applyMiddleware(logger,thunk));
console.log(store.getState())

export {store};