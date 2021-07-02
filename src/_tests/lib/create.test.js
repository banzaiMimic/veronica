const makeCreate = require('../../lib/create')

const createDefaults = {
  templatePath: 'templatePath',
  replacementKeys: {},
  replacements: {
    method: 'get',
    action: 'act',
    entity: 'cart'
  },
  clonedPath: {},
  logger: {
    info: jest.fn(() => {})
  }
}

let create

beforeAll(() => {
  create = makeCreate({...createDefaults})
})

test('getFilenameUpdate returns correct filename', () => {
  let filenameUpdate = create.getFilenameUpdate({filename: 'controllers/[method][action][entity].js'})
  expect(filenameUpdate).toBe('controllers/getActCart.js')
})

test('getFilenameUpdate returns correct filename with blank action', () => {
  let filenameUpdate = makeCreate({
    ...createDefaults,
    replacements: {
      method: 'post',
      action: '',
      entity: 'booking'
    }
  }).getFilenameUpdate({filename: 'controllers/[method][action][entity].js'})
  expect(filenameUpdate).toBe('controllers/postBooking.js')
})

test('getFilenameUpdate returns correct filename for [entity].js', () => {
  let filenameUpdate = makeCreate({
    ...createDefaults,
    replacements: {
      method: 'post',
      action: '',
      entity: 'booking'
    }
  }).getFilenameUpdate({filename: 'entity/[entity].js'})
  expect(filenameUpdate).toBe('entity/Booking.js')
})