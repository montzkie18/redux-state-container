import {ReduxState} from '../src'
import {expect} from 'chai'

const stateKey = "test"

class TestState extends ReduxState {
  get types() {
    return {
      ...super.types,
      ADD_ITEM: `${this.stateKey}/ADD_ITEM`
    }
  }

  get initialState() {
    return {
      ...super.initialState,
      arrayValue: [],
      objectValue: {},
    }
  }

  get actionHandlers() {
    return {
      ...super.actionHandlers,
      [this.cachedTypes.ADD_ITEM]: (state, action) => ({
        ...state,
        arrayValue: [
          ...state.arrayValue,
          action.item
        ]
      })
    }
  }

  addItem = (item) => ({
    type: this.cachedTypes.ADD_ITEM,
    item
  })
}

describe("ReduxState", () => {
  describe("#constructor", () => {

    it("requires stateKey", () => {
      expect(() => new ReduxState()).to.throw()
    })

    it("creates cached properties", () => {
      const state = new ReduxState("test")
      expect(state.cachedTypes).to.deep.equal(state.types)
      expect(state.cachedTypes).to.equal(state.cachedTypes)

      expect(state.cachedInitialState).to.deep.equal(state.initialState)
      expect(state.cachedInitialState).to.equal(state.cachedInitialState)

      expect(state.cachedActionHandlers).to.deep.equal(state.actionHandlers)
      expect(state.cachedActionHandlers).to.equal(state.cachedActionHandlers)
    })

    it("creates default getters", () => {
      const testState = new TestState(stateKey)
      expect(testState.getArrayValue).to.exist
      expect(testState.getObjectValue).to.exist
    })

    it("creates default setters", () => {
      const testState = new TestState(stateKey)
      expect(testState.setArrayValue).to.exist
      expect(testState.setObjectValue).to.exist
    })

  })

  describe("#reducer", () => {

    it("handles default array set action", () => {
      const testState = new TestState(stateKey)
      const newValue = ["Item1", "Item2", "Item3"]
      const newState = {
        [stateKey]: testState.reduce(null, testState.setArrayValue(newValue))
      }
      expect(testState.getArrayValue(newState)).to.deep.equal(newValue)
    })

    it("handles default object set action", () => {
      const testState = new TestState(stateKey)
      const newValue = {"1":{id:"1",name:"Test1"}, "2":{id:"2",name:"Test2"}};
      const newState = {
        [stateKey]: testState.reduce(null, testState.setObjectValue(newValue))
      }
      expect(testState.getObjectValue(newState)).to.deep.equal(newValue)
    })

    it("handles reset action", () => {
      const testState = new TestState(stateKey)
      const newState = {
        [stateKey]: testState.reduce(null, testState.reset())
      }
      expect(testState.getState(newState)).to.deep.equal(testState.initialState)
    })

    it("handles actions defined in class", () => {
      const testState = new TestState(stateKey)
      const newItem = "Item1"
      const newState = {
        [stateKey]: testState.reduce(null, testState.addItem(newItem))
      }
      expect(testState.getArrayValue(newState)).to.contain(newItem)
    })

  })
})