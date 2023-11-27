'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('Airports', {
      fields: ['cityId'],
      type: 'foreign key',
      name: 'city_fkey_constraint',
      references: { //Required field
        table: 'Cities',
        field: 'id'
      },
      onDelete: 'cascade',
      //onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Airports', 'city_fkey_constraint');
  }
};

/**
 * Query to check if constraint has been applied
 * select * from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'airports' 
 * AND CONSTRAINT_SCHEMA = 'flights';
 */
