import {CollectionState} from '../src'
import {expect} from 'chai'

const stateKey = "testCollection";

describe("CollectionState", () => {

  describe("#constructor", () => {

    it("derives from ReduxState", () => {
      expect(() => new CollectionState()).to.throw()
    })

  })

  describe("#addItems", () => {

  })

  describe("#addItem", () => {

  })

  describe("#removeItem", () => {

  })

  describe("#removeId", () => {

  })

  describe("#clear", () => {

  })

  describe("#getAll", () => {

  })

  describe("#getById", () => {
    
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