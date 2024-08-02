import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ServiceJwt } from '../to-do-list/jwt.service';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
    jwtService: any;
    // transporter: any;
    // private readonly transporter;
    constructor(@InjectEntityManager() private readonly valueget: EntityManager,
        private readonly Jwt: ServiceJwt
    ) { }
    //User registration
    async Register(data) {
        //  console.log(data.name)
        //  console.log(data.email)
        if (data.name == "" || data.name == undefined || data.name == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The name field can not be left empty"
            }, HttpStatus.BAD_REQUEST)
        }

        else if (data.email == "" || data.email == undefined || data.email == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The email field can not be left empty"

            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.password == "" || data.password == undefined || data.password == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The password field can not be left empty"

            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.mobile == "" || data.mobile == undefined || data.mobile == null) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The mobile number field can not be left empty"

            }, HttpStatus.BAD_REQUEST)
        }
        var checkuser = await this.valueget.query(`select * from employee where emp_email='${data.email}'`);
        //console.log(checkuser.length)
        if (checkuser.length != 0) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "User already registered"
            }, HttpStatus.BAD_REQUEST)
        }
        else {
            var saltOrRounds = 10;
            var password = data.password;
            var hashpassword = await bcrypt.hash(password, saltOrRounds);
            var query = `insert into employee(emp_name,emp_email,emp_mobile,emp_password) values('${data.name}','${data.email}','${data.mobile}','${hashpassword}')`;
            var q = await this.valueget.query(query);
            console.log(q.affectedRows)
            if (q.affectedRows != 0) {
                throw new HttpException({
                    status: "success",
                    statuscode: HttpStatus.OK,
                    message: "Register successfully"
                }, HttpStatus.OK)
            }
            else {
                throw new HttpException({
                    status: "error",
                    statuscode: HttpStatus.BAD_REQUEST,
                    message: "Not Register"
                }, HttpStatus.BAD_REQUEST)
            }
        }
    }

    // user verify for Login 
    async verifyuserlogin(data) {
        if (data.email == "" || data.email == null || data.email == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The Email field can not be left empty"
            }, HttpStatus.BAD_REQUEST)
        }
        else if (data.password == "" || data.password == null || data.password == undefined) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "The password field can not be left empty"
            }, HttpStatus.BAD_REQUEST)
        }
        var query = await this.valueget.query(`select * from employee where emp_email='${data.email}'`);
        //  console.log(query[0].emp_name)
        if (query.length == 0) {
            throw new HttpException({
                status: "error",
                statuscode: HttpStatus.BAD_REQUEST,
                message: "user does not exist"
            }, HttpStatus.BAD_REQUEST)
        }
        else {
            var Otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var query1 = await this.valueget.query(`update employee set emp_otp=${Otp} where emp_email='${data.email}'`);
            console.log(query)
            if (query1.changedRow == 0) {
                throw new HttpException({
                    status: "error",
                    statuscode: HttpStatus.BAD_REQUEST,
                    message: "OTP not updated"
                }, HttpStatus.BAD_REQUEST)
            }
            else {
                var hashpass = query[0].emp_password;
                var user = query[0];
                // console.log(user.emp_id)
                // console.log(user.emp_name)
                var pass = data.password;

                //console.log(query[0].emp_password)
                //  console.log(data.password)
                var isMatch = await bcrypt.compare(pass, hashpass);
                if (isMatch) {
                    //                     const mailOptions = {
                    //                         from: 'pandeyshubhi8081@gmail.com',
                    //                         to:'pandeyshubhi8081@gmail.com',
                    //                         subject:'OTP verification',
                    //                         text:'verify OTP',
                    //                       };
                    // try {
                    //       await this.transporter.sendMail(mailOptions);
                    //       console.log('Email sent successfully ');
                    //     } catch (error) {
                    //       console.error('Error sending email');
                    //     }          
                    const payload = { id: user.emp_id, name: user.emp_name, password: user.emp_password };
                    // console.log(this.jwtService)
                    //console.log(this.Jwt.generateToken(payload));
                    var access_token = await this.Jwt.sign(payload);
                    //console.log(access_token)
                    //console.log("password is correct")                  
                    throw new HttpException({
                        status: "success",
                        statuscode: HttpStatus.OK,
                        message: "user verify for login",
                        token: access_token
                    }, HttpStatus.OK)
                }
                else {
                    //throw new UnauthorizedException();
                    throw new HttpException({
                        status: "error",
                        statuscode: HttpStatus.BAD_REQUEST,
                        message: "Password is invalid"
                    }, HttpStatus.BAD_REQUEST)
                }
            }
        }
    }

    
    //Getuser profile
    async getprofile(req, data) {
        //console.log(req.id);
        // console.log(req.id)
        //console.log("valid user data")
        var getuserprofile = await this.valueget.query(`select * from employee where emp_id='${req.id}'`);
       // console.log(getuserprofile)
        if (getuserprofile.length !== 0) {
            // console.log("valid user")
            throw new HttpException({
                status: "success",
                statuscode: HttpStatus.OK,
                message: "Get user profile",
                data: getuserprofile[0]
            }, HttpStatus.OK)
        }
        else {
            throw new HttpException({
                status: "success",
                statuscode: HttpStatus.OK,
                message: "No record found ",
            }, HttpStatus.OK)
        }
    }


    //Forgot Password
    // async getotp(data) {
    //     if (data.username == "" || data.username == undefined || data.username == null) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "User name can not be left empty",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     var checkuser = await this.valueget.query(`select * from employee where emp_email='${data.username}'`);
    //     //    console.log(checkuser[0].emp_otp)
    //     if (checkuser.length != 0) {
    //         var Otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    //         var update_user_otp = await this.valueget.query(`update employee set emp_otp=${Otp} where emp_email='${data.username}'`);

    //         if (update_user_otp.affectedRows != 0) {
    //             var checkupdatedotp = await this.valueget.query(`select * from employee where emp_otp=${Otp}`);
    //             if (checkupdatedotp.length != 0) {
    //                 var getupdatedOTP = checkupdatedotp[0].emp_otp;
    //                 var saltOrRounds = 10;
    //                 var hashOTP = await bcrypt.hash(getupdatedOTP, saltOrRounds);
    //                 // console.log(hashOTP)
    //                 throw new HttpException({
    //                     status: "success",
    //                     statuscode: HttpStatus.OK,
    //                     message: "User OTP updated successfully!! ",
    //                     TOken: hashOTP
    //                 }, HttpStatus.OK)
    //             }
    //             //console.log(checkupdatedotp[0].emp_otp)
    //             //console.log(checkuser[0].emp_otp)
    //             // var saltOrRounds = 10;
    //             // var hashOTP = await bcrypt.hash(checkuser.emp_otp, saltOrRounds);
    //             // console.log(hashOTP)
    //             throw new HttpException({
    //                 status: "error",
    //                 statuscode: HttpStatus.BAD_REQUEST,
    //                 message: "OTP updated successfully",
    //                 // OTP:hashOTP
    //             }, HttpStatus.BAD_REQUEST)
    //         }
    //         else {
    //             throw new HttpException({
    //                 status: "error",
    //                 statuscode: HttpStatus.OK,
    //                 message: "OTP not updated",
    //             }, HttpStatus.OK)
    //         }
    //     }
    //     else {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "user does not exist",
    //         }, HttpStatus.BAD_REQUEST)
    //     }

    // }


    // async validateotp(data) {
    //     // var isMatch = await bcrypt.compare(pass, hashpass);
    //     var checkuser = await this.valueget.query(`select * from employee where emp_email='${data.username}'`);
    //     if (checkuser.length == 0) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "user does not exist",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     var usertoken = data.token;
    //     var storedotp = checkuser[0].emp_otp
    //     console.log(usertoken);
    //     console.log(storedotp);
    //     var isMatch = await bcrypt.compare(storedotp, usertoken); //Always mind,in database stored value first  argument and input value has second argument
    //     if (isMatch) {
    //         throw new HttpException({
    //             status: "success",
    //             statuscode: HttpStatus.OK,
    //             message: "Valid OTP",
    //         }, HttpStatus.OK)
    //     }
    //     else {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "Invalid OTP",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    // }




    // //Update user password
    // async updateuserpassword(data) {
    //     if (data.username == "" || data.username == undefined || data.username == null) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "User name can not be left empty",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     else if (data.password == "" || data.password == undefined || data.password == null) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "Password can not be left empty",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     else if (data.confirmpassword == "" || data.confirmpassword == undefined || data.confirmpassword == null) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "Confirm password can not be left empty",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     else if (data.password != data.confirmpassword) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "Password and confirm should be same",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     else if (data.token == "" || data.token == undefined || data.token == null) {
    //         throw new HttpException({
    //             status: "error",
    //             statuscode: HttpStatus.BAD_REQUEST,
    //             message: "token can not be left empty",
    //         }, HttpStatus.BAD_REQUEST)
    //     }
    //     else {
    //         var checkuser = await this.valueget.query(`select * from employee where emp_email='${data.username}'`);
    //         if (checkuser.length == 0) {
    //             throw new HttpException({
    //                 status: "error",
    //                 statuscode: HttpStatus.BAD_REQUEST,
    //                 message: "user does not exist",
    //             }, HttpStatus.BAD_REQUEST)
    //         }
    //         var ismatch = await bcrypt.compare(checkuser[0].emp_otp, data.token,)
    //         if (ismatch) {
    //             const hashedPassword = await bcrypt.hashSync(data.password, 10);
    //             var updatepassword = await this.valueget.query(`update employee set emp_password='${hashedPassword}' where emp_email='${data.username}'`);
    //             if (updatepassword.affectedRows != 0) {
    //                 throw new HttpException({
    //                     status: "successs",
    //                     statuscode: HttpStatus.OK,
    //                     message: "Password  updated successfully",
    //                 }, HttpStatus.OK)
    //             }

    //         }
    //         else {
    //             throw new HttpException({
    //                 status: "error",
    //                 statuscode: HttpStatus.BAD_REQUEST,
    //                 message: "Invalid Token",
    //             }, HttpStatus.BAD_REQUEST)
    //         }
    //     }
    // }

    async forgotpassword(data){
            
    }


async autogenOTP(data)
{

    
         

} 




}