import ReduxState from './redux-state'
import {createSelector} from 'reselect';
import {mergeArrays} from './utils';

export default class CollectionState extends ReduxState {
  get types() {
    return {
      ADD_ITEMS:    `${this.stateKey}/ADD_ITEMS`,
      ADD_ITEM:     `${this.stateKey}/ADD_ITEM`,
      REMOVE_ITEM:  `${this.stateKey}/REMOVE_ITEM`,
      REMOVE_ID:    `${this.stateKey}/REMOVE_ID`,
      CLEAR:        `${this.stateKey}/CLEAR`,
    };
  };

  get initialState() { 
    return {
      ids: [],
      byId: {},
    };
  };

  get actionHandlers() {
    return {
      [this.cachedTypes.ADD_ITEMS]: (state, action) => ({
        ...state,
        ids: mergeArrays(state.ids, action.ids),
        byId: {
          ...state.byId,
          ...action.itemsById,
        },
      }),
      [this.cachedTypes.ADD_ITEM]: (state, action) => {
        if(!action.item) return state;
        return {
          ...state,
          ids: mergeArrays(state.ids, [action.item.id]),
          byId: {
            ...state.byId,
            [action.item.id]: action.item
          }
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
      [this.cachedTypes.CLEAR]: (state) => this.initialState
    };
  };

  addItems = (itemsById, ids) => ({
    type: this.cachedTypes.ADD_ITEMS,
    itemsById,
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

  clear = () => ({
    type: this.cachedTypes.CLEAR
  });

  getAll = createSelector(
    this.getState,
    state => Object.keys(state.byId).map(id => state.byId[id])
  );

  getById = (state, id) => this.getState(state).byId[id];
}