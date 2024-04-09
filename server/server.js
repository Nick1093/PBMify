// Step 4: Set up a basic server with Express.js
const express = require("express");
const app = express();
const port = 8001;
const bodyParser = require("body-parser");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

// Use the cors middleware
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ---------------------------------- Initialize Firebase Admin SDK ----------------------------------
const admin = require("firebase-admin");

const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// ----------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/remove-post", async (req, res) => {
  // Get data from the front end
  const { userID, postID } = req.body; // Assuming you're sending a title along with userId and image
  console.log(userID, postID)

  // Reference to the 'Users' collection
  const users = db.collection("Users");

  // The document reference for the user
  const userDoc = users.doc(userID);

  try {
    // Get the user's document
    const userDocSnapshot = await userDoc.get();

    // Check if the document exists
    if (!userDocSnapshot.exists) {
      console.log("User not found");
      res.status(404).send("User not found");
      return;
    }

    // Get the posts array from the document
    let posts = userDocSnapshot.data().posts;

    // Filter out the post with the given postID
    posts = posts.filter((post) => post.postID !== postID);

    // Update the user's document by setting the posts array
    await userDoc.update({ posts });

    console.log("Post removed from user", userID);
    res
      .status(201)
      .send({ message: "Post removed successfully", userID: userID });
  } catch (error) {
    console.error("Error removing post from user:", error);
    res.status(500).send("Error removing post from user");
  }
});

// Create a new post for the adding friend function
app.post("/add-friend", async (req, res) => {
  // Get data from the front end
  const { userId, imageURL, title } = req.body; // Assuming you're sending a title along with userId and image

  // Reference to the 'Users' collection
  const users = db.collection("Users");

  // The document reference for the user
  const userDoc = users.doc(userId);

  // Create the post object to be added
  const newPost = {
    imageURL,
    title,
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // Automatically generate a server-side timestamp
    postID: uuidv4(), // generate UUID for the post
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

app.get("/my-posts", async (req, res) => {
  // Get the user ID from the query string
  const { userId } = req.query;
  console.log("userId:", userId);

  // Reference to the 'Users' collection
  const users = db.collection("Users");

  // The document reference for the user
  const userDoc = users.doc(userId);

  try {
    // Get the user document
    const doc = await userDoc.get();

    if (!doc.exists) {
      console.log("User document not found", userId);
      res.status(404).send({ message: "User not found", userId: userId });
    } else {
      // Get the posts array from the user document
      const posts = doc.data().posts || [];

      res.status(200).send({ userImages: posts });
    }
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).send("An error occurred");
  }
});


app.get("/fetch-posts", async (req, res) => {
  // get friends posts
  //get UserID
  const { userID } = req.query;
  console.log("userID:", userID);
  console.log("---------------------------");

  //Reference the 'Users' collection
  const userDoc = db.collection("Users").doc(userID);

  //This is the snapshot
  const docSnapshot = await userDoc.get();

  // console.log("Values of collection:");
  // console.log(docSnapshot._fieldsProto.friends.arrayValue)

  try {
    if (!docSnapshot.exists) {
      console.log("------------------------------");
      console.log("Used document not found", userID);
      console.log("------------------------------");
      res.status(201).send({ message: "User not found", userID: userID });
    }

    // Assuming there's only one document with a given email (unique emails)
    const userDoc = userSnapshot.docs[0];

    // Extract friends array from user document
    const friendsArray =
      docSnapshot.data().friends || docSnapshot.get("friends") || [];
    console.log("YEEEEEHAW");

    //array to store friends
    let allPosts = [];

    // Iterate through each friend
    for (let friendId of friendsArray) {
      console.log("friendId:", friendId);
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

app.get("/get-friends", async (req, res) => {
  //get UserID
  const { userID } = req.query;
  console.log("userID:", userID);
  console.log("---------------------------");
  //connect to firestore

  //Reference the 'Users' collection
  const userDoc = db.collection("Users").doc(userID);
  const docSnapshot = await userDoc.get();

  try {
    if (!docSnapshot.exists) {
      console.log("Used document not found", userID);
      res.status(404).send({ message: "User not found", userID: userID });
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
