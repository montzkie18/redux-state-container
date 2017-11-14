import CollectionState from './collection-state';
import {normalize} from 'normalizr';

export default class EntityState extends CollectionState {
  constructor(stateKey, schema, childStates = {}) {
    super(stateKey);
    if(!schema)
      throw new Error("EntityState requires a normalizr schema");
    this.schema = schema;
    this.childStates = childStates;
  }

  normalizeData = (data) => (dispatch) => {
    const normalized = normalize([].concat(data), [this.schema]);
    dispatch(this.setNormalizedData(normalized));
  };

  setNormalizedData = (normalized) => (dispatch) => {
    const entities = {...normalize.entities};
    Object.keys(entities).forEach(name => {
      if(name === this.schema.key) {
        const items = {...entities[name]};
        dispatch(this.addItems(items, Object.keys(items)))
        delete entities[name];
      }else if(this.childStates[name] && 
        this.childStates[name].setNormalizedData) {
        dispatch(this.childStates[name].setNormalizedData({entities}));
      }
    });
  };

  clearData = () => (dispatch) => {
    const findChildSchema = (parent) => {
      if(!!parent) {
        if(parent.constructor === Array) {
          parent.forEach(child => {
            if(child.schema && child.key)
              clearSchema(child);
            else
              findChildSchema(child);
          });
        }else if(parent.constructor === Object) {
          Object.keys(parent).forEach(key => {
            const child = parent[key];
            if(child.schema && child.key)
              clearSchema(child);
            else
              findChildSchema(child);
          });
        }
      }
    };

    const clearSchema = (objSchema) => {
      // this is the parent schema
      if(objSchema.key === this.schema.key) {
        dispatch(this.clearItems());
      }

      const childState = this.childStates[objSchema.key];
      if(childState && childState.clearSchema) {
        dispatch(childState.clearData());
      }else{
        findChildSchema(objSchema.schema);
      }
    };

    clearSchema(this.schema);
  }
}