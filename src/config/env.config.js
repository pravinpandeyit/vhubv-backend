const dotenv = require('dotenv');
dotenv.config();
if (process.env.DATABASE_ENV == 'local') {
    var databaseHost = process.env.LOCAL_DATABASE_HOST;
    var databaseUser = process.env.LOCAL_DATABASE_USER;
    var databasePass = process.env.LOCAL_DATABASE_PASS;
    var databaseName = process.env.LOCAL_DATABASE_NAME;
    var databasePort = process.env.LOCAL_DATABASE_PORT;
    var databaseSchema = process.env.LOCAL_DATABASE_NAME;
} else if (process.env.DATABASE_ENV == 'live') {
    var databaseHost = process.env.DATABASE_HOST;
    var databaseUser = process.env.DATABASE_USER;
    var databasePass = process.env.DATABASE_PASS;
    var databaseName = process.env.DATABASE_NAME;
    var databasePort = process.env.LOCAL_DATABASE_PORT;
    var databaseSchema = process.env.LOCAL_DATABASE_NAME;
}
module.exports = {
    //============Node Environment============
    nodeEnv: process.env.NODE_ENV,
    //============JWT Details ============
    JwtExpireTime: process.env.JWT_EXPIRE_TIME * 30,
    JwtSecretKey: process.env.JWT_SECRET_KEY,
    //============Server port============
    port: process.env.PORT,
    //============Database Details============
    databaseMigration: process.env.DATABASE_MIGRATION,
    databaseHost: databaseHost,
    databaseUser: databaseUser,
    databasePass: databasePass,
    databaseName: databaseName,
    databasePort:databasePort,
    databaseSchema:databaseSchema,
    //============Mail Details============
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    fromMail: process.env.FROM_MAIL,
    fromName: process.env.FROM_NAME,
    SECRET_JWT: process.env.SECRET_JWT || "",

    // mobile sms ctrediential
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

    //base url
    BASE_URL: process.env.BASE_URL || '/api/v1',
    // currency and date time default
    CURRENCY_SYMBOL: process.env.CURRENCY_SYMBOL || '$',
    CUSTOM_FORMAT: process.env.DEFAULT_DATETIME_FORMAT,
    DATE_FORMAT: process.env.DEFAULT_DATE_FORMAT,
    TIME_FORMAT: process.env.TIME_FORMAT,
    DEFAULT_PAGE: process.env.DEFAULT_PAGE || 1,
    DEFAULT_LIMIT: process.env.DEFAULT_LIMIT || 10,

    // S3 details
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,

    //paypal details
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,

    
    // fcm detail
    FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,

    MULTIPLE_FILE_SIZE_LIMIT: process.env.MULTIPLE_FILE_SIZE_LIMIT || 5,
    SINGLE_FILE_SIZE_LIMIT: process.env.SINGLE_FILE_SIZE_LIMIT || 1,
    UNLOCK_REQUEST_PRICE: process.env.UNLOCK_REQUEST_PRICE || 20.00,
    DOMAIN_URL: process.env.DOMAIN_URL,

    // contact us detail
    CONTACT_PHONE: process.env.CONTACT_PHONE || '000-000-0000',
    CONTACT_ADDRESS: process.env.CONTACT_ADDRESS || '130 West 42nd Street,2nd Floor,New Yark,NY10036',
    CONTACT_EMAIL:process.env.DEFAULT_SITE_EMAIL
};
