
import nodemailer from "nodemailer"
import { envVars } from "../config/envVars"
import path from "path"
import ejs from "ejs"
import AppError from "../ErrorHelpers/AppError"



const transporter = nodemailer.createTransport({
    secure: false,
    auth: {
        user: envVars.NODEMAILER.SMTP_USER,
        pass: envVars.NODEMAILER.SMTP_PASS
    },
    port: Number(envVars.NODEMAILER.SMTP_PORT),
    host: envVars.NODEMAILER.SMTP_HOST ,
   
    tls: { rejectUnauthorized: false }
    

})

interface  sendEmailOptions {
    to: string
    subject: string
    templateName: string
    templateData?: Record<string, any> 
    attachments?: {
        filename: string
        content: Buffer | string
        contentType: string
    } []
}

export const sendEmail = async ({to, subject,templateName,templateData,attachments}: sendEmailOptions)=>{
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.NODEMAILER.SMTP_FROM || envVars.NODEMAILER.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attach => ({
                filename: attach.filename,
                content: attach.content,
                contentType: attach.contentType
            }))
        })

        console.log("SMTP Config:", {
            host: envVars.NODEMAILER.SMTP_HOST,
            user: envVars.NODEMAILER.SMTP_USER,
            port: envVars.NODEMAILER.SMTP_PORT,
          });
         

        console.log(`/uFE0F email sent ${to}: ${info.messageId} `);

       
        
    } catch (error:any) {
        console.log("error", error);
        
        throw new AppError(500, error.message || "Error in send email");
    }
}

