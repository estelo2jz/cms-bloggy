// Get posts from localStorage
export function getPosts() {
  return JSON.parse(localStorage.getItem('posts')) || [];
}

// Save posts to localStorage
export function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}
