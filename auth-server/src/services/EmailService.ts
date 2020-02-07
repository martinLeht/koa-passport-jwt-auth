import MailService from '@sendgrid/mail';
import { Inject } from 'typescript-ioc';
import { SENDGRID_API_KEY } from '../Config/Config';
import { type } from 'os';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { URL } from 'url';

export class EmailService {
    

    constructor() {
        MailService.setApiKey(SENDGRID_API_KEY);
    }

    /**
     * Send a email via sendgrid.
     * 
     * @param toEmail a valid email address
     * @param message a text/html as message body
     * @param subject a subject for the email
     * @param useHTML a true or false value for HTML useage in message body
     * @returns promise with success or error message
     */
    public async sendEmail(toEmail: string, message: string, subject: string, useHTML: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const emailMsg: MailData = this.composeEmailMsg(
                'hoods.admin@dev.com',
                'Hoods Admin',
                toEmail,
                message,
                subject,
                useHTML
            );
            MailService.send(emailMsg).then((sent) => {
                console.log("Successfully sent email!");
                resolve({ success: "Successfully sent to email: " + toEmail });
            }).catch(error => {
                console.log("ERROR: " + error);
                console.log(typeof(error));
                reject({ error: error })
            });
        });
    }

     /**
     * Send user email verification via sendgrid.
     * 
     * @param toEmail a valid email address
     * @param userId a valid userId
     * @returns promise with success or error message
     */
    public async sendEmailVerification(toEmail: string, activationToken: string, userId: number) {
        return new Promise<any>((resolve, reject) => {

            const activationUrl = new URL('http://localhost:3000/users/' + userId + '/verify?activationToken=' + activationToken);
            const message = "<html><body>" +
                            "<h4>Activate your user account by clicking the link below:</h4><br>" +
                            "<a href='" + activationUrl.toString() + "'>Verify and activate user account</a>" +
                            "</body></html>";

            const emailMsg: MailData = this.composeEmailMsg(
                'hoods.admin@dev.com',
                'Hoods Admin',
                toEmail,
                message,
                'Hoods Email verification',
                true
            );
            MailService.send(emailMsg).then((sent) => {
                console.log("Successfully sent verification token to user email!");
                resolve({ success: "Successfully sent verification token to user email!" });
            }).catch(error => {
                console.log("ERROR: " + error);
                console.log(typeof(error));
                reject({ error: error })
            });
        });
        
    }

    /**
     * Send email via sendgrid.
     * 
     * @param message a valid sendgird MailData object
     * @returns promise with success or error message
     */
    public async sendEmailWithReadyData(message: MailData): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            MailService.send(message).then((sent) => {
                console.log("Successfully sent email!");
                resolve( { success: "Successfully sent email to " + message.to });
            }).catch(error => {
                console.log("ERROR: " + error);
                reject({ error: error })
            });
        });
    }


    private composeEmailMsg(fromEmail: string, fromName: string, toEmail: string, message: string, subject: string, useHTML: boolean): MailData {
        let emailMessage: MailData;
        if (useHTML) {
            emailMessage = {
                to: toEmail,
                from: { 
                    email: fromEmail,
                    name: fromName
                }, 
                html: message,
                subject: subject 
            };
        } else {
            emailMessage = {
                to: toEmail,
                from: { 
                    email: fromEmail,
                name: fromName
                }, 
                text: message,
                subject: subject 
            };
        }
        
        return emailMessage;
    }
    
}