import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { FaPlus, FaTrash, FaUserCircle } from "react-icons/fa";
import * as peopleClient from "./Client";

export default function PeopleTable() {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [users, setUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showUnenrollModal, setShowUnenrollModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isFaculty = currentUser && (currentUser.role === "FACULTY" || currentUser.role === "ADMIN");

    const fetchUsersForCourse = async () => {
        try {
            setError(null);
            const courseUsers = await peopleClient.findUsersForCourse(cid!);
            // Filter out any null or undefined users and ensure they have required properties
            const validUsers = courseUsers.filter((user: any) => 
                user !== null && 
                user !== undefined && 
                typeof user === 'object'
            );
            setUsers(validUsers);
        } catch (error) {
            console.error("Error fetching course users:", error);
            setError("Failed to load course users");
            setUsers([]);
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const allUsersData = await peopleClient.findAllUsers();
            // Filter out any null or undefined users and ensure they have required properties
            const validUsers = allUsersData.filter((user: any) => 
                user !== null && 
                user !== undefined && 
                typeof user === 'object'
            );
            setAllUsers(validUsers);
        } catch (error) {
            console.error("Error fetching all users:", error);
            setAllUsers([]);
        }
    };

    const handleEnrollUser = async () => {
        if (!selectedUserId) return;
        
        setLoading(true);
        try {
            await peopleClient.enrollUserInCourse(selectedUserId, cid!);
            setShowEnrollModal(false);
            setSelectedUserId("");
            fetchUsersForCourse();
        } catch (error) {
            console.error("Error enrolling user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnenrollUser = async () => {
        if (!selectedUser) return;
        
        setLoading(true);
        try {
            await peopleClient.unenrollUserFromCourse(selectedUser._id, cid!);
            setShowUnenrollModal(false);
            setSelectedUser(null);
            fetchUsersForCourse();
        } catch (error) {
            console.error("Error unenrolling user:", error);
        } finally {
            setLoading(false);
        }
    };

    const openEnrollModal = () => {
        fetchAllUsers();
        setShowEnrollModal(true);
    };

    const openUnenrollModal = (user: any) => {
        setSelectedUser(user);
        setShowUnenrollModal(true);
    };

    // Filter out users already enrolled in this course
    const availableUsers = allUsers.filter(user => 
        user && !users.some(enrolledUser => enrolledUser && enrolledUser._id === user._id)
    );

    useEffect(() => {
        if (cid) {
            fetchUsersForCourse();
        }
    }, [cid]);

    if (!cid) return <div>No course selected</div>;

    if (initialLoading) {
        return (
            <div id="wd-people-table">
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading course users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="wd-people-table">
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="ms-3"
                        onClick={fetchUsersForCourse}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div id="wd-people-table">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>People</h3>
                {isFaculty && (
                    <Button variant="primary" onClick={openEnrollModal}>
                        <FaPlus className="me-2" />
                        Add User to Course
                    </Button>
                )}
            </div>

            {users.length === 0 ? (
                <div className="text-center py-4">
                    <FaUserCircle className="fs-1 text-muted mb-3" />
                    <p className="text-muted">No users enrolled in this course yet.</p>
                </div>
            ) : (
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
                        {users.filter(user => user !== null && user !== undefined).map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <FaUserCircle className="me-2 text-secondary" />
                                    {user?.firstName || 'N/A'} {user?.lastName || 'N/A'}
                                </td>
                                <td>{user?.loginId || "N/A"}</td>
                                <td>{user?.section || "N/A"}</td>
                                <td>
                                    <Badge 
                                        bg={
                                            user?.role === "ADMIN" ? "danger" :
                                            user?.role === "FACULTY" ? "warning" :
                                            user?.role === "STUDENT" ? "success" : "secondary"
                                        }
                                    >
                                        {user?.role || "N/A"}
                                    </Badge>
                                </td>
                                <td>{user?.lastActivity || "N/A"}</td>
                                <td>{user?.totalActivity || "N/A"}</td>
                                {isFaculty && (
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => openUnenrollModal(user)}
                                            disabled={user?._id === currentUser?._id}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Enroll User Modal */}
            <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enroll User in Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select User to Enroll</Form.Label>
                            <Form.Select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">Choose a user...</option>
                                {availableUsers.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.role})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleEnrollUser}
                        disabled={!selectedUserId || loading}
                    >
                        {loading ? "Enrolling..." : "Enroll User"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Unenroll User Modal */}
            <Modal show={showUnenrollModal} onHide={() => setShowUnenrollModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove User from Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <p>
                            Are you sure you want to remove <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> from this course?
                            <br />
                            <small className="text-muted">
                                This will unenroll them from the course but won't delete their account.
                            </small>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUnenrollModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleUnenrollUser}
                        disabled={loading}
                    >
                        {loading ? "Removing..." : "Remove User"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}