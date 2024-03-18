// Step 4: Set up a basic server with Express.js
const express = require("express");
const app = express();
const port = 8001;
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// ---------------------------------- Initialize Firebase Admin SDK ----------------------------------
// You can replace the path with the path to your service account key file
const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// ----------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Create a new post
app.post("/create-post", async (req, res) => {
  // Get data from the front end
  const { userId, image, title } = req.body; // Assuming you're sending a title along with userId and image

  // Reference to the Firestore database
  const db = admin.firestore();

  // Reference to the 'Users' collection
  const users = db.collection("Users");

  // The document reference for the user
  const userDoc = users.doc(userId);

  // Create the post object to be added
  const newPost = {
    image,
    title,
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // Automatically generate a server-side timestamp
  };

  try {
    // Update the user's document by adding the new post to the posts array
    await userDoc.update({
      posts: admin.firestore.FieldValue.arrayUnion(newPost),
    });

    console.log("Post added to user", userId);
    res
      .status(201)
      .send({ message: "Post added successfully", userId: userId });
  } catch (error) {
    console.error("Error adding post to user:", error);
    // If the document does not exist, it means the user ID is invalid or not found
    if (error.code === 5) {
      // Firestore's error code for not found documents
      res.status(404).send("User not found");
    } else {
      res.status(500).send("Error adding post to user");
    }
  }
});

app.get("/fetch-posts", async (req, res) => {
  //get UserID
  const { userID } = req.body;

  //Reference the Firestore databse
  const db = admin.firestore();

  //Reference the 'Users' collection
  const users = db.collection("Users");

  //The document references the user
  const userDoc = users.doc(userID);

  try {
    if (!userDoc.exists) {
      console.log("Used document not found", userID);
      res.status(201).send({ message: "User not found", userID: userID });
    }

    //get all friends list, why might I use await
    const friends = (await userDoc.data().friends) || [];
    //array to store friends
    let allPosts = [];

    // Iterate through each friend
    for (let friendId of friends) {
      // Get the document for the friend
      const friendDoc = await db.collection("Users").doc(friendId).get();

      if (friendDoc.exists) {
        // Retrieve the posts array from the friend document
        const friendPosts = (await friendDoc.data().posts) || [];

        // Add the friend's posts to the allPosts array
        allPosts = allPosts.concat(friendPosts);
      } else {
        // if not work
        console.log(`Friend document for user ${friendId} does not exist`);
      }
    }
    res.status(201).send(allPosts);
  } catch (error) {
    console.error("Error adding post to user:", error);
    // If the document does not exist, it means the user ID is invalid or not found
    if (error.code === 5) {
      // Firestore's error code for not found documents
      res.status(404).send("User not found");
    } else {
      res.status(500).send("Error finding friends post");
    }
  }
});

// Step 5: Start your server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});