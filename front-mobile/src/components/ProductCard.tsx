import { useNavigation } from '@react-navigation/native';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Product } from '../models/Product';

import { text, theme } from '../styles';

interface ProductProps {
  id: number;
  name: String;
  imgUrl: string;
  price: number;
  role?: string;
  handleDelete?: Function;
}

const ProductCard: React.FC<ProductProps> = ({ id, name, imgUrl, price, role, handleDelete = () => "" }) => {

  const navigation = useNavigation();

  return (
    // @ts-ignore
    <TouchableOpacity style={theme.productCard} onPress={() => role ? "" : navigation.navigate("ProductDetails", { id })}>
      <Image source={{uri: imgUrl}} style={theme.productImage} />
      <View style={theme.productDescription}>
        <Text style={text.productName}>{name}</Text>
        <View style={theme.priceContainer}>
          <Text style={text.currency}>R$</Text>
          {/* @ts-ignore */}
          <TextInputMask
            type={"money"}
            options={{
              precision: 2,
              separator: ",",
              delimiter: ".",
              unit: " ",
              suffixUnit: ""
            }}
            // @ts-ignore
            value={price} 
            editable={false}
            style={text.productPrice}
          />
        </View>
      </View>

      {
        role === "admin" && (
          <View style={theme.buttonContainer}>
            <TouchableOpacity 
              style={theme.deleteBtn}
              onPress={() => handleDelete(id)}
            >
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