import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import Auth from "../utils/auth";

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            ZeroPath
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="d-flex flex-row-reverse">
            <Nav className="ml-auto d-flex">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              {Auth.loggedIn() ? (
                <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>About</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="about-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="about-modal">About ZeroPath</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Welcome to ZeroPath, your journey toward sustainability.</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
