import { useNavigation } from '@react-navigation/native';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../models/Product';

import { text, theme } from '../styles';

interface ProductProps {
  id: Number;
  name: String;
  imgUrl: ImageSourcePropType;
  price: Number;
  role?: string;
}

const ProductCard: React.FC<ProductProps> = ({ id, name, imgUrl, price, role }) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity style={theme.productCard} onPress={() => navigation.navigate("ProductDetails", { id })}>
      <Image source={{uri: imgUrl}} style={theme.productImage} />
      <View style={theme.productDescription}>
        <Text style={text.productName}>{name}</Text>
        <View style={theme.priceContainer}>
          <Text style={text.currency}>R$</Text>
          <Text style={text.productPrice}>{price}</Text>
        </View>
      </View>

      {
        role === "admin" && (
          <View style={theme.buttonContainer}>
            <TouchableOpacity style={theme.deleteBtn}>
              <Text style={text.deleteText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.editBtn}>
              <Text style={text.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </TouchableOpacity>
  );
};

export default ProductCard;