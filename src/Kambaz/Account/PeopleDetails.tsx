import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FormControl } from "react-bootstrap";
import * as client from "./client";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!uid) return;
    const u = await client.findUserById(uid);
    setUser(u);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  const deleteUser = async (userId: string) => {
    await client.deleteUser(userId);
    navigate(-1);
  };

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    navigate(-1);
  };

  return (
    <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil onClick={() => setEditing(true)} className="float-end fs-5 mt-2" />
        )}
        {editing && (
          <FaCheck onClick={saveUser} className="float-end fs-5 mt-2 me-2" />
        )}
        {!editing && (
          <div onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {user && editing && (
          <FormControl
            className="w-50"
            defaultValue={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>
      <div className="mt-3">
        <b>Roles:</b> <span>{user.role}</span>
        <br />
        <b>Login ID:</b> <span>{user.loginId}</span>
        <br />
        <b>Section:</b> <span>{user.section}</span>
        <br />
        <b>Total Activity:</b> <span>{user.totalActivity}</span>
      </div>
      <hr />
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end">
        Delete
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary float-start me-2">
        Cancel
      </button>
    </div>
  );
}