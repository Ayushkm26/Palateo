import { StarIcon } from '@heroicons/react/20/solid';
import { ClockIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RestaurantCard = ({ 
  id,
  name, 
  image, 
  rating, 
  deliveryTime, 
  isOpen, 
  hasFreeDelivery,
  cuisine
}) => {
  return (
    <Link 
      to={`/restaurant/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Restaurant Image */}
      <div className="relative h-48 w-full">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isOpen && (
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Open Now
            </span>
          )}
          {hasFreeDelivery && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <TruckIcon className="w-3 h-3" />
              Free Delivery
            </span>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
            <StarIcon className="w-4 h-4 text-orange-500" />
            <span className="ml-1 text-sm font-medium text-orange-700">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{cuisine}</p>
        
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{deliveryTime} min</span>
        </div>
      </div>
    </Link>
  );
};

RestaurantCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  deliveryTime: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  hasFreeDelivery: PropTypes.bool.isRequired,
  cuisine: PropTypes.string.isRequired
};

export default RestaurantCard; 