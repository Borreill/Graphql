const PORT = 4000
const express = require("express");
const { graphqlHTTP } = require('express-graphql')
const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        graphiql: true,
    }),
);

app.listen(PORT, () => {
    console.log(`Server up and running on port http://localhost:${PORT} 🎉`)
})