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
    const isEditing = editingUser !== null;

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
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-at me-2"></i>
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.username}
                                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                                        placeholder="Enter username"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-lock me-2"></i>
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                        placeholder="Enter password"
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-user me-2"></i>
                                        First Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.firstName}
                                        onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                                        placeholder="Enter first name"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-user me-2"></i>
                                        Last Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.lastName}
                                        onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                                        placeholder="Enter last name"
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <i className="fas fa-envelope me-2"></i>
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                placeholder="Enter email address"
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-calendar me-2"></i>
                                        Date of Birth
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={userForm.dob}
                                        onChange={(e) => setUserForm({...userForm, dob: e.target.value})}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-user-tag me-2"></i>
                                        Role
                                    </Form.Label>
                                    <Form.Select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                                    >
                                        <option value="">Select role</option>
                                        <option value="STUDENT">Student</option>
                                        <option value="FACULTY">Faculty</option>
                                        <option value="TA">Teaching Assistant</option>
                                        <option value="ADMIN">Admin</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-id-card me-2"></i>
                                        Login ID
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.loginId}
                                        onChange={(e) => setUserForm({...userForm, loginId: e.target.value})}
                                        placeholder="Enter login ID"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-layer-group me-2"></i>
                                        Section
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.section}
                                        onChange={(e) => setUserForm({...userForm, section: e.target.value})}
                                        placeholder="Enter section"
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-clock me-2"></i>
                                        Last Activity
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={userForm.lastActivity}
                                        onChange={(e) => setUserForm({...userForm, lastActivity: e.target.value})}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="fas fa-chart-line me-2"></i>
                                        Total Activity
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userForm.totalActivity}
                                        onChange={(e) => setUserForm({...userForm, totalActivity: e.target.value})}
                                        placeholder="e.g., 12:45:22"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        <i className="fas fa-times me-2"></i>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={isEditing ? handleUpdateUser : handleCreateUser}
                    >
                        <i className={`fas fa-${isEditing ? 'save' : 'plus'} me-2`}></i>
                        {isEditing ? 'Update User' : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}