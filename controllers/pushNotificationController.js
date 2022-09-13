const admin = require("firebase-admin");
const userModel = require("../model/user");

var serviceAccount = require("./radhika-jewellery-cd94b-firebase-adminsdk-1ujbc-7f60a67950.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Sending notification to users
exports.sendNotification = async (req, res) => {
  const { title, body } = req.body;
  const users = await userModel.find();
  let userTokens = [];
  users.map((user) => {
    if (user.fcmToken !== undefined) {
      const itemIndex = userTokens.findIndex(
        (token) => token === user.fcmToken
      );
      if (itemIndex < 0) {
        userTokens.push(user.fcmToken);
      }
    }
  });
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: userTokens,
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then((result) => {
      console.log("Send successfull");
      res.status(200).json({
        message: "Notification Sent Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
