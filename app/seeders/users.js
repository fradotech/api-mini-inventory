module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Framesta Fernando',
          email: 'fradotech.id@gmail.com',
          password: '$2b$10$NteiAbfGrOjh76Wne204Z.M5HeFP.Yzc5s8so6k0opoCzmu0k.q3W', // fradoo
        }
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
