const make[METHOD][ACTION][ENTITY] = ({ [ACTION][ENTITY] }) => {
  const [METHOD][ACTION][ENTITY] = async (httpRequest) => { 
    const { bodyParam } = httpRequest.body

    if (!bodyParam) {
      return {
        statusCode: 400,
        data: 'missing bodyParam param'
      }
    }

    let result

    try {
      result = await [ACTION][ENTITY]({})
      return {
        statusCode: 200,
        data: result
      }
    } catch (e) {
      // log.error({
      //   event: '[METHOD][ACTION][ENTITY] error',
      //   message: e.message
      // })
      return {
        statusCode: 400,
        data: e.message
      }
    }
  }

  return Object.freeze({
    [METHOD][ACTION][ENTITY]
  })
}

module.exports = make[METHOD][ACTION][ENTITY]