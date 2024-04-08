import React, { useState, useContext, createContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../firebase.js";
import { collection, doc, addDoc, getDocs, setDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // user state
  const [user, setUser] = useState({});

  // from sign up
  const createUser = async (email, password) => {
    // create a new user and set userID
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("New user UserID: ", user.uid); // This is the user's ID

      // update firestore db with new user and userID from createUser function
      await setDoc(doc(firestore, "Users", user.uid), {
        email: email,
        password: password,
        friends: [],
        posts: [],
        userID: user.uid,
      });
      console.log("Document written with ID: ", user.uid);

      return true;
    } catch (error) {
      // Handle Errors here.
      const errorMessage = error.message;
      console.log("Error creating user: ", errorMessage);

      // return null or throw the error, depending on your error handling strategy
      return errorMessage;
    }
  };

  // const awaitUser = async () => {
  //   return user;
  // }

  // from sign in
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("UserID at signin: ", user.uid); // This is the user's ID

      // check if user does not exist in firestore db
      const querySnapshot = await getDocs(collection(firestore, "Users"));
      let userFound = false;
      querySnapshot.forEach((doc) => {
        if (doc.id === user.uid) {
          userFound = true;
        }
      });

      // if user does not exist, add user to firestore db with the userID from signIn function
      if (!userFound) {
        console.log("User not found in firestore db");
        await setDoc(doc(firestore, "Users", user.uid), {
          email: email,
          password: password,
        });

        console.log("User was added in firestoredb with ID: ", user.uid);
      }

      return true;
    } catch (error) {
      // Handle Errors here.
      const errorMessage = error.message;
      console.log("Error signing in user: ", errorMessage);
      return errorMessage;
    }
  };

  // logout function
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
