const assert = require('assert')
const { assertEvent } = require('../utils')
const Media = artifacts.require('Media')

contract('Media', accounts => {
  console.log('ACCOUNTS', accounts)
  const test1 = {
    name: 'test 1 - item on',
    status: 'on'
  }

  const test2 = {
    name: 'test 2 - item off',
    status: 'off'
  }

  const test3 = {
    name: 'test 3 - item off',
    status: 'off'
  }

  const test11 = {
    name: 'Second account',
    status: 'on'
  }

  it('should create one item and get one item when there is only one item', () => {
     return Media.deployed()
      .then(instance => {
        instance.change(JSON.stringify(test1), {from: accounts[0]})
        return instance.getMedia.call(accounts[0])
      })
      .then(todos => {
        return assert.equal(todos, JSON.stringify(test1))
      })
  })

  it('should create two items and get two items when there are two items', function () {
    return Media.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test2]), {from: accounts[0]})
      return instance.getMedia.call(accounts[0])
    })
    .then(media => {
      return assert.equal(media, JSON.stringify([test1, test2]))
    })
  })

  it('should allow setting less items', function () {
    return Media.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test2]), {from: accounts[0]})
      instance.change(JSON.stringify([test1]), {from: accounts[0]})
      return instance.getMedia.call(accounts[0])
    })
    .then(media => {
      return assert.equal(media, JSON.stringify([test1]))
    })
  })

  it('should allow setting many items', function () {
    return Media.deployed().then(instance => {
      instance.change(JSON.stringify([test1, test3]), {from: accounts[0]})
      return instance.getMedia.call(accounts[0])
    })
    .then(media => {
      return assert.equal(media, JSON.stringify([test1, test3]))
    })
  })

  it('should allow setting one item from a different account', function () {
    return Media.deployed().then(instance => {
      instance.change(JSON.stringify([ test11 ]), {from: accounts[1]})
      return instance.getMedia.call(accounts[1])
    })
    .then(media => {
      return assert.equal(media, JSON.stringify([ test11 ]))
    })
  })

  it('should receive an event after adding an item', function () {
    let _instance = null;
    return Media.deployed()
    .then(instance => {
      _instance = instance;
      return instance.change(JSON.stringify([test3]), {from: accounts[0]})
    })
    .then(() => assertEvent(_instance, { event: 'MediaChange', args: { _from: accounts[0], mediaList: JSON.stringify([test3]) }}))
    .then(logs => {
      assert.equal(logs.event, 'MediaChange')
      assert.equal(logs.args._from, accounts[0])
      assert.equal(logs.args.mediaList, JSON.stringify([test3]))
    })
  })


})
