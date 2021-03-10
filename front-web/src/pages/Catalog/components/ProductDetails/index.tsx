import { useParams } from "react-router";
import "./styles.scss";

type ParamsType = {
    productId: string;
}

const ProductDetails = () => {
    const { productId } = useParams<ParamsType>();
    
    return (
        <div className="product-details-container">
            <h1>Product details {productId}</h1>
        </div>
    );
};

export default ProductDetails