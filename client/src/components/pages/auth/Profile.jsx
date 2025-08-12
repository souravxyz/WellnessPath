import { useProfile } from "../../../hooks/auth/useAuthHooks";

export default function ProfilePage() {
  const { myProfile } = useProfile();
  const user = myProfile?.data;

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Profile</h2>
      <div>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: "50%" }}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <a href="/edit-profile">Edit Profile</a>
    </div>
  );
}
