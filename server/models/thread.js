module.exports = (Sequelize, DataTypes) => {
	const Thread = Sequelize.define('Thread', {
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
		country: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true
		},
		state: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true
		},
		city: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true
		}
	});

	Thread.associate = models => {
		Thread.hasMany(models.Post);
	};

	return Thread;
};