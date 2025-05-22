import React, { useState } from 'react';
import API from '../../api/axios';

const AddFood = ({ onAddSuccess, onCancel }) => {
  const [food, setFood] = useState({
    name: '',
    price: '',
    category: 'Bengali',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/add-food', food);
      alert('Food added successfully!');
      onAddSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert('Error adding food');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: 'rgba(10, 10, 30, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '3rem',
      fontFamily: "'Poppins', sans-serif",
      color: '#fff',
      paddingTop:'120px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        padding: '30px 40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '1.8rem',
          fontWeight: '700',
          fontSize: '2rem',
          letterSpacing: '1.2px',
          color: '#e0e0e0',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Add New Food
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { name: 'name', placeholder: 'Food Name', type: 'text' },
            { name: 'price', placeholder: 'Price', type: 'number' },
            { name: 'image', placeholder: 'Image URL', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={food[name]}
              onChange={handleChange}
              required
              style={{
                padding: '14px 18px',
                borderRadius: '15px',
                border: 'none',
                outline: 'none',
                fontSize: '1.1rem',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.2)',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={e => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.boxShadow = 'inset 0 0 12px #64b5f6';
              }}
              onBlur={e => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.2)';
              }}
            />
          ))}
          <select
            name="category"
            value={food.category}
            onChange={handleChange}
            required
            style={{
              padding: '14px 18px',
              borderRadius: '15px',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 18px center',
              backgroundSize: '18px',
            }}
            onFocus={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = 'inset 0 0 12px #64b5f6';
            }}
            onBlur={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.2)';
            }}
          >
            <option value="Bengali">Bengali</option>
            <option value="South Indian">South Indian</option>
            <option value="Chinese">Chinese</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={food.description}
            onChange={handleChange}
            rows={4}
            required
            style={{
              padding: '14px 18px',
              borderRadius: '15px',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.2)',
              resize: 'vertical',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = 'inset 0 0 12px #64b5f6';
            }}
            onBlur={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.2)';
            }}
          />
          <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'linear-gradient(135deg, #42a5f5 0%, #478ed1 100%)',
                border: 'none',
                borderRadius: '15px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '1.15rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(66, 165, 245, 0.5)',
                transition: 'background 0.4s ease, box-shadow 0.4s ease',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 136, 229, 0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #42a5f5 0%, #478ed1 100%)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(66, 165, 245, 0.5)';
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '15px',
                color: '#bbb',
                fontWeight: '600',
                fontSize: '1.15rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
                transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.color = '#eee';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = '#bbb';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.2)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
