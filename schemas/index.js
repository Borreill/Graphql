const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then((response) => {
                    return response.data;
                })
            }
        }
    })
});

const JobType = new GraphQLObjectType({
    name: 'Job',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/executive_titles/${parentValue.id}/users`).then((response) => {
                    return response.data;
                })
            }
        }
    })
});
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        age: { type: GraphQLInt },
        email: { type: GraphQLString },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                // console.log(parentValue)
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then((response) => {
                    return response.data;
                })
            }
        },
        job: {
            type: JobType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/executive_titles/${parentValue.jobId}`).then((response) => {
                    return response.data;
                })
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString },
                jobId: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return axios.post(`http://localhost:3000/users`, { firstName: args.firstName, lastName: args.lastName, age: args.age, companyId: args.companyId, jobId: args.jobId }).then((response) => {
                    return response.data;
                });
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                console.log(args.id);
                return axios.delete(`http://localhost:3000/users/${args.id}`).then((response) => {
                    return response.data;
                });

            }
        }

    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then((response) => {
                    return response.data;
                })
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`).then((response) => {
                    return response.data;
                })
            }
        },
        job: {
            type: JobType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/executive_titles/${args.id}`).then((response) => {
                    return response.data;
                })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});