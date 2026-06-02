import { ArrowRightIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';

const OfferCard = ({ 
  discount, 
  image, 
  title,
  description,
  validUntil,
  code
}) => {
  return (
    <div className="relative w-full bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-md transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
          <span className="text-2xl font-bold">{discount}</span>
          <span className="text-sm font-medium ml-1">OFF</span>
        </div>
      </div>

      {/* Food Image */}
      <div className="relative h-48 w-full">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="text-xs text-gray-500 mb-3">Valid until {validUntil}</p>
        
        {/* Promo Code */}
        <div className="bg-gray-50 rounded-lg p-2 mb-3 flex items-center justify-between">
          <span className="text-xs text-gray-600">Use code:</span>
          <span className="font-mono text-sm font-bold text-orange-600">{code}</span>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300 shadow-sm hover:shadow-md">
          Order Now
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

OfferCard.propTypes = {
  discount: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  validUntil: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

export default OfferCard; 