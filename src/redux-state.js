import {capitalize, capitalizeCamel} from './utils';
import {createSelector} from 'reselect';

export default class ReduxState {
  constructor(stateKey) {
    if(!stateKey) 
      throw new Error("new ReduxState requires a stateKey");
    this.stateKey = stateKey;
    this.getState = state => state[stateKey];
    this.__createGetters();
    this.__createSetters();
  }

  get types() {
    const result = {};
    Object.keys(this.cachedInitialState).forEach(key => {
      result[`SET_${capitalizeCamel(key)}`] = `${this.stateKey}/SET/${key}`;
    });
    result['RESET'] = `${this.stateKey}/RESET`;
    return result;
  }

  get initialState() {
    return {};
  }

  get actionHandlers() {
    const result = {};
    Object.keys(this.cachedInitialState).forEach(key => {
      result[this.cachedTypes[`SET_${capitalizeCamel(key)}`]] = (state, action) => {
        return this.__setValue(state, action, key);
      };
    });
    result[this.cachedTypes.RESET] = this.__resetValue;
    return result;
  }

  get cachedTypes() {
    return this.__cache("types", this.types);
  }

  get cachedInitialState() {
    return this.__cache("initialState", this.initialState);
  }

  get cachedActionHandlers() {
    return this.__cache("actionHandlers", this.actionHandlers);
  }

  reset = () => ({
    type: `${this.stateKey}/RESET`
  });

  reduce = (state, action) => {
    state = state || this.cachedInitialState;
    const handler = this.cachedActionHandlers[action.type];
    return handler ? handler(state, action) : state;
  };

  __createGetters = () => {
    Object.keys(this.cachedInitialState).forEach(key => {
      // console.log(`State [${this.stateKey}] creating getter [get${capitalize(key)}]`)
      this[`get${capitalize(key)}`] = createSelector(
        this.getState,
        state => state[key]
      );
    });
  };

  __createSetters = () => {
    Object.keys(this.cachedInitialState).forEach(key => {
      // console.log(`State [${this.stateKey}] creating setter [set${capitalize(key)}]`)
      this[`set${capitalize(key)}`] = (value) => ({
        type: this.cachedTypes[`SET_${capitalizeCamel(key)}`],
        [key]: value
      });
    });
  };

  __setValue = (state, action, key) => ({
    ...state,
    [key]: this.__clone(action[key]),
  });

  __resetValue = (state, action) => this.cachedInitialState;

  __clone = (obj) => {
    if(obj && obj.constructor === Array)
      return [...obj];
    else if(obj && obj.constructor === Object)
      return {...obj};
    return obj;
  };

  __cache = (propertyName, value) => {
    const key = `_${propertyName}`;
    if(this[key]) return this[key];
    return this[key] = value;
  };
}