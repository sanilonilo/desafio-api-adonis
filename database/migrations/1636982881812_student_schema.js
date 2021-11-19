'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentSchema extends Schema {
  up () {
    this.create('students', (table) => {
      table.increments()
      table.string('avatar')
      table.string('name').notNullable()
      table.string('birth_date').notNullable()
      table.string('school_year')
      table.string('sex').notNullable()
      table.string('kinship').notNullable()
      table.string('plus_criterion')
      table.integer('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('students')
  }
}

module.exports = StudentSchema
