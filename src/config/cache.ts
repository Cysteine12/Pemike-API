import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 10 * 60 })

export default cache
