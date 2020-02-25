module.exports = (Sequelize, DataTypes) => {
	const Post = Sequelize.define('Post', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		td: {
			type: 'TIMESTAMP',
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false
		},
		author: {
			type: DataTypes.STRING,
			defaultValue: 'anonymous',
			allowNull: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},

		threadId: DataTypes.INTEGER
	});

	Post.associate = models => {
		Post.belongsTo(models.Thread, {
			onDelete: 'CASCADE',
			foreignLey: 'threadId',
			targetKey: 'id'
		});
	};

	return Post;
};