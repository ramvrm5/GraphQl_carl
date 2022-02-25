const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
    _id: ID
    reference_instrument: String
    symbol: String
    type: String
    factor: Int
    bid: Float
    ask: Float
    product_type: String
    barrier: String
    investment_class:String
    count:Int  
}

type Invest {
    investment_class:String
    label:String
}

type RootQuery {
    events(factorMin: String!, factorMax: String!, productType: String!, referenceInstrument: String!, limit: String!, skip: String!): [Event!]!
    
    invest:[Invest!]!
}

schema {
    query: RootQuery
}
`);