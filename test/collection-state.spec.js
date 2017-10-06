import {CollectionState} from '../src'
import {expect} from 'chai'

const stateKey = "testCollection";

let collection = null;

describe("CollectionState", () => {

  beforeEach(() => {
    collection = new CollectionState(stateKey);
  })

  describe("#constructor", () => {
    it("derives from ReduxState", () => {
      expect(() => new CollectionState()).to.throw()
    })
  })

  describe("#addItems", () => {
    it("adds all items", () => {
      const object1 = {id: 1}
      const object2 = {id: 2}
      const newValue = {1: object1, 2: object2}
      const newIds = Object.keys(newValue)
      const state = {
        [stateKey]: collection.reduce(null, collection.addItems(newValue, newIds))
      }
      expect(collection.getIds(state)).to.deep.equal(newIds)
      expect(collection.getById(state, 1)).to.equal(object1)
      expect(collection.getById(state, 2)).to.equal(object2)
    })
  })

  describe("#addItem", () => {
    it("adds a single item", () => {
      const object1 = {id: 1}
      const state = {
        [stateKey]: collection.reduce(null, collection.addItem(object1))
      }
      expect(collection.getIds(state)).to.deep.equal([object1.id])
      expect(collection.getById(state, 1)).to.equal(object1)
    })
  })

  describe("#removeItem", () => {
    it("removes a single item", () => {
      const object1 = {id: 1}
      let state = {
        [stateKey]: collection.reduce(null, collection.addItem(object1))
      }
      state = {
        [stateKey]: collection.reduce(null, collection.removeItem(object1))
      }
      expect(collection.getIds(state)).to.deep.equal([])
      expect(collection.getById(state, 1)).to.be.undefined
    })
  })

  describe("#removeId", () => {
    it("removes an item by id", () => {
      const object1 = {id: 1}
      let state = {
        [stateKey]: collection.reduce(null, collection.addItem(object1))
      }
      state = {
        [stateKey]: collection.reduce(null, collection.removeId(1))
      }
      expect(collection.getIds(state)).to.deep.equal([])
      expect(collection.getById(state, 1)).to.be.undefined
    })
  })

  describe("#clearItems", () => {
    it("clears collection", () => {
      const object1 = {id: 1}
      const object2 = {id: 2}
      const newValue = {1: object1, 2: object2}
      const newIds = Object.keys(newValue)
      let state = {
        [stateKey]: collection.reduce(null, collection.addItems(newValue, newIds))
      }
      state = {
        [stateKey]: collection.reduce(null, collection.clearItems())
      }
      expect(collection.getIds(state)).to.deep.equal([])
      expect(collection.getById(state, 1)).to.be.undefined
      expect(collection.getById(state, 2)).to.be.undefined
    })
  })

  describe("#getAll", () => {
    it("returns all items", () => {
      const object1 = {id: 1}
      const object2 = {id: 2}
      const newValue = {1: object1, 2: object2}
      const newIds = Object.keys(newValue)
      let state = {
        [stateKey]: collection.reduce(null, collection.addItems(newValue, newIds))
      }
      expect(collection.getAll(state)).to.deep.equal([object1, object2])
    })
  })

  describe("#getCount", () => {
    it("returns correct count", () => {
      const collection = new CollectionState(stateKey)
      const items = [{id: 1}, {id:2}, {id:3}]
      const newState = {
        [stateKey]: collection.addItems(items)
      }
      expect(collection.getCount(newState)).to.equal(3)
    })
  })

})