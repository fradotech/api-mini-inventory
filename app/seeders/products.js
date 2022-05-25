module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'products',
      [
        {
          name: 'Beras',
          stock: 1000,
          unit: '1kg',
          grocery_price: 12000,
          sell_price: 15000,
        }, {
          name: 'Garam',
          stock: 1000,
          unit: '1kg',
          grocery_price: 25000,
          sell_price: 30000,
        }, {
          name: 'Micin',
          stock: 1000,
          unit: '1kg',
          grocery_price: 45000,
          sell_price: 50000,
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
