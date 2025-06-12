const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const FROM_EMAIL = process.env.MAILER_FROM_EMAIL;
const SITE_NAME = process.env.SITE_NAME;
const WEB_URL = process.env.WEB_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const DOMAIN_URL = process.env.DOMAIN_URL
const DEFAULT_SITE_EMAIL = process.env.DEFAULT_SITE_EMAIL
const DEFAULT_SITE_PHONE = process.env.CONTACT_PHONE
const AWS_BUCKET_URL = process.env.AWS_BUCKET_URL

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

let transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
});


module.exports = {
    /*Forgot Password Email*/
    sendForgotPasswordEmail: (formdata) => {
        readHTMLFile(__dirname + '/../../public/email_template/reset_password.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                SITE_URL: WEB_URL,
                SITE_NAME: SITE_NAME,
                SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                USERNAME: formdata.firstName,
                OTP: formdata.otp,
                PASSWORDLINK: WEB_URL + "/password/otp",
                DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                CURRENT_YEAR: new Date().getFullYear(),
            };
            var htmlToSend = template(replacements);
            const message = {
                from: FROM_EMAIL,
                to: formdata.email,
                subject: 'Reset Password | ' + SITE_NAME,
                html: htmlToSend
            };
            transport.sendMail(message, function (err, info) {
                console.log("MAIL info:- " + JSON.stringify(err));
                console.log("MAIL info:- " + JSON.stringify(info));
                return true;
            });
        });
    },

    /*Otp Email*/
    sendOtpEmail: (formdata) => {
        readHTMLFile(__dirname + '/../../public/temp/otp.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                SITE_URL: WEB_URL,
                SITE_NAME: SITE_NAME,
                SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                USERNAME: formdata.fullname || 'User',
                OTP: formdata.otp,
                EMAIL: formdata.email,
                PASSWORDLINK: WEB_URL + "/password/otp",
                DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                CURRENT_YEAR: new Date().getFullYear(),
            };

            var htmlToSend = template(replacements);
            const message = {
                from: FROM_EMAIL,
                to: formdata.email,
                subject: 'OTP | ' + SITE_NAME,
                html: htmlToSend
            };
            transport.sendMail(message, function (err, info) {
                console.log("MAIL info:- " + JSON.stringify(err));
                console.log("MAIL info:- " + JSON.stringify(info));
                return true;
            });
        });
    },

    /* User Activation Email */
    sendUserActivationEmail: (formdata) => {
        readHTMLFile(__dirname + '/../../public/temp/user_activation.html', function (err, html) {
            if (err) {
                console.log("Error reading HTML file:", err);
                return;
            }

            var template = handlebars.compile(html);
            var replacements = {
                SITE_URL: WEB_URL,
                SITE_NAME: SITE_NAME,
                SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                USERNAME: formdata.firstName,
                DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                CURRENT_YEAR: new Date().getFullYear(),
            };

            console.log(replacements);

            var htmlToSend = template(replacements);
            const message = {
                from: FROM_EMAIL,
                to: formdata.email,
                subject: 'Your Account has been Activated | ' + SITE_NAME,
                html: htmlToSend
            };

            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log("Error sending email:", err);
                } else {
                    console.log("Email sent successfully:", info);
                }
            });
        });
    },

    /* Send Newsletter Email */
    sendNewsletterEmail: (emailData) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/newsletter_email.html', (err, html) => {
                if (err) {
                    console.error("Error reading HTML file:", err);
                    return reject(err);
                }

                const template = handlebars.compile(html);
                const replacements = {
                    NAME: emailData.name,
                    BODY_TEXT: emailData.bodyText,
                    SITE_URL: WEB_URL,
                    CURRENT_YEAR: new Date().getFullYear(),
                    SITE_NAME: SITE_NAME,

                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                };
                console.log('replacements',replacements);
                
                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: emailData.email,
                    subject: emailData.subject,
                    html: htmlToSend
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending email to ${emailData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Email sent successfully to ${emailData.email}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Contact Email */
    sendContactEmail: (contactData) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/contact_email.html', (err, html) => {
                if (err) {
                    console.error("Error reading HTML file:", err);
                    return reject(err);
                }
                const template = handlebars.compile(html);
                const replacements = {
                    NAME: contactData.name,
                    EMAIL: contactData.email,
                    PHONE: contactData.phone,
                    MESSAGE: contactData.message,
                    SITE_URL: WEB_URL,
                    SITE_NAME: SITE_NAME,
                    CURRENT_YEAR: new Date().getFullYear(),
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png'
                };
                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: contactData.email,
                    subject: 'New Contact Request | ' + SITE_NAME,
                    html: htmlToSend
                };
                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending email to ${contactData.toEmail}:`, err);
                        return reject(err);
                    }
                    console.log(`Contact email sent successfully to ${contactData.toEmail}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Provider Approval Email */
    sendProviderApprovalEmail: (providerData) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/provider_approval.html', (err, html) => {
                if (err) {
                    console.error("Error reading HTML file:", err);
                    return reject(err);
                }
                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);
                const replacements = {
                    SITE_NAME: SITE_NAME,
                    SITE_URL: WEB_URL,
                    PROVIDER_NAME: `${providerData.firstName}`,
                    PROVIDER_EMAIL: providerData.email,
                    APPROVAL_DATE: new Date().toLocaleDateString(),
                    ADMIN_EMAIL: ADMIN_EMAIL,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                    CURRENT_YEAR: currentYear,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    USER_TYPE: providerData.usertype
                };

                const htmlToSend = template(replacements);

                const message = {
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL,
                    subject: `Action Needed: New ${providerData.usertype} Registration Approval | ${SITE_NAME}`,
                    html: htmlToSend
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending email to ${providerData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Provider approval email sent successfully to ${providerData.email}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Payment Notification Email */
    sendPaymentNotificationEmail: (providerData, paymentData) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/payment_notification.html', (err, html) => {
                if (err) {
                    console.error("Error reading HTML file:", err);
                    return reject(err);
                }

                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);

                const replacements = {
                    SITE_NAME: SITE_NAME,
                    PROVIDER_NAME: `${providerData.firstName}`,
                    PROVIDER_EMAIL: providerData.email,
                    PAYMENT_PLAN: paymentData.planName,
                    PAYMENT_AMOUNT: `$${paymentData.amount.toFixed(2)}`,
                    PAYMENT_DATE: new Date(paymentData.date).toLocaleDateString(),
                    TRANSACTION_ID: paymentData.transactionId,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    ADMIN_EMAIL: ADMIN_EMAIL,
                    CURRENT_YEAR: currentYear,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png'
                };

                const htmlToSend = template(replacements);

                const message = {
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL,
                    subject: `Payment Notification | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending payment notification email to ${ADMIN_EMAIL}:`, err);
                        return reject(err);
                    }
                    console.log(`Payment notification email sent successfully to ${ADMIN_EMAIL}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Subscription email */
    sendSubscriptionEmail: (providerData, planDetails) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/subscription_confirmation.html', (err, html) => {
                if (err) {
                    console.error("Error reading email template:", err);
                    return reject(err);
                }

                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);

                const replacements = {
                    SITE_NAME: SITE_NAME,
                    USER_NAME: providerData.firstName,
                    USER_EMAIL: providerData.email,
                    PLAN_NAME: planDetails.planName,
                    PLAN_PRICE: `$${planDetails.price.toFixed(2)}`,
                    PLAN_TYPE: planDetails.plan_type,
                    FREE_TRIAL_DAYS: planDetails.freeTrialDays ? `${planDetails.freeTrialDays} Days` : "N/A",
                    EXPIRY_DATE: planDetails.expiryDate,
                    TRANSACTION_ID: planDetails.transactionId,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    ADMIN_EMAIL: ADMIN_EMAIL,
                    CURRENT_YEAR: currentYear,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png'
                };
                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: providerData.email,
                    subject: `Subscription Confirmation | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending subscription email to ${providerData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Subscription email sent successfully to ${providerData.email}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Subscription Cancellation Email to Admin */
    sendSubscriptionCancellationEmailToAdmin: (providerData, planDetails) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/admin_subscription_cancellation.html', (err, html) => {
                if (err) {
                    console.error("Error reading email template:", err);
                    return reject(err);
                }
                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);
                const replacements = {
                    SITE_NAME: SITE_NAME,
                    PROVIDER_NAME: providerData.firstName,
                    PROVIDER_EMAIL: providerData.email,
                    PLAN_NAME: planDetails.planName,
                    PLAN_TYPE: planDetails.planType,
                    CANCEL_DATE: planDetails.date,
                    TRANSACTION_ID: planDetails.transactionId,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    CURRENT_YEAR: currentYear,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png'
                };

                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL, // Send to admin
                    subject: `Provider Cancelled Subscription | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending subscription cancellation email to admin (${ADMIN_EMAIL}):`, err);
                        return reject(err);
                    }
                    console.log(`Subscription cancellation email sent successfully to admin (${ADMIN_EMAIL}):`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Subscription Cancellation Email to User */
    sendSubscriptionCancellationEmailToUser: (providerData, planDetails) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/user_subscription_cancellation.html', (err, html) => {
                if (err) {
                    console.error("Error reading email template:", err);
                    return reject(err);
                }

                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);

                const replacements = {
                    SITE_NAME: SITE_NAME,
                    PROVIDER_NAME: providerData.firstName,
                    PROVIDER_EMAIL: providerData.email,
                    PLAN_NAME: planDetails.planName,
                    PLAN_TYPE: planDetails.planType,
                    CANCEL_DATE: planDetails.date,
                    TRANSACTION_ID: planDetails.transactionId,
                    CURRENT_YEAR: currentYear,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png'
                };

                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: providerData.email, // Send to user
                    subject: `Your Subscription Has Been Cancelled | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending subscription cancellation email to ${providerData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Subscription cancellation email sent successfully to ${providerData.email}:`, info);
                    resolve(info);
                });
            });
        });
    },

    /* Provider Status Email (Approved/Rejected) */
    sendProviderStatusEmail: (providerData, status) => {
        return new Promise((resolve, reject) => {
            const templateFile = status === "approved"
                ? "/../../public/temp/provider_approved.html"
                : "/../../public/temp/provider_rejected.html";

            readHTMLFile(__dirname + templateFile, (err, html) => {
                if (err) {
                    console.error("Error reading HTML file:", err);
                    return reject(err);
                }

                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);

                const replacements = {
                    SITE_NAME: SITE_NAME,
                    SITE_URL: WEB_URL,
                    PROVIDER_NAME: providerData.firstName,
                    PROVIDER_EMAIL: providerData.email,
                    STATUS: status === "approved" ? "Approved" : "Rejected",
                    MESSAGE: status === "approved"
                        ? "Congratulations! Your provider account has been approved. You can now log in and start offering your services."
                        : "We regret to inform you that your provider account has been rejected. If you have any concerns, please contact support.",
                    LOGIN_URL: DOMAIN_URL + "/sign-in",
                    SUPPORT_EMAIL: DEFAULT_SITE_EMAIL,
                    SITE_LOGO: AWS_BUCKET_URL + '/uploads/common/images/logo2.png',
                    CURRENT_YEAR: currentYear,
                    USER_TYPE_TEXT: providerData.userTypeText,
                    APPROVAL_DATE: new Date().toISOString().split("T")[0],
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                };


                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: providerData.email,
                    subject: `Your Provider Account is ${replacements.STATUS} | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending email to ${providerData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Provider status email sent successfully to ${providerData.email}:`, info);
                    resolve(info);
                });
            });
        });
    },

    sendJobExpirationEmail: (jobData, userData) => {
        return new Promise((resolve, reject) => {
            readHTMLFile(__dirname + '/../../public/temp/job_expired.html', (err, html) => {
                if (err) {
                    console.error("Error reading email template:", err);
                    return reject(err);
                }

                const currentYear = new Date().getFullYear();
                const template = handlebars.compile(html);
                console.log(jobData.expiry_date
                    ? new Date(jobData.expiry_date).toISOString().split("T")[0]
                    : "N/A");


                const replacements = {
                    SITE_NAME: SITE_NAME,
                    SITE_URL: WEB_URL,
                    USER_NAME: userData.fullname,
                    JOB_TITLE: jobData.title,
                    EXPIRY_DATE: jobData.expiry_date
                        ? new Date(jobData.expiry_date).toISOString().split("T")[0]
                        : "N/A",
                    LOGIN_URL: DOMAIN_URL + "/sign-in",
                    SUPPORT_EMAIL: DEFAULT_SITE_EMAIL,
                    SITE_LOGO: AWS_BUCKET_URL + "/uploads/common/images/logo2.png",
                    CURRENT_YEAR: currentYear,
                    DEFAULT_SITE_EMAIL: DEFAULT_SITE_EMAIL,
                    DEFAULT_SITE_PHONE: DEFAULT_SITE_PHONE,
                };

                const htmlToSend = template(replacements);
                const message = {
                    from: FROM_EMAIL,
                    to: userData.email,
                    subject: `Your Job Posting Has Expired | ${SITE_NAME}`,
                    html: htmlToSend,
                };

                transport.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(`Error sending job expiration email to ${userData.email}:`, err);
                        return reject(err);
                    }
                    console.log(`Job expiration email sent successfully to ${userData.email}:`, info);
                    resolve(info);
                });
            });
        });
    }


};

