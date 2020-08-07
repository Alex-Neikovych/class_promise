const AlexPromise = require('./promises')

const t = setTimeout

describe('Promise', () => {
  let promise
  let executorSpy

  const successResult = 5
  const errorResult = 'I am error'

  beforeEach(() => {
    executorSpy = jest.fn((resolve) => t(() => resolve(successResult), 150))
    promise = new AlexPromise(executorSpy)
  })

  test('should exist and to be typeof function', () => {
    expect(AlexPromise).toBeDefined()
    expect(typeof AlexPromise).toBe('function')
  })

  test('instance should have methods: then, catch, finally', () => {
    expect(promise.then).toBeDefined()
    expect(promise.catch).toBeDefined()
    expect(promise.finally).not.toBeUndefined()
  })

  test('should call executor function', () => {
    expect(executorSpy).toHaveBeenCalled()
  })

  test('should get data in then block and chain them', async () => {
    const result = await promise.then(num => num).then(num => num * 2)
    expect(result).toBe(successResult * 2)
  })

  test('should catch an error', () => {
    const errorExecutor = (_, r) => t(() => r(errorResult), 150)
    const errorPromise = new AlexPromise(errorExecutor)

    return new Promise(resolve => {
      errorPromise.catch(error => {
        expect(error).toBe(errorResult)
        resolve()
      })
    })
  })

  test('should call finally method', async () => {
    const finallySpy = jest.fn(() => {})
    await promise.finally(finallySpy)

    expect(finallySpy).toHaveBeenCalled()
  })
})
