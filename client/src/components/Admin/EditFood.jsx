import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [btnHover, setBtnHover] = useState(false);

  const categories = ['Bengali', 'Chinese', 'South Indian', 'Snacks', 'Biryani', 'Drinks', 'Dessert'];

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await API.get(`/admin/foods/${id}`);
        setFood(res.data);
      } catch (err) {
        console.error('Failed to fetch food:', err);
        toast.error('⚠️ Failed to load food data');
      }
    };
    fetchFood();
  }, [id]);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/foods/${id}`, food);
      toast.success('✅ Food updated successfully!');
      setTimeout(() => navigate('/admin/foods'), 1500);
    } catch (err) {
      console.error('Failed to update food:', err);
      toast.error('❌ Update failed. Please try again.');
    }
  };

  if (!food) return <p style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#ccc' }}>Loading...</p>;

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '60px auto',
      padding: '40px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
      animation: 'fadeIn 0.6s ease-in-out forwards',
      fontFamily: "'Poppins', sans-serif",
      color: '#f5f5f5',
    },
    heading: {
      textAlign: 'center',
      fontSize: '30px',
      fontWeight: '700',
      marginBottom: '30px',
      color: '#f7d9ff',
      textShadow: '0 1px 6px #d174ff',
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      marginBottom: '18px',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.3)',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: '0.3s ease',
    },
    inputFocus: {
      borderColor: '#a586ff',
      boxShadow: '0 0 8px rgba(165,134,255,0.8)',
    },
    textarea: {
      resize: 'vertical',
      minHeight: '90px',
    },
    button: {
      width: '100%',
      padding: '16px 0',
      borderRadius: '14px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      color: '#fff',
      background: btnHover
        ? 'linear-gradient(145deg, #a86ef5, #c48bf9)'
        : 'linear-gradient(145deg, #7e65d7, #a86ef5)',
      boxShadow: btnHover
        ? '0 0 20px rgba(168, 110, 245, 0.8)'
        : '0 8px 16px rgba(126, 101, 215, 0.6)',
      transform: btnHover ? 'scale(1.03)' : 'scale(1)',
      transition: 'all 0.3s ease',
    },
    keyframes: `
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
    `,
  };

  return (
    <>
      <style>{styles.keyframes}</style>
      <ToastContainer position="top-right" autoClose={1800} />
      <div style={styles.container}>
        <h2 style={styles.heading}>🍽️ Edit Food Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={food.name}
            onChange={handleChange}
            placeholder="Food Name"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required
          />
          <input
            type="number"
            name="price"
            value={food.price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required
          />
          <select
            name="category"
            value={food.category}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            name="image"
            value={food.image}
            onChange={handleChange}
            placeholder="Image URL"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
            required
          />
          <textarea
            name="description"
            value={food.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            style={{ ...styles.input, ...styles.textarea }}
            onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
            onBlur={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.textarea })}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            ✨ Update Food
          </button>
        </form>
      </div>
    </>
  );
};

export default EditFood;
