'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('order_items', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'order_items',
      references: {
        table: 'products',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addConstraint('order_items', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'order_items',
      references: {
        table: 'products',
        field: 'id'
      }
    })
  }
};
