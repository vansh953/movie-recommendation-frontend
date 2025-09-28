import React from "react";

function Details({ post, goBack }) {
  if (!post) return null;

  return (
    <div className="post-details">
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default Details;
