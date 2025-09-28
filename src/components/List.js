import React from "react";

function List({ posts, viewPost, deletePost }) {
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <div key={index} className="post-item">
          <h2>{post.title}</h2>
          <p>{post.description.slice(0,51)}...</p>
        <div className="post-actions">
  <button className="view-btn" onClick={() => viewPost(index)}>View</button>
  <button className="delete-btn" onClick={() => deletePost(index)}>Delete</button>
</div>

        </div>
      ))}
    </div>
  );
}

export default List;
