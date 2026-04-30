import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/CreatePostForm";
import FollowButton from "@/components/FollowButton";

export default async function HomePage() {
  const posts = await getPosts();
  const users = await getUsers();

  async function getUsers() {
    const res = await fetch("http://localhost:3000/api/users", {
      cache: "no-store",
    });

    return res.json();
  }
  async function getPosts() {
    const res = await fetch("http://localhost:3000/api/posts", {
      cache: "no-store",
    });

    return res.json();
  }
  return (
    <>
      <header className="top-nav">
        <div className="brand-wrap">
          <img
            className="brand-logo"
            src="assets/icons/orbit_logo.png"
            alt="Orbit"
          />
        </div>

        <nav className="top-links">
          <a className="top-link top-link-active" href="/">
            Feed
          </a>
          <a className="top-link" href="/profile">
            Profile
          </a>
          <button type="button" className="top-link top-link-logout">
            Logout
          </button>
        </nav>
      </header>

      <main className="feed-page">
        <div className="feed-grid">
          <div className="col-main">
            <div className="card create-post-card">
              <h2 className="create-post-title">Create Post</h2>

              <div className="create-post-top">
                <CreatePostForm />
              </div>
            </div>

            <ul className="orbit-posts-list">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          </div>

          <div className="col-sidebar">
            <div className="card people-card">
              <div className="sidebar-title-row">
                <h3 className="sidebar-title">People You May Know</h3>
                <button
                  type="button"
                  className="btn btn-secondary view-more-btn"
                >
                  View more
                </button>
              </div>

              <ul className="people-list">
                {users.map((user) => (
                  <li key={user.id} className="people-item">
                    <div className="people-item-left">
                      <img
                        className="people-avatar"
                        src="/assets/images/profile.svg"
                        alt="avatar"
                      />
                      <div>
                        <p className="people-item-name">{user.username}</p>
                        <p className="people-item-handle">@{user.username}</p>
                      </div>
                    </div>

                    <FollowButton
                      followingId={user.id}
                      initialFollowing={user.followers.some(
                        (f) => f.followerId === 1,
                      )}
                    />
                  </li>
                ))}
              </ul>

              <h3 className="sidebar-title">Following</h3>
              <ul className="people-list">
                <li className="orbit-empty">
                  You are not following anyone yet.
                </li>
              </ul>
            </div>

            <div className="card about-card">
              <h3 className="sidebar-title">About</h3>
              <div className="about-user-row">
                <img
                  className="about-avatar"
                  src="/assets/images/profile.svg"
                  alt="avatar"
                />
                <div className="about-info">
                  <p className="about-name">mazin</p>
                  <p className="about-handle">@mazin</p>
                </div>
              </div>
              <p className="about-bio">No bio yet.</p>
              <a className="btn btn-secondary about-edit-btn" href="/profile">
                Edit Profile
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
