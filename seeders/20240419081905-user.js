"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        name: "Gita",
        age: 20,
        address: "Indonesia",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anisa",
        age: 20,
        address: "Indonesia",
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Putri",
        age: 20,
        address: "Indonesia",
        role: "Member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rahmat",
        age: 20,
        address: "Indonesia",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Diana",
        age: 20,
        address: "Indonesia",
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertUsers = await queryInterface.bulkInsert("User", users, {
      returning: true,
    });

    const passwords = [
      "$2a$12$10vupvanfgJkHPTORSCQ6eeIynkLdT5sPdlK6/k7AjnJvLWPGUAL2",
      "$2a$12$Epz1CSFLIwIr62zMVjMnNeTvMOBik1pc/ExsK654ctPzc9a1NPrHy",
      "$2a$12$vlQHmJOvv96mkN9qZCNtDuLXVK5hFU3m/ee2ZTkYo/6ZVwerwXwbC",
      "$2a$12$T2zU2ZtQS6NrEWioAO98HuukOvM.Ps33jU0bdmLvltueDcqxZD6ti",
      "$2a$12$BN3IMBs6d3IFTsWm.BkqteCRgA.RFBkVqW70YWi2.XGiaEoN3EeZ2",
    ];

    const auths = insertUsers.map((user, index) => ({
      email: `${user.name}@gmail.com`,
      password: passwords[index],
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Auth", auths);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User", null, {});
    await queryInterface.bulkDelete("Auth", null, {});
  },
};
