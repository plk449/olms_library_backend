import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from 'dotenv';

dotenv.config();

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILID,
        pass: process.env.PASS
    }
});

// Create Mailgen instance
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Library Name',
        link: 'https://mailgen.js/'
    }
});

// Function to send registration email
// const sendRegistrationEmail = async (email, fullName) => {
//     // Generate an email template
//     const Email = {
//         body: {
//             name: fullName,
//             intro: 'Welcome to our Library! We are excited to have you on board.',
//             action: {
//                 instructions: 'To get started with our service, please click the button below:',
//                 button: {
//                     color: '#22BC66',
//                     text: 'Confirm your email',
//                     link: 'Your confirmation link'
//                 }
//             },
//             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//         }
//     };

//     // Generate the email HTML from the template
//     const emailBody = mailGenerator.generate(Email);

//     // Define email options
//     const mailOptions = {
//         from: process.env.MAILID,
//         to: email,
//         subject: 'Welcome to Our Library!',
//         html: emailBody
//     };

//     try {
//         // Send the email
//         await transporter.sendMail(mailOptions);
//         console.log('Registration email sent successfully!');
//     } catch (error) {
//         console.error('Error sending registration email:', error);
//     }
// };

// Function to send borrow email
const sendBorrowEmail = async (email, bookTitle, borrowDate, fullName,Intro) => {
    const emailTemplate = {
        body: {
            name: fullName, // or user name if available
            intro:Intro ,
            table: {
                data: [
                    {
                        'Book Title': bookTitle,
                        'Borrow Date': borrowDate

                    }
                ],
                columns: {
                    // Optionally, customize the widths of columns
                    customWidth: {
                        'Book Title': '30%',
                        'Borrow Date': '35%'
                        // 'Return Date': '35%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        'Book Title': 'left',
                        'Borrow Date': 'center'
                        // 'Return Date': 'center'
                    }
                }
            },
            // action: {
            //     instructions: 'You can view your borrowed books and due dates by clicking the link below:',
            //     button: {
            //         color: '#22BC66',
            //         text: 'View My Borrowed Books',
            //         link: 'https://your-library-link.com/borrowed-books'
            //     }
            // },
            outro: 'If you have any questions, feel free to reply to this email.'
        }
    };

    const emailBody = mailGenerator.generate(emailTemplate);
    const mailOptions = {
        from: process.env.MAILID,
        to: email,
        subject: 'Book Transaction!',
        html: emailBody
    };

    await transporter.sendMail(mailOptions);
};


export {sendBorrowEmail}
    // sendBorrowEmail

