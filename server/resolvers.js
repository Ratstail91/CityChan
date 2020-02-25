const group = async (arr) => {
	const pop = await arr.reduce((acc, item) => { acc[item] = item; return acc; }, {});
	return Object.values(pop);
};

module.exports = {
	Thread: {
		posts: (parent, { id }, { db }, info) => db.Post.findAll().filter(p => p.threadId == parent.id)
	},

	Post: {
		//
	},

	Query: {
		Threads: (parent, { country, state, city }, { db }, info) => db.Thread.findAll().filter(t => t.dataValues.country == country && t.dataValues.state == state && t.dataValues.city == city),
		Thread: (parent, { id }, { db }, info) => db.Thread.findByPk(id),
		Post: (parent, { id }, { db }, info) => db.Post.findByPk(id),
		Author: (parent, { author }, { db }, info) => db.Post.findAll().filter(p => p.author == author),
		Country: (parent, args, { db }, info) => group(db.Thread.findAll().map(t => t.country)),
		State: (parent, { country }, { db }, info) => group(db.Thread.findAll().filter(t => t.country == country).map(t => t.state)),
		City: (parent, { country, state }, { db }, info) => group(db.Thread.findAll().filter(t => t.country == country && t.state == state).map(t => t.city)),
	},

	Mutation: {
		createThread: (parent, { country, state, city, author, text }, { db }, info) => {
			return db.Thread.create({
				country: country,
				state: state,
				city: city
			})
			.then(thread => {
				db.Post.create({
					author: author,
					text: text,
					threadId: thread.id
				});
				return thread;
			});
		},

		replyThread: (parent, { id, author, text}, { db }, info) => {
			db.Post.create({
				author: author,
				text: text,
				threadId: id
			});
			return db.Thread.findByPk(id);
		}
	}
};