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
        centered
        className="backdrop-filter backdrop-blur-lg"
      >
        <Modal.Header closeButton className="bg-blue-400 bg-opacity-40">
          <Modal.Title id="about-modal" className="text-white">
            About ZeroPath
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome to ZeroPath</h2>
          <p className="text-lg mb-4">
            ZeroPath is designed to guide and empower individuals on their
            journey to a more sustainable and eco-friendly lifestyle.
          </p>
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-lg mb-4">
            We believe that everyone can make a difference, no matter how small,
            in reducing their carbon footprint. ZeroPath helps you track your
            efforts to minimize your environmental impact through actionable
            goals and rewarding milestones.
          </p>
          <h3 className="text-2xl font-semibold mb-4">Features</h3>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>
              <strong>Personalized Tracking:</strong> Monitor your carbon
              footprint through various activities, such as energy use,
              transportation, and more.
            </li>
            <li>
              <strong>Interactive Rewards:</strong> Earn rewards in the form of
              koi fish, each with unique appearances, to populate your virtual
              pond as you reduce your environmental impact.
            </li>
            <li>
              <strong>Educational Resources:</strong> Learn about
              sustainability, green technologies, and lifestyle changes that can
              help you contribute to a healthier planet.
            </li>
          </ul>
          <h3 className="text-2xl font-semibold mb-4">Join Us</h3>
          <p className="text-lg">
            Whether you're just starting or you're already eco-conscious,
            ZeroPath is your companion on the journey toward a greener future.
            Together, we can make a lasting difference.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
