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
    Object.keys(normalized.entities).forEach(name => {
      if(name === this.schema.key) {
        const entities = normalized.entities[name];
        dispatch(this.addItems(entities, Object.keys(entities)))
      }else if(this.childStates[name] && 
        this.childStates[name].setNormalizedData) {
        dispatch(this.childStates[name].setNormalizedData(normalized));
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