import { useEffect, useState, useRef } from 'react';
import API from '../../api/axios';
import AddFood from './AddFood';

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Raw search input values per category (immediate onChange)
  const [rawSearchTerms, setRawSearchTerms] = useState({});
  // Debounced search terms actually used for filtering
  const [searchTerms, setSearchTerms] = useState({});

  // Keep refs to debounce timers per category
  const debounceTimers = useRef({});

  const bgColors = ['#f9f9f9', '#e3f2fd', '#fff3e0', '#e8f5e9', '#fce4ec'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await API.get('/admin/foods');
        setFoods(res.data);
      } catch (err) {
        console.error('Error fetching foods:', err);
      }
    };
    fetchFoods();
  }, []);

  // Handle raw input change per category with debounce
  const handleRawSearchChange = (category, value) => {
    // Update raw input value immediately for controlled input
    setRawSearchTerms((prev) => ({
      ...prev,
      [category]: value,
    }));

    // Clear previous timer if exists
    if (debounceTimers.current[category]) {
      clearTimeout(debounceTimers.current[category]);
    }

    // Set new debounce timer (300ms)
    debounceTimers.current[category] = setTimeout(() => {
      setSearchTerms((prev) => ({
        ...prev,
        [category]: value.trim().toLowerCase(),
      }));
    }, 300);
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setShowEditModal(true);
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await API.delete(`/admin/foods/${foodId}`);
      setFoods((prev) => prev.filter((f) => f._id !== foodId));
      alert('Deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed.');
    }
  };

  const handleModalChange = (e) => {
    setEditingFood({ ...editingFood, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/foods/${editingFood._id}`, {
        ...editingFood,
        price: Number(editingFood.price),
      });
      setFoods((prev) =>
        prev.map((f) => (f._id === editingFood._id ? editingFood : f))
      );
      setShowEditModal(false);
      alert('Updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed.');
    }
  };

  const handleAddSuccess = (newFood) => {
    setFoods((prev) => [...prev, newFood]);
    setShowAddModal(false);
  };

  // Group foods by category
  const groupedFoods = foods.reduce((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push(food);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '80px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'white' }}>Food Management</h2>

      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 24px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Add Food
        </button>
      </div>

      {Object.keys(groupedFoods).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#ccc' }}>No food items found.</p>
      ) : (
        Object.entries(groupedFoods).map(([category, items]) => {
          // Filter items based on debounced search term for this category
          const searchTerm = searchTerms[category] || '';
          const filteredItems = items.filter(
            (food) =>
              food.name.toLowerCase().includes(searchTerm) ||
              food.description.toLowerCase().includes(searchTerm)
          );

          return (
            <div key={category} style={{ marginBottom: '40px' }}>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>{category}</h3>

              {/* Debounced search input */}
              <input
                type="search"
                placeholder={`Search in ${category}`}
                value={rawSearchTerms[category] || ''}
                onChange={(e) => handleRawSearchChange(category, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '15px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              />

              {filteredItems.length === 0 ? (
                <p style={{ color: '#ccc' }}>No items match your search.</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {filteredItems.map((food, index) => (
                    <div
                      key={food._id}
                      style={{
                        backgroundColor: bgColors[index % bgColors.length],
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <img
                        src={food.image}
                        alt={food.name}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '5px',
                        }}
                      />
                      <h4 style={{ marginTop: '10px' }}>{food.name}</h4>
                      <p>₹{food.price}</p>
                      <p style={{ flexGrow: 1, fontSize: '0.9rem' }}>
                        {food.description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '10px',
                        }}
                      >
                        <button
                          onClick={() => handleEdit(food)}
                          style={{
                            flex: 1,
                            marginRight: '8px',
                            padding: '8px',
                            background: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {showEditModal && editingFood && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Edit Food
            </h3>
            <form onSubmit={handleUpdate}>
              <input
                name="name"
                value={editingFood.name}
                onChange={handleModalChange}
                style={inputStyle}
                placeholder="Name"
              />
              <input
                name="price"
                type="number"
                value={editingFood.price}
                onChange={handleModalChange}
                style={inputStyle}
                placeholder="Price"
              />
              <input
                name="category"
                value={editingFood.category}
                onChange={handleModalChange}
                style={inputStyle}
                placeholder="Category"
              />
              <input
                name="image"
                value={editingFood.image}
                onChange={handleModalChange}
                style={inputStyle}
                placeholder="Image URL"
              />
              <textarea
                name="description"
                value={editingFood.description}
                onChange={handleModalChange}
                style={{ ...inputStyle, height: '80px' }}
                placeholder="Description"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={saveBtnStyle}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={cancelBtnStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddFood
          onAddSuccess={handleAddSuccess}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const saveBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const cancelBtnStyle = {
  ...saveBtnStyle,
  backgroundColor: '#999',
};

export default FoodManagement;
