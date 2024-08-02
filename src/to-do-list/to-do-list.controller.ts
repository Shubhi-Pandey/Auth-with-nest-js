import { Body, Controller, Get,Request , Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editfilename } from './config/multer';
import { JwtAuthGuard } from './jwt-auth.guard';
import { get, request } from 'http';



@Controller('to-do-list')
export class ToDoListController {
    constructor(
        private readonly ToDoListService:ToDoListService
        )
        {}

 @Post("/createTodo")
  createtodo(@Body() data:any):any{
            return this.ToDoListService.createtodo(data)
    }

@Get("/GetTodoAll")
getToDO(@Query() data:any):any{
    return this.ToDoListService.getToDO(data)
}

@Get("/GetTodoById")
getToDObyId(@Query() data:any):any{
    return this.ToDoListService.getToDObyId(data) 
    
}

@Post("/updateToDoList")
    updateToDO(@Body() data:any):any{
return this.ToDoListService.updateToDO(data)
    
}
@Post("/deleteToDoList")
deletetodo(@Query() data:any):any{
return this.ToDoListService.deletetodo(data)   
}


// @Post('upload')
// @UseInterceptors(FileInterceptor('file'))
// uploadFile(@UploadedFile() file: Express.Multer.File) {
//   console.log(file);
// }


@Post("/upload")
@UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fileupload', maxCount: 5 },
        { name: 'fileupload1', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: editfilename ,
        }),
        // fileFilter: imageFileFilter,
      }
    )
  )
uploadfiles(@UploadedFiles() files: { fileupload?: Express.Multer.File[],fileupload1?: Express.Multer.File[]}){
    //return this.ToDoListService.uploadfiles(files);
   // console.log(file)
return this.ToDoListService.uploadfiles(files);
}


// @UseGuards(JwtAuthGuard)
@Post("/checktoken")
tokencheck(@Body() data:any):any
{
return this.ToDoListService.tokencheck(data)
}


 @UseGuards(JwtAuthGuard)
@Get("/getprofileuser")
gettodo(@Request() req:any ,@Query() data:any):any{
  return this.ToDoListService.gettodo(req.user,data)
}
   
}
