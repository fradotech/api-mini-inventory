'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('order_items', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'order_item',
      references: {
        table: 'orders',
        field: 'id'
      },
      onDelete: 'CASCADE',
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addConstraint('order_items', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'order_item',
      references: {
        table: 'orders',
        field: 'id'
      },
      onDelete: 'CASCADE',
    })
  }
};
