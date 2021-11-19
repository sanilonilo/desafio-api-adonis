'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Student = use('App/Models/Student')
const Database = use('Database')
const Helpers = use('Helpers')
const fs = require('fs')

/**
 * Resourceful controller for interacting with students
 */
class StudentController {
  /**
   * Show a list of all students.
   * GET students
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response,params }) {
    try{
      const status = request.get().status 

      if(status){//Se a url conter a query status, faça a consulta com base neste
        
        const students = await Database.table('students').where('status',status)
                                      
        return students                             
      }

      else{
        const students = await Student.all()
        
        return students
      }
    }
    catch(e){
      return response.status(500).send('Error')
    }
  }

  /**
   * 
   * 
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async upload({request,response,params}){
    try{
      const student = await Student.findOrFail(params.id)

      if(student.avatar){//Caso já exista um avatar , exclua o arquivo anterior
        const removeFile = Helpers.promisify(fs.unlink)
        const path = Helpers.tmpPath('uploads')+'\\'+student.avatar
        
        await removeFile(path)
      }
      
      const file = request.file('file',{
        types:['image'],
        size:'1mb'
      })
      

      const fileName = `${Date.now()}.${file.subtype}`//Renomeando o arquivo

      await file.move(Helpers.tmpPath('uploads'),{
        name:fileName
      })

      if(!file.moved()){
        return file.error()
      }

      student.avatar = fileName//Setando o avatar para salvar no banco

      await student.save()

      return response.status(200).send('Upload success')
      
    }

    catch(e){
      return response.status(500).send('Error')
    }
  }



  

  /**
   * Create/save a new student.
   * POST students
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  //request.file('files').subtype
  async store ({ request, response }) {
    try{
      const data = request.only(['name','birth_date','school_year','sex','kinship','plus_criterion'])
      const student = await Student.create({...data,status:1,avatar:null})

      return student
    }

    catch(e){
      return response.status(500).send('Error')
    }

  }

  /**
   * Display a single student.
   * GET students/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response}) {
    try{
      const student = await Student.findOrFail(params.id)
      return student
    }

    catch(e){
      return response.status(500).send('Error')
    }
  }

  

  /**
   * Update student details.
   * PUT or PATCH students/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try{
      const data = request.only(['name','birth_date','school_year','sex','kinship','plus_criterion'])
      const student = await Student.findOrFail(params.id)

      student.name = data.name
      student.birth_date = data.birth_date
      student.school_year = data.school_year
      student.sex = data.sex
      student.kinship = data.kinship
      student.plus_criterion = data.plus_criterion

      await student.save()

      return student
    }

    catch(e){
      return response.status(500).send('Error')
    }
  }

  /**
   * Delete a student with id.
   * DELETE students/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try{
      const student = await Student.findOrFail(params.id)

      if(student.avatar){
        const removeFile = Helpers.promisify(fs.unlink)
        const path = Helpers.tmpPath('uploads')+'\\'+student.avatar
        
        await removeFile(path)
      }

      await student.delete()

      return response.status(200).send('Deleted user')
    }

    catch(e){
      return response.status(500).send('Error')
    }
    
  }
}

module.exports = StudentController
