const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
} = graphql

const users = [
    { id: '1', firstName: 'Antoine', lastName: 'Laframboise', age: 34, email: "pafihudewo11-50@yopmail.com" },
    { id: '2', firstName: 'Honore', lastName: 'Lagrange', age: 45, email: "jonukleva3569@yopmail.com" }
];
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        age: { type: GraphQLInt },
        email: { type: GraphQLString },
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return _.find(users, { id: args.id });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});