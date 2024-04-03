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

    // Log the entire document data to verify its contents
    console.log("Document data:", docSnapshot.data());

    // Extract friends array from user document
    const friendsArray = docSnapshot.data().friends || docSnapshot.get("friends") || [];
    console.log("YEEEEEHAW");



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

// Create a new post for the adding friend function
app.post("/add-friend", async (req, res) => {
  // Get data from the front end
  const { userID, userEmail } = req.body;

  try {

    console.log(userID, userEmail);

    // Reference to the 'Users' collection
    const users = db.collection("Users");

    // Retrieve the document of the initial user
    const initialUserDoc = await users.doc(userID).get();

    // Get the current friends list of the initial user
    const initialUserFriends = initialUserDoc.data().friends || [];

    // Check if the friend already exists in the initial user's friends list
    if (initialUserFriends.some(friend => friend.friendEmail === userEmail)) {
      return res.status(400).send({ "message": "Friend already exists in the friend list" });
    }

    // Query the collection to find the document with the provided email
    const userSnapshot = await users.where("email", "==", userEmail).get();

    // Check if a user with the provided email exists
    if (userSnapshot.empty) {
      // User not found, handle accordingly
      return res.status(404).send("User not found");
    }

    // Assuming there's only one document with a given email (unique emails)
    const userDoc = userSnapshot.docs[0];

    // Get the user's ID
    const friendUserId = userDoc.id;

    // Add the friend's ID and email to the initial user's friends list
    if (!initialUserFriends.includes(friendUserId)) {
      initialUserFriends.push({ "friendUserId": friendUserId, "friendEmail": userEmail });

      // Add the initial user's ID and email to the provided user's friends list
      const userFriends = userDoc.data().friends || [];
      if (!userFriends.some(friend => friend.friendUserId === userID)) {
        userFriends.push({ "friendUserId": userID, "friendEmail": initialUserDoc.data().email });

        // Update the provided user's document with the modified friends list
        await userDoc.ref.update({ friends: userFriends });
      }


      // Update the initial user's document with the modified friends list
      await initialUserDoc.ref.update({ friends: initialUserFriends });
    } else {
      return res.status(400).send({ "message": "User is already in the friend list" });
    }

    res.status(200).send({ "message": "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).send("Internal server error");
  }
});

// Step 5: Start your server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
