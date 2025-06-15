// const admin = require('firebase-admin');
// const serviceAccount = require('../../fcmService/fcm.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// /**
//  * Send a single notification to a device.
//  * @param {object} fcmData - The notification data.
//  * @returns {Promise}
//  */
// const sendNotification = async (device_id, fcmData) => {
//     try {
//         if (!device_id) {
//             console.error("Error: Missing or invalid FCM token.");
//             return false;
//         }

//         const deviceToken = String(device_id).trim();
//         if (!deviceToken) {
//             console.error("Error: Invalid FCM token after trimming.");
//             return false;
//         }

//         const sanitizedData = {};
//         if (fcmData.data) {
//             Object.keys(fcmData.data).forEach((key) => {
//                 sanitizedData[key] = String(fcmData.data[key]);
//             });
//         }

//         const message = {
//             token: deviceToken,
//             notification: {
//                 title: fcmData.title || "No Title",
//                 body: fcmData.body || "No Body",
//             },
//             data: sanitizedData,
//         };

//         const response = await admin.messaging().send(message);
//         console.log("Notification sent successfully:", response);
//         return response;

//     } catch (error) {
//         if (error.errorInfo?.code === 'messaging/registration-token-not-registered') {
//             console.warn(`Invalid token detected: ${device_id}`);
//             // Optionally remove token from database
//         } else {
//             console.error("Error sending notification:", error);
//         }
//         return false;
//     }
// };


// /**
//  * Send a notification to multiple devices.
//  * @param {object} fcmData - The notification data.
//  * @returns {Promise}
//  */
// const sendMultipleNotification = async (fcmData) => {
//     console.log("FCM data received in send multiple notifications:", fcmData);

//     const message = {
//         tokens: fcmData.deviceIds, 
//         notification: {
//             title: fcmData.title ,
//             body: fcmData.bodyMsg ,
//         },
//         data: fcmData.data || {}, 
//     };

//     try {
//         const response = await admin.messaging().sendMulticast(message);
//         console.log("Notifications sent successfully:", response);
//         return response;
//     } catch (error) {
//         console.error("Error sending multiple notifications:", error);
//         return false;
//     }
// };

// module.exports = { sendNotification, sendMultipleNotification };
