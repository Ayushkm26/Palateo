import { StarIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

const TestimonialCard = ({ 
  name, 
  image, 
  rating, 
  quote 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-orange-100">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, index) => (
            <StarIcon 
              key={index}
              className={`w-5 h-5 ${
                index < rating ? 'text-yellow-400' : 'text-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Quote */}
      <div className="text-center">
        <p className="text-gray-600 italic">"{quote}"</p>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  quote: PropTypes.string.isRequired,
};

export default TestimonialCard; 