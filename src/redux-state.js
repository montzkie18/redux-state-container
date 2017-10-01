import {capitalize} from './utils';
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
    return {};
  }

  get initialState() {
    return {};
  }

  get actionHandlers() {
    return {};
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

  reduce = (state, action) => {
    state = state || this.cachedInitialState;
    const params = action.type.split('/');
    if(params.length === 3 && 
       params[0] === this.stateKey &&
       params[1] === 'SET') {
      return this.__setValue(state, action, params[2]);
    }else{
      const handler = this.cachedActionHandlers[action.type];
      return handler ? handler(state, action) : state;
    }
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
        type: `${this.stateKey}/SET/${key}`,
        [key]: value
      });
    });
  };

  __setValue = (state, action, key) => ({
    ...state,
    [key]: this.__clone(action[key]),
  });

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