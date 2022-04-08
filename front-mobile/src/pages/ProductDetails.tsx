import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../services";

import arrow from "../assets/leftArrow.png";
import { useNavigation } from "@react-navigation/native";
import { text, theme } from "../styles";


const ProductDetails = ({
  route: {
    params: { id },
  },
}) => {
  const [product, setProduct] = useState({
    id: null,
    name: null,
    description: null,
    price: null,
    imgUrl: null,
    date: null,
    categories: [],
  });
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  async function loadProductData() {
    setLoading(true);
    const response = await api.get(`/products/${id}`);
    setProduct(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadProductData();
  }, []);

  return (
    <View style={theme.detailsContainer}>
      {
        loading ? (<ActivityIndicator size="large" />) :
        (
        <View style={theme.detailCard}>
          <TouchableOpacity style={theme.goBackContainer} onPress={() => navigation.goBack()}>
            <Image source={arrow} />
            <Text style={text.goBackText}>Voltar</Text>
          </TouchableOpacity>
          <View style={theme.productImageContainer}>
            <Image source={{uri: product.imgUrl}} style={theme.productDetailImage} />
          </View>
          <Text style={text.productDetailsName}>{product.name}</Text>
          <View style={theme.priceContainer}>
            <Text style={text.currency}>R$</Text>
            <Text style={text.productPrice}>{product.price}</Text>
          </View>
          <ScrollView style={theme.scrollTextContainer}>
            <Text style={text.productDescription}>{product.description}</Text>
          </ScrollView>
        </View>
        )
      }
    </View>
  )
}

export default ProductDetails;