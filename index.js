const express = require('express');
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const app = express();

const transactions = [{
	"token_address": 0x03cb0021808442ad5efb61197966aef72a1def96,
	"from_address": 0x03cb0021808442ad5efb61197966aef72a1def96,
	"to_address": 0x38f7c17384abea695f2b05be5f8892f9fe62ffa2,
	"value": 155000000000000000,
	"transaction_hash": 0x9e2035f329c79415418c493a8eb9a22c71ca353018607c88af31e061a01cd227,
	"log_index": 15,
	"block_timestamp": "2018-12-04 00:54:58 UTC",
	"block_number": 6821632,
	"block_hash": 0x0c18d9eee65ad4e0a5cb0430b1fcbc8861917f70af45b1eba6e407f67ea84c46
},
{
	"token_address": 0xe81d72d14b1516e68ac3190a46c93302cc8ed60f,
	"from_address": 0x4060369598c9ceae3178167387a26b885381493e,
	"to_address": 0x8d12a197cb00d4747a1fe03395095ce2a5cc6819,
	"value": 1953700000000000000000,
	"transaction_hash": 0x36f2e6df592273d97d728bc614d41ebbb62dfbc36af4770f6ff1e22ea4243ac3,
	"log_index": 7,
	"block_timestamp": "2018-12-04 00:54:58 UTC",
	"block_number": 6821632,
	"block_hash": 0x0c18d9eee65ad4e0a5cb0430b1fcbc8861917f70af45b1eba6e407f67ea84c46
},
{
	"token_address": 0xaf45628ea7e0c3ffe645e7e41b0fa580d53cdd87,
	"from_address": 0xa1f605019dacfbcfa06b910d6489cf252870e49f,
	"to_address": 0x2686d66e0c1f591a0099852bf0b6b1b0ba1edb3f,
	"value": 500000000000000000000,
	"transaction_hash": 0xaea5ed76a4314f7e81d75c1541e92a16369641a0b899139c28c617da49c53e9f,
	"log_index": 9,
	"block_timestamp": "2018-12-04 00:54:58 UTC",
	"block_number": 6821632,
	"block_hash": 0x0c18d9eee65ad4e0a5cb0430b1fcbc8861917f70af45b1eba6e407f67ea84c46
},
{
	"token_address": 0xfbc6336ea5319daba3a1d6fa3028fc54a9022f9a,
	"from_address": 0x502a76d02dfaeb9a7907a4e4b28fb66519ba7d60,
	"to_address": 0xcddef912191de72f9d25b1bf48faca4cbb92ba9e,
	"value": 437970270578033033216,
	"transaction_hash": 0x94ef3b1724509b018a05334a28d46b419534884407ef4dbeab4f493cb065322e,
	"log_index": 10,
	"block_timestamp": "2018-12-04 00:54:58 UTC",
	"block_number": 6821632,
	"block_hash": 0x0c18d9eee65ad4e0a5cb0430b1fcbc8861917f70af45b1eba6e407f67ea84c46
}];

const labels = [{
    "name": "High Value Transaction",
	"from_address": 0x03cb0021808442ad5efb61197966aef72a1def96,
	"to_address": 0x38f7c17384abea695f2b05be5f8892f9fe62ffa2,
	"block_number": 6821632
},
{
    "name": "International Transaction",
	"from_address": 0x4060369598c9ceae3178167387a26b885381493e,
	"to_address": 0x8d12a197cb00d4747a1fe03395095ce2a5cc6819,
	"block_number": 6821632

},
{
    "name": "Games",
	"from_address": 0xa1f605019dacfbcfa06b910d6489cf252870e49f,
	"to_address": 0x2686d66e0c1f591a0099852bf0b6b1b0ba1edb3f,
	"block_number": 6821632
},
{
    "name": "DeFi",
	"from_address": 0x502a76d02dfaeb9a7907a4e4b28fb66519ba7d60,
	"to_address": 0xcddef912191de72f9d25b1bf48faca4cbb92ba9e,
	"block_number": 6821632
}];

const transactionType = new GraphQLObjectType({
    name: 'transaction',
    description: 'This represents a transaction',
    fields: () => ({
        from_address: { type: GraphQLNonNull(GraphQLString) },
        to_address: { type: GraphQLNonNull(GraphQLString) },
        block_number: { type: GraphQLNonNull(GraphQLInt) },
      label: {
        type: labelType,
        resolve: (transaction) => {
          return labels.find(label => label.from_address === transaction.from_address &&
            label.to_address === transaction.to_address &&
            label.block_number === transaction.block_number );
        }
      }
    })
  });

  const labelType = new GraphQLObjectType({
    name: 'Label',
    description: 'This represents a label',
    fields: () => ({
        name: { type: GraphQLNonNull(GraphQLString)},
        from_address: { type: GraphQLNonNull(GraphQLString) },
        to_address: { type: GraphQLNonNull(GraphQLString) },
        block_number: { type: GraphQLNonNull(GraphQLInt) },
      transaction: {
        type: transactionType,
        resolve: (label) => {
          return transactions.find(transaction => transaction.from_address === label.from_address &&
            transaction.to_address === label.to_address &&
            transaction.block_number === label.block_number );
        }
      }
    })
  });

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      transaction: {
        type: transactionType,
        description: 'A Single Transaction',
        args: {
            from_address: { type: GraphQLString },
            to_address: { type: GraphQLString },
            block_number: { type: GraphQLInt}
        },
        resolve: (parent, args) => transaction.find(transaction => transaction.from_address === args.from_address &&
            transaction.to_address === args.to_address &&
            transaction.block_number === args.block_number )
      },
      transactions: {
        type: new GraphQLList(transactionType),
        description: 'List of All transactions',
        resolve: () => transactions
      },
      labels: {
        type: new GraphQLList(labelType),
        description: 'List of All labels',
        resolve: () => labels
      },
      label: {
        type: labelType,
        description: 'A Single label',
        args: {
            from_address: { type: GraphQLString },
            to_address: { type: GraphQLString },
            block_number: { type: GraphQLInt}
        },
        resolve: (parent, args) => label.find(label => label.from_address === args.from_address &&
            label.to_address === args.to_address &&
            label.block_number === args.block_number )
      }
    })
  })


const schema = new GraphQLSchema({
    // query: new GraphQLObjectType({
    //     name: 'HelloWorld',
    //     fields: () => ({
    //         message: { 
    //             type: GraphQLString,
    //             resolve: () => 'Hello World'
    //         }
    //     })
    // })
    query: RootQueryType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(5000., () => console.log('Server Running.'));

