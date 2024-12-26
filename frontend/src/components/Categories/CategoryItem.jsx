import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CategoryItem = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/maincategory/${category._id}`);
  };

  return (
    <li className="category-item" onClick={handleCategoryClick}>
      <img src={category.img} alt={category.name} />
      <h3>{category.name}</h3>
    </li>
  );
};

export default CategoryItem;

CategoryItem.propTypes = {
  category: PropTypes.object,
};
