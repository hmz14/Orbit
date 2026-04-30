import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/CreatePostForm";

async function getProfile() {
  const res = await fetch("http://localhost:3000/api/profile", {
    cache: "no-store",
  });

  return res.json();
}

export default async function ProfilePage() {
  const user = await getProfile();

  return (
    <>
      <header className="top-nav">
        <div className="brand-wrap">
          <img className="brand-logo" src="/assets/icons/orbit_logo.png" alt="Orbit" />
        </div>

        <nav className="top-links">
          <a className="top-link" href="/">Feed</a>
          <a className="top-link top-link-active" href="/profile">Profile</a>
          <button type="button" className="top-link top-link-logout">
            Logout
          </button>
        </nav>
      </header>

      <main className="profile-page">
        <div className="profile-panel">
          <section className="profile-hero-card">
            <div className="profile-cover"></div>

            <div className="profile-hero-body">
              <img
                className="profile-hero-avatar"
                src="/assets/images/profile.svg"
                alt="Profile photo"
              />

              <div className="profile-hero-info">
                <div className="profile-hero-row">
                  <div className="profile-name-block">
                    <h1 className="profile-display-name">{user.username}</h1>
                    <p className="profile-handle">@{user.username}</p>
                  </div>

                  <button type="button" className="btn btn-secondary profile-edit-btn">
                    Edit Profile
                  </button>
                </div>

                <p className="profile-email-small">{user.email}</p>
                <p className="profile-bio-hero">{user.bio || "(No bio yet)"}</p>

                <div className="profile-stats-row">
                  <span className="profile-stat">
                    Following {user.following.length}
                  </span>
                  <span className="profile-stat">
                    Followers {user.followers.length}
                  </span>
                  <span className="profile-stat">
                    Posts {user.posts.length}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="profile-content-row">
            <section className="profile-create-post">
              <CreatePostForm />
            </section>

            <section className="profile-posts-block">
              <h2 className="profile-posts-title">Your Posts</h2>

              <ul className="orbit-posts-list profile-posts-feed">
                {user.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}