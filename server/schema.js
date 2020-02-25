module.exports = `
scalar TIMESTAMP

type Thread {
	id: ID!
	td: TIMESTAMP!
	country: String
	state: String
	city: String
	posts: [Post!]!
}

type Post {
	id: ID!
	td: TIMESTAMP!
	author: String!
	text: String!
}

type Query {
	Threads(id: ID, country: String, state: String, city: String): [Thread]
	Thread(id: ID!): Thread
	Post(id: ID!): Post
	Author(author: String!): [Post]!
	Country: [String]!
	State(country: String!): [String]!
	City(country: String!, state: String!): [String]!
}

type Mutation {
	createThread(country: String, state: String, city: String, author: String, text: String!): Thread
	replyThread(id: ID!, author: String, text: String!): Thread
}
`;