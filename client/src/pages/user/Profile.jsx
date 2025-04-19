

import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
// import SpinningAvatar from "../../components/SpinningAvatar";;

const Profile = () => {
  const { username } = useParams();
  const location = useLocation();


  const params = new URLSearchParams(location.search);
  const USE_MOCK_DATA = params.get("mock") === "true";

  // Mock data
  const mockProfile = {
    username: "MonkeydLuffy",
    // avatarUrl: "https://models.readyplayer.me/6803bba0679b1816820aa55d.glb",
    bio: "King of the Pirates • Long-life fan of wanting to be king of the pirates",
    about:
      "I'm going to be the king of the pirates.",
    location: "The Grand Line",
    email: "hello@example.com",
    products: [
      {
        name: "Neon Genesis OST",
        description: "Description of Neon Genesis OST",
        link: "#"
      },
      {
        name: "Cowboy Bebop Vinyl",
        description: "Cowboy Bebop Description",
        link: "#"
      }
    ],
    interests: ["Pop Punk", "Classical", "Emo", "Electro", "Indie Rock"],
    socials: [
      { platform: "GitHub", url: "https://github.com/" },
      { platform: "LinkedIn", url: "https://linkedin.com/" },
    ],
    updatedAt: "2025-04-18T00:00:00Z"
  };

  const [profile, setProfile] = useState(USE_MOCK_DATA ? mockProfile : null);
  const [loading, setLoading] = useState(!USE_MOCK_DATA);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${username}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, USE_MOCK_DATA]);

  if (loading) return <div className="profile-page">Loading profile...</div>;
  if (error) return <div className="profile-page">Error: {error}</div>;

  return (
    <div className="profile-page">
    <div className="profile-grid">
   
      {/* <div className="profile-avatar-column">
        <SpinningAvatar avatarUrl="https://models.readyplayer.me/6803bba0679b1816820aa55d.glb" />
      </div> */}
  
  
      <div className="profile-content-column">
        <header className="profile-header">
          <h1>@{profile.username}</h1>
          <p>{profile.bio}</p>
        </header>
  
        <section className="profile-about profile-section">
          <h2>About Me</h2>
          <p>{profile.about}</p>
          {profile.location && <p>📍 Based in {profile.location}</p>}
          {profile.email && (
            <p>
              📧 <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
          )}
        </section>
  
        <section className="profile-products profile-section">
          <h2>My Stuff</h2>
          <ul>
            {profile.products?.length ? (
              profile.products.map((proj, i) => (
                <li key={i}>
                  <strong>{proj.name}</strong> – {proj.description} <Link to={proj.link}>View</Link>
                </li>
              ))
            ) : (
              <li>Nothing listed.</li>
            )}
          </ul>
        </section>
  
        <section className="profile-genres profile-section">
          <h2>Interests</h2>
          <ul>
            {profile.interests?.length ? (
              profile.interests.map((interest, i) => <li key={i}>{interest}</li>)
            ) : (
              <li>No interests listed.</li>
            )}
          </ul>
        </section>
  
        <section className="profile-social profile-section">
          <h2>Find Me On</h2>
          <ul>
            {profile.socials?.length ? (
              profile.socials.map((social, i) => (
                <li key={i}>
                  <a href={social.url} target="_blank" rel="noreferrer">
                    {social.platform}
                  </a>
                </li>
              ))
            ) : (
              <li>No social links provided.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  
    <footer className="profile-footer">
      <p>Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "N/A"}</p>
    </footer>
  </div>
  
  );
};

export default Profile;
