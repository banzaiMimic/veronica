const make[METHOD][ACTION][ENTITY] = ({ readCart, log }) => {
  const getReadCart = async (httpRequest) => {
    const _id = httpRequest.params.id

    if (!_id) {
      return {
        statusCode: 400,
        data: 'missing cartId param'
      }
    }

    let entity

    try {
      entity = await readCart({ _id })
      return {
        statusCode: 200,
        data: entity
      }
    } catch (e) {
      log.error({
        event: 'friday | makeCart error',
        message: e.message
      })
      return {
        statusCode: 400,
        data: `error reading cart with _id ${_id}`
      }
    }
  }

  return Object.freeze({
    getReadCart
  })
}

module.exports = makeGetReadCart