import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import List from "./components/List";
import Details from "./components/Details";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);
  const addPost = (post) => {
    const updatedPosts = [...posts, post];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };
  const deletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setSelectedPost(null);
  };
  const viewPost = (index) => {
    setSelectedPost(posts[index]);
  };

  return (
    <div className="app-container">
      <h1>My Blogging Platform</h1>
      <Form addPost={addPost} />
      {!selectedPost ? (
        <List posts={posts} viewPost={viewPost} deletePost={deletePost} />
      ) : (
        <Details post={selectedPost} goBack={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

export default App;

