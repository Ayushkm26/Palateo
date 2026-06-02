import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, name, color }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/restaurants?category=${encodeURIComponent(name)}`);
  };

  return (
    <div 
      onClick={handleCategoryClick}
      className={`flex flex-col items-center p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[120px] ${color}`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
};

CategoryCard.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default CategoryCard; 