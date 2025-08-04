import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaUserCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as peopleClient from "./Client";

export default function PeopleTable() {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [users, setUsers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [userForm, setUserForm] = useState<any>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        role: "STUDENT",
        loginId: "",
        section: "S101",
        lastActivity: "",
        totalActivity: ""
    });

    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const fetchUsersForCourse = async () => {
        try {
            const courseUsers = await peopleClient.findUsersForCourse(cid!);
            setUsers(courseUsers);
        } catch (error) {
            console.error("Error fetching users for course:", error);
        }
    };

    const handleCreateUser = async () => {
        try {
            await peopleClient.createUser(userForm);
            setShowModal(false);
            setUserForm({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                email: "",
                dob: "",
                role: "STUDENT",
                loginId: "",
                section: "S101",
                lastActivity: "",
                totalActivity: ""
            });
            fetchUsersForCourse();
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            await peopleClient.updateUser(editingUser);
            setShowModal(false);
            setEditingUser(null);
            fetchUsersForCourse();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await peopleClient.deleteUser(userId);
                fetchUsersForCourse();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setUserForm(user);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setUserForm({
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            role: "STUDENT",
            loginId: "",
            section: "S101",
            lastActivity: "",
            totalActivity: ""
        });
        setShowModal(true);
    };

    useEffect(() => {
        if (cid) {
            fetchUsersForCourse();
        }
    }, [cid]);

    return (
        <div id="wd-people-table">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>People</h3>
                {isFaculty && (
                    <Button variant="primary" onClick={openCreateModal}>
                        <FaPlus className="me-2" />
                        Add User
                    </Button>
                )}
            </div>

            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Login ID</th>
                        <th>Section</th>
                        <th>Role</th>
                        <th>Last Activity</th>
                        <th>Total Activity</th>
                        {isFaculty && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td className="wd-full-name text-nowrap">
                                <FaUserCircle className="me-2 fs-1 text-secondary" />
                                <span className="wd-first-name">{user.firstName}</span>
                                <span className="wd-last-name">{user.lastName}</span>
                            </td>
                            <td className="wd-login-id">{user.loginId}</td>
                            <td className="wd-section">{user.section}</td>
                            <td className="wd-role">{user.role}</td>
                            <td className="wd-last-activity">{user.lastActivity}</td>
                            <td className="wd-total-activity">{user.totalActivity}</td>
                            {isFaculty && (
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openEditModal(user)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingUser ? "Edit User" : "Add New User"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.username}
                                onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.firstName}
                                onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.lastName}
                                onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                value={userForm.dob}
                                onChange={(e) => setUserForm({...userForm, dob: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={userForm.role}
                                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="TA">Teaching Assistant</option>
                                <option value="ADMIN">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Login ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.loginId}
                                onChange={(e) => setUserForm({...userForm, loginId: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.section}
                                onChange={(e) => setUserForm({...userForm, section: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Activity</Form.Label>
                            <Form.Control
                                type="date"
                                value={userForm.lastActivity}
                                onChange={(e) => setUserForm({...userForm, lastActivity: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Activity</Form.Label>
                            <Form.Control
                                type="text"
                                value={userForm.totalActivity}
                                onChange={(e) => setUserForm({...userForm, totalActivity: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={editingUser ? handleUpdateUser : handleCreateUser}
                    >
                        {editingUser ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}