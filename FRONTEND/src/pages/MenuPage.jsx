import { useParams } from 'react-router-dom';

const MenuPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Menu</h1>
      <p>Restaurant ID: {id}</p>
    </div>
  );
};

export default MenuPage; 