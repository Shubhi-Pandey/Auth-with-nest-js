import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
 import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/to-do-list/jwt-auth.guard';


@Controller('auth')
export class AuthController {

       
    constructor(
        private readonly AuthService:AuthService
        )
        {}
   @ApiTags("User/Auth")
   @ApiBody({
       schema:{
              type:'object',
              properties:{
                     name:{
                            type: "string",
                            example:"shubhi",
                            description:"please enter your name"
                     },
                     email :{
                            type: "string",
                            example:"",
                            description:""
                     },
                     password :{
                            type: "string",
                            example:"",
                            description:""
                     },
                     mobile :{
                            type: "string",
                            example:"",
                            description:""
                     },
              },
              required : ['name', 'email', 'password', 'mobile']
       }
   })

   @ApiTags("user/register")
   @Post("/register")
   registeruser(@Body() data:any):any{
          return this.AuthService.Register(data)
   }

   @ApiTags("User / Auth")
   @ApiBody({
       schema:{
              type:"object",
              properties:{
              }
       }
   })
   @Post("/login")
   loginuser(@Body() data:any):any{
          return this.AuthService.verifyuserlogin(data)
   }
  
   @ApiTags("User / Auth")
   @ApiOperation({ 
       summary: 'Get User PROFILE',   
       description:'Use this api for user get PROFILE.'
     })
    @ApiResponse({
           status : 200,
           description : `{"status": "success","statusCode": 200,"message": "Success message."}`})
    @ApiResponse({
         status : 400,
         description : `{'status': 'error', 'statusCode': 400, 'message': 'error message'}`
     })
     @ApiResponse({
         status : 401,
         description : `{'status': 'error', 'statusCode': 401, 'message': 'error message'}`
     })
     @ApiResponse({
         status : 403,
         description : `{'status': 'error', 'statusCode': 403, 'message': 'Token is required!'}`
     })
     @ApiResponse({
         status : 500,
         description : `{'status': 'error', 'statusCode': 500, 'message': 'Internal server error'}`
     })


     @UseGuards(JwtAuthGuard)
   @Get("/profile")
   getProfile( @Request() req:any ,@Query() data:any):any {
     return this.AuthService.getprofile(req.user,data);
   }


// @Post("/get-otp")
// getotp(@Body() data:any):any{
//        return this.AuthService.getotp(data);
// }

// @Post("/validateuserotp")
// validateotp(@Body() data:any):any{
//        return this.AuthService.validateotp(data);
// }

// @Post("/updateuserpassword")
// updateuserpassword(@Body() data:any):any{
//        return this.AuthService.updateuserpassword(data);
// }

@Post()
forgotpassword(@Body() data:any):any{
       return this.AuthService.forgotpassword(data);
}

@Post("/genOTP")
autogenOTP(@Body() data:any):any{
       return this.AuthService.autogenOTP(data);
}

}
