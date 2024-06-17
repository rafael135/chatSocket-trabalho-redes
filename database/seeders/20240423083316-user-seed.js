'use strict';
const fakerReq = require("@faker-js/faker");
const user = require("../models/user");

const faker = new fakerReq.Faker({
	
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		let limit = 80;

		for(let i = 0; i < limit; i++) {
			let name = faker.person.firstName();
			let nickName = `${name}#${Math.round(Math.random() * 9999)}`;
			let password = faker.internet.password();
			let email = faker.internet.email({ firstName: name });
			let createdAt = new Date();
			let updatedAt = new Date();

			return queryInterface.bulkInsert("Users", [{
				uuid: faker.string.uuid(),
				name: name,
				nickName: nickName,
				email: email,
				password: password,
				createdAt: createdAt,
				updatedAt: updatedAt
			}]);

			
		}

		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		*/
	},

	async down (queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
