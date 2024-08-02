import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DateTimeDto } from './date-time.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ServiceJwt } from './jwt.service';
import * as jwt from 'jsonwebtoken';

import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { request } from 'https';


@Injectable()

export class ToDoListService {
    //jwtService: any;
    constructor(@InjectEntityManager() private readonly valueget: EntityManager,
    private readonly jwtService: ServiceJwt
    ) { }
    
    //Create To do list
    async createtodo(data) {
      
        if (data.title == "" || data.title == undefined || data.title == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "title should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.description == "" || data.description == null || data.description == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "description should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
    

        else if (data.due_date == "" || data.due_date == null || data.due_date == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "date should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }

        else if (data.completedStatus == "" || data.completedStatus == null || data.completedStatus == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "Status should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }


        else {
            var checktitle = await this.valueget.query(`select * from todolist where todo_title='${data.title}'`);
            if (checktitle.length != 0) {
                throw new HttpException({
                    statuscode: HttpStatus.BAD_REQUEST,
                    message: " this To-Do is already added"
                }, HttpStatus.BAD_REQUEST)
            }
            else {
                var query = await this.valueget.query(`insert into todolist(todo_title,todo_description,todo_duedate) values('${data.title}','${data.description}','${data.due_date}')`);
                if (query.affectedRows != 0) {
                    throw new HttpException({
                        statuscode: HttpStatus.OK,
                        message: "To-Do added successfully"
                    }, HttpStatus.OK)
                }
                else {
                    throw new HttpException({
                        statuscode: HttpStatus.BAD_REQUEST,
                        message: "To-do list added failed!!"
                    }, HttpStatus.BAD_REQUEST)
                }
            }
        }
    }

    //Get To do all list 
    async getToDO(data) {
        if (data.todo_limit == "" || data.todo_limit == null || data.todo_limit == undefined) {
            data.todo_limit = 10;
        }
        //console.log(data.Id)
        var getquery = await this.valueget.query(`select * from todolist limit ${data.todo_limit}`);
        if (getquery.length != 0) {
            throw new HttpException({
                statuscode: HttpStatus.OK,
                message: "Get Todos Successfully!",
                data: getquery
            }, HttpStatus.OK)
        }
        else {
            throw new HttpException({
                statuscode: HttpStatus.OK,
                message: "No To-do list is available!!",
                data: getquery
            }, HttpStatus.OK)
        }
    }

    //Get To do list using Id
    async getToDObyId(data) {
//console.log(data)
        if (data.Id == "" || data.Id == undefined || data.Id == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "Id should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        var getbyIdQuery = await this.valueget.query(`select * from todolist where id=${data.Id}`);
        if (getbyIdQuery.length != 0) {
            throw new HttpException({
                statuscode: HttpStatus.OK,
                message: `Get Todo successfully `,
                data: {
                    "TITLE": getbyIdQuery[0].todo_title,
                    "DESCRIPTION":getbyIdQuery[0].todo_description,
                    "ALL_DATA": getbyIdQuery[0]
                }
            }, HttpStatus.OK)
        }
        else {
            throw new HttpException({
                statuscode: HttpStatus.BAD_REQUEST,
                message: "To-do list is unavailable!!",
                data: getbyIdQuery[0]
            }, HttpStatus.BAD_REQUEST)
        }
    }


    //Update To do list
    async updateToDO(data) {
        if (data.Id == "" || data.Id == undefined || data.Id == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "Id should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.title == "" || data.title == undefined || data.title == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "title should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.description == "" || data.description == null || data.description == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "description should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.date == "" || data.date == null || data.date == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "date should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }

        else if (data.completedStatus == "" || data.completedStatus == null || data.completedStatus == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "status should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }


        var checkuser = await this.valueget.query(`select * from todolist where id=${data.Id}`);
        if (checkuser.length == 0) {
            throw new HttpException({
                statuscode: HttpStatus.BAD_REQUEST,
                message: "user not exist",
            }, HttpStatus.BAD_REQUEST)
        }
        else {
            var updatetodo = await this.valueget.query(`update todolist set  todo_title='${data.title}' ,todo_description='${data.description}',todo_duedate='${data.date}',completed_status='${data.completedStatus}' where id=${data.Id}`);
            if (updatetodo.affectedRows != 0) {
                throw new HttpException({
                    statuscode: HttpStatus.OK,
                    message: "To do list updated",
                }, HttpStatus.OK)
            }
            else {
                throw new HttpException({
                    statuscode: HttpStatus.BAD_REQUEST,
                    message: "To do list not updated",
                }, HttpStatus.BAD_REQUEST)
            }
        }
    }


    //Delete TO do list
    async deletetodo(data) {
        if (data.Id == "" || data.Id == undefined || data.Id == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "Id should be valid or not blank"
            }, HttpStatus.BAD_REQUEST)
        }
        var checkuser = await this.valueget.query(`select * from todolist where id=${data.Id}`);
        var check_status=await this.valueget.query(`select * from todolist where completed_status='False'`);
        if (checkuser.length == 0) {
            throw new HttpException({
                statuscode: HttpStatus.BAD_REQUEST,
                message: "to do not exist",
            }, HttpStatus.BAD_REQUEST)
        }
        if (check_status.length != 0) {
            throw new HttpException({
                statuscode: HttpStatus.BAD_REQUEST,
                message: "to do status already false ",
            }, HttpStatus.BAD_REQUEST)
        }
     
        else {
            var deletetodo = await this.valueget.query(`update todolist set completed_status='False' where id=${data.Id}`);
            if (deletetodo.affectedRows != 0) {
                throw new HttpException({
                    statuscode: HttpStatus.OK,
                    message: "To do list deleted",
                }, HttpStatus.OK)
            }
            else {
                throw new HttpException({
                    statuscode: HttpStatus.BAD_REQUEST,
                    message: "not deleted",
                }, HttpStatus.BAD_REQUEST)
            }
        }
    }

// async  uploadFile(@UploadedFile() file){
//     if (!file) {
//         return { message: 'No file uploaded' };
//       }
//       // Define the directory where you want to save the uploaded file
//       const uploadDirectory = './uploads';
  
//       // Create the directory if it doesn't exist
//       if (!fs.existsSync(uploadDirectory)) {
//         fs.mkdirSync(uploadDirectory, { recursive: true });
//       }
  
//       // Generate a new filename with your desired extension (e.g., '.jpg')
//       const newFileName = `${file.originalname.split('.')[0]}.jpg`;
  
//       // Define the full path to save the file with the new filename and extension
//       const filePath = path.join(uploadDirectory, newFileName);
  
//       // Write the file to the defined path
//       fs.writeFileSync(filePath, file.buffer);
  
//       return { message: 'File uploaded and stored successfully' };
//       // Check if the file's buffer is defined
// //       if (buffer === undefined) {
// //         return { message: 'Uploaded file is empty or undefined'};
// //       }
// //   else{
// //     console.log("not uploaded");
// //   }
//     //   // Define the directory where you want to save the binary file
//     //   const uploadDirectory = './uploads';
//     //   // Create the directory if it doesn't exist
//     //   if (!fs.existsSync(uploadDirectory)) {
//     //     fs.mkdirSync(uploadDirectory);
//     //   }
//     //   // Define the full path to save the file
//     //   const filePath = path.join(uploadDirectory, file.originalname);
  
//     //   try {
//     //     // Write the file to the defined path
//     //     fs.writeFileSync(filePath, file.buffer);
  
//     //     return { message: 'File uploaded and stored successfully', file };
//     //   } catch (error) {
//     //     return { message: 'Error saving the file', error: error.message };
//     //   }
//     }

    async uploadfiles(files){
    var fileuploading1= files?.fileupload[0]?.filename;
    var fileuploading2=files?.fileupload[0]?.filename;
    //  var imagefile=files.filename;
    //  console.log(imagefile);
       var uploadquery=await this.valueget.query(`insert into todolist(image1,image2) values('${fileuploading1}','${fileuploading2}')`);
       if(uploadquery.affectedRows!=0){
        console.log("uploaded successfully");
       }
       else{
        console.log("not uploaded")
       }
    }

async tokencheck(data){
    console.log(data.name)
    var query = await this.valueget.query(`select * from employee where emp_email='${data.email}'`);
    var user =query[0];
    //console.log(query[0])
    const payload = { name:user.emp_name ,id:user.emp_id,email:user.emp_email};
    console.log(payload)
     const token = this.jwtService.sign(payload);
    // return { access_token: token };
    //console.log(token)
    return token;
}


async gettodo(req,data){
    var name='jhhj'
    console.log(req);
    var emp=req.id;
    console.log(emp)
//var empEmail=req.email;
console.log(req.email)
   console.log(emp)
       var getuserprofile=await this.valueget.query(`select * from employee where emp_email='${req.email}'`);
       if(getuserprofile.length!==0){
        // console.log("valid user")
        throw new HttpException({
            status:"success",
            statuscode: HttpStatus.OK,
            message: "Get do to list!!",
            data: getuserprofile[0]
        }, HttpStatus.OK)
       }
       else{
        console.log("invalid")
       }
}
}