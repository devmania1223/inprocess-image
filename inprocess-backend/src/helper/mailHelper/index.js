const nodemailer = require('nodemailer');

module.exports.emailHelper = async (data) => {
    const { email, token } = data;
    const mailTransporter = nodemailer.createTransport({     
        host:'smtp.gmail.com',
        service: 'gmail',  
        port: 465,
        secure: true,   
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const mailDetails = {
        from: process.env.EMAIL,
        to: email,
        subject: 'RegistrationMail',
        html: ` <body style="background:#fff; font-family:Verdana, Arial, 0, sans-serif; font-size:12px; margin:0; padding:0;">
        <div style="background:#fff; font-family:Verdana, Arial,sans-serif; font-size:12px; margin:0; padding:0;">
        <table cellspacing="0" cellpadding="0" border="0" height="100%" width="100%">
            <tr>
                <td align="center" valign="top" style="padding:20px 0 20px 0">
                    <!-- [ header starts here] -->
                    <table bgcolor="FFFFFF" cellspacing="0" cellpadding="10" border="0" width="600" >
                        <tr style="height: 130px;">
                            <td valign="top" style="text-align:center;padding-bottom:10px;padding-top: 10px;">
                                <a href=""><img src="https://mindpathtech.blob.core.windows.net/email-asset/logo.png" width="350" alt="Logo" Title="Logo" border="0"/></a>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">
                                <h2 style="font-size:16px;font-weight:normal; line-height:22px;margin:10px 0 11px 0;color:#2d3f5d;text-align: center;width: 560px;">Welcome to inProcess Time Entry. </h2>
                                <h3 style="font-size:16px;font-weight:normal; line-height:22px;margin:10px 0 20px 0;color:#2d3f5d;text-align: center;width: 630px;">Please <a href="${`${process.env.FRONT_END_BASE_URL}/email-verification/${token}`}" color="color:#fbaf00;">Click here</a> to confirm your account.</h3>
                               
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff" align="center" style="background:#fff;text-align:left;"><p style="font-size:14px;text-align:left;margin:0;padding-left: 146px;">Thank you, <strong></strong></p></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        </div>
        </body>`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email send successfully here');
        }
    });
};
