import { useState, useEffect } from "react";
import { useParams } from "react-router";
import UsersTable from "./UsersTable";
import PeopleDetails from "./PeopleDetails";
import * as client from "./client";
import { FaPlus } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();
  
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      // If a name filter is also present, apply combined filter
      const users = name
        ? await client.findUsersByRoleAndPartialName(role, name)
        : await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      // If a role filter is also present, apply combined filter
      const users = role
        ? await client.findUsersByRoleAndPartialName(role, name)
        : await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };
  
  useEffect(() => {
    fetchUsers();
  }, [uid]);
  
  return (
    <div>
      <PeopleDetails />
      <h3 className="d-flex align-items-center justify-content-between">
        <span>Users</span>
        <button onClick={createUser} className="btn btn-danger wd-add-people">
          <FaPlus className="me-2" /> Users
        </button>
      </h3>
      <div className="d-flex gap-2 mb-2">
        <input
          value={name}
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search people"
          className="form-control w-25"
        />
        <select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select w-25"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>
      <UsersTable users={users} />
    </div>
  );
} 