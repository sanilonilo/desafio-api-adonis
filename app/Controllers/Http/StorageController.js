'use strict'

const Helpers = use('Helpers')

class StorageController {
    async index({params,response}){
        
       return response.download(Helpers.tmpPath(`uploads/`+params.file))
        
    }
}

module.exports = StorageController
