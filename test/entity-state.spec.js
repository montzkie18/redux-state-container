import {EntityState} from '../src'
import {expect} from 'chai'

const stateKey = "test";

describe("EntityState", () => {

  describe("#constructor", () => {

    it("requires a normalizr schema", () => {
      expect(() => new EntityState(stateKey)).to.throw()
    })

  })

  describe("#normalizeData", () => {

  })

  describe("#setNormalizedData", () => {

  })

  describe("#clearData", () => {

  })

})