import React, { useState } from "react";

function Form({ addPost }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const Submit = (e) => {
    e.preventDefault();
    if (title && description) {
      addPost({ title, description });
      setTitle("");
      setDescription("");
    } else {
      alert("Please fill in both field");
    }
  };

  return (
    <form onSubmit={Submit} className="post-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Post</button>
    </form>
  );
}
export default Form;
