import ReduxState from './redux-state'
import {createSelector} from 'reselect';
import {mergeArrays, mergeObjects} from './utils';

export default class CollectionState extends ReduxState {
  get types() {
    return {
      ...super.types,
      ADD_ITEMS:    `${this.stateKey}/ADD_ITEMS`,
      ADD_ITEM:     `${this.stateKey}/ADD_ITEM`,
      REMOVE_ITEM:  `${this.stateKey}/REMOVE_ITEM`,
      REMOVE_ID:    `${this.stateKey}/REMOVE_ID`,
      CLEAR_ITEMS:  `${this.stateKey}/CLEAR_ITEMS`,
    };
  };

  get initialState() { 
    return {
      ...super.initialState,
      ids: [],
      byId: {},
    };
  };

  get actionHandlers() {
    return {
      ...super.actionHandlers,
      [this.cachedTypes.ADD_ITEMS]: (state, action) => ({
        ...state,
        ids: mergeArrays(state.ids, action.ids),
        byId: mergeObjects(state.byId, action.byId),
      }),
      [this.cachedTypes.ADD_ITEM]: (state, action) => {
        if(!action.item) return state;
        return {
          ...state,
          ids: mergeArrays(state.ids, [action.item.id]),
          byId: mergeObjects(state.byId, {
            [action.item.id]: action.item
          })
        }
      },
      [this.cachedTypes.REMOVE_ITEM]: (state, action) => {
        if(!action.item) return state;
        return {
          ...state,
          ids: state.ids.filter(id => id !== action.item.id),
          byId: Object.keys(state.byId).reduce((result, key) => {
            if(key !== action.item.id)
              result[key] = state.byId[key];
            return result;
          }, {})
        };
      },
      [this.cachedTypes.REMOVE_ID]: (state, action) => ({
        ...state,
        ids: state.ids.filter(id => id !== action.id),
        byId: Object.keys(state.byId).reduce((result, key) => {
          if(key !== action.id)
            result[key] = state.byId[key];
          return result;
        }, {})
      }),
      [this.cachedTypes.CLEAR_ITEMS]: (state) => ({
        ...state,
        ids: [],
        byId: {},
      }),
    };
  };

  addItems = (byId, ids) => ({
    type: this.cachedTypes.ADD_ITEMS,
    byId,
    ids,
  });

  addItem = (item) => ({
    type: this.cachedTypes.ADD_ITEM,
    item
  });

  removeItem = (item) => ({
    type: this.cachedTypes.REMOVE_ITEM,
    item
  });

  removeId = (id) => ({
    type: this.cachedTypes.REMOVE_ID,
    id
  });

  clearItems = () => ({
    type: this.cachedTypes.CLEAR_ITEMS
  });

  getAll = createSelector(
    this.getState,
    state => Object.keys(state.byId).map(id => state.byId[id])
  );

  getById = (state, id) => this.getState(state).byId[id];

  getCount = createSelector(
    this.getAll,
    items => items.length
  );
}