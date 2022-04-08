import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../models/Product';

import { text, theme } from '../styles';


const ProductCard: React.FC<Product> = ({ id, name, imgUrl, price }) => {

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
    </TouchableOpacity>
  );
};

export default ProductCard;