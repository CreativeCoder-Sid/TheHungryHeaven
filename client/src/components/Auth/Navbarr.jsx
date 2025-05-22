import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import BookTableModal from './BookTableModal';
import API from '../../api/axios';
import './Navbar.css';

const Navbarr = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const searchTimeout = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  // Sticky navbar scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbarrr');
      if (window.scrollY > 10) {
        navbar.classList.add('navbar-shadow');
      } else {
        navbar.classList.remove('navbar-shadow');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await API.get(`/foods/search?query=${encodeURIComponent(searchTerm)}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const handleBookTableClick = () => {
    setShowModal(true);
    setToastMsg('Booking modal opened');
    setToastVariant('info');
    setShowToast(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToastMsg('Logged out successfully');
    setToastVariant('success');
    setShowToast(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const handleSearchSelect = (item) => {
    navigate(`/foods/${item._id}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary" id="navbarrr" fixed="top">
          <Container fluid>
            <img
              id="logo"
              src="/logo.jpg"
              alt="Logo"
              style={{ height: '45px', borderRadius: '50%', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
            <Navbar.Brand
              id="logo-name"
              href="/"
              style={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              THE HUNGRY HEAVEN
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className="mobile-menu">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Nav.Link href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}><b>Home</b></Nav.Link>
                <Nav.Link href="/About" onClick={(e) => { e.preventDefault(); navigate('/About'); }}><b>About</b></Nav.Link>
                <Nav.Link href="/Contact" onClick={(e) => { e.preventDefault(); navigate('/Contact'); }}><b>Contact</b></Nav.Link>

                <NavDropdown title="Menu" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/Bengali" onClick={(e) => { e.preventDefault(); navigate('/Bengali'); }}><b>Bengali</b></NavDropdown.Item>
                  <NavDropdown.Item href="/Chinese" onClick={(e) => { e.preventDefault(); navigate('/Chinese'); }}><b>Chinese</b></NavDropdown.Item>
                  <NavDropdown.Item href="/South" onClick={(e) => { e.preventDefault(); navigate('/South'); }}><b>South Indian</b></NavDropdown.Item>
                </NavDropdown>

                <Form className="d-flex position-relative">
                  <Form.Control
                    type="search"
                    placeholder="Search food..."
                    className="me-2"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                  />
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      if (searchResults.length > 0) handleSearchSelect(searchResults[0]);
                    }}
                  >
                    <b>Search</b>
                  </Button>

                  {searchTerm && (
                    <div className="search-results-dropdown shadow-sm">
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                          <div
                            key={item._id}
                            className="search-result-item"
                            onClick={() => handleSearchSelect(item)}
                          >
                            {item.name}
                          </div>
                        ))
                      ) : (
                        <div className="search-result-item text-muted">No results found</div>
                      )}
                    </div>
                  )}
                </Form>

                {isAdmin ? (
                  <Button
                    className="glow-on-hover"
                    onClick={() => navigate('/admin/dashboard')}
                    style={{ backgroundColor: '#6c63ff', border: 'none', marginLeft: '10px' }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    className="glow-on-hover"
                    onClick={handleBookTableClick}
                    style={{ marginLeft: '10px' }}
                  >
                    Book Table
                  </Button>
                )}
              </Nav>

              <div className="d-flex align-items-center">
                {!user ? (
                  <NavDropdown title="Login/Signup" id="logsin">
                    <NavDropdown.Item href="/Login" onClick={(e) => { e.preventDefault(); navigate('/Login'); }}><b>Login</b></NavDropdown.Item>
                    <NavDropdown.Item href="/Signup" onClick={(e) => { e.preventDefault(); navigate('/Signup'); }}><b>Signup</b></NavDropdown.Item>
                    <NavDropdown.Item href="/adminlogin" onClick={(e) => { e.preventDefault(); navigate('/adminlogin'); }}><b>Admin Login</b></NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown 
                    title={
                      <button
                        onClick={() => navigate('/my-profile')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          margin: 0,
                          cursor: 'pointer',
                          color: 'inherit',
                          fontWeight: 'bold',
                        }}
                      >
                        {user.username || user.name || 'Admin'}
                      </button>
                    } 
                    id="logsin"
                  >
                    {!isAdmin && (
                      <>
                        <NavDropdown.Item href="/my-orders" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }}><b>My Orders</b></NavDropdown.Item>
                        <NavDropdown.Item href="/my-bookings" onClick={(e) => { e.preventDefault(); navigate('/my-bookings'); }}><b>My Bookings</b></NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Item onClick={handleLogout} className="logout-glow"><b>Logout</b></NavDropdown.Item>
                  </NavDropdown>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {!isAdmin && <BookTableModal isOpen={showModal} onClose={() => setShowModal(false)} />}

        <ToastContainer position="top-end" className="p-3">
          <Toast
            bg={toastVariant}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2000}
            autohide
            style={{ minWidth: '250px' }}
          >
            <Toast.Body className="text-white">{toastMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      </header>
    </>
  );
};

export default Navbarr;
