import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-tiny-toast';
import * as ImagePicker from 'expo-image-picker';

import arrow from '../../../assets/leftArrow.png';
import { Category } from '../../../models/Category';
import { createProduct, getCategories, uploadImage } from '../../../services';
import { text, theme } from '../../../styles';

interface FormProductProps {
  setScreen: Function;
}

const FormProduct: React.FC<FormProductProps> = (props) => {
  const { setScreen } = props;

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [category, setCategory] = useState<Category>();
  const [product, setProduct] = useState({
    name: "",
    categories: "",
    description: "",
    imgUrl: "",
    price: ""
  });
  const [image, setImage] = useState("");

  async function selectImage() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error(error);
    }
    
  }

  async function handleUpload() {
    uploadImage(image).then(res => {
      const { uri } = res?.data;
      setProduct({ ...product, imgUrl: uri });
    });
  }

  useEffect(() => {
    image ? handleUpload() : null;
  }, [image])

  async function loadCategories() {
    setLoading(true);
    const res = await getCategories();
    setCategories(res.data.content);
    setLoading(false);
  }

  function getRaw() {
    const str = product.price;
    const res = str.slice(2).replace(/\./g, "").replace(/,/g, ".");
    return res;
  }

  function handleSave() {
    !edit && newProduct();
  }

  async function newProduct() {
    setLoading(true);
    const cat = findCategory();
    const data = {
      ...product,
      price: getRaw(),
      categories: [
        cat
      ]
    };
    try {
      await createProduct(data);
      Toast.showSuccess("Produto criado com sucesso.");
    } catch (error) {
      Toast.show("Erro ao salvar...");
    }
    setLoading(false);
  }

  function findCategory() {
    return categories.find((category) => category.name === product.categories);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <View style={theme.formContainer}>
      {
        loading ? <ActivityIndicator size="large" /> :
          <View style={theme.formCard}>
            <ScrollView>
              <Modal
                visible={showCategories}
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
              >
                <View style={theme.modalContainer}>
                  <ScrollView contentContainerStyle={theme.modalContent}>
                    {
                      categories.map(
                        category =>
                          <TouchableOpacity
                            style={theme.modalItem}
                            key={category.id}
                            onPress={() => {
                              setProduct({ ...product, categories: category.name });
                              setShowCategories(!showCategories);
                            }}>
                            <Text>{category.name}</Text>
                          </TouchableOpacity>
                      )
                    }
                  </ScrollView>
                </View>
              </Modal>

              <TouchableOpacity onPress={() => setScreen("products")} style={theme.goBackContainer}>
                <Image source={arrow} />
                <Text style={text.goBackText}>Voltar</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Nome do Produto"
                style={theme.formInput}
                value={product.name}
                onChangeText={(e) => setProduct({ ...product, name: e })}
              />

              <TouchableOpacity
                onPress={() => setShowCategories(!showCategories)}
                style={theme.selectInput}
              >
                <Text style={product.categories.length === 0 ? { color: "#9E9E9E" } : { color: "#000" }}>
                  {
                    product.categories.length === 0 ? "Escolha um categoria" : product.categories
                  }
                </Text>
              </TouchableOpacity>

              {/* @ts-ignore */}
              <TextInputMask
                type='money'
                placeholder='Preço'
                style={theme.formInput}
                value={product.price}
                onChangeText={(e) => setProduct({ ...product, price: e })}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={theme.uploadBtn}
                onPress={selectImage}>
                <Text style={text.uploadText}>Carregar Imagem</Text>
              </TouchableOpacity>
              <Text style={text.fileSize}>
                As imagens devem ser JPG ou PNG e não devem ultrapassar 5mb.
              </Text>
              {
                image !== "" && (
                  <TouchableOpacity
                    onPress={selectImage}
                    activeOpacity={0.9}
                    style={{
                      width: "100%",
                      height: 150,
                      borderRadius: 10,
                      marginVertical: 10,
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                )
              }

              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Descrição"
                style={theme.textArea}
                value={product.description}
                onChangeText={(e) => setProduct({ ...product, description: e })}
              />

              <View style={theme.buttonContainer}>
                <TouchableOpacity
                  style={theme.deleteBtn}
                  onPress={() =>
                    Alert.alert(
                      "Deseja cancelar?",
                      "Os dados inseridos não serão salvos",
                      [
                        {
                          text: "Voltar",
                          style: "cancel"
                        },
                        {
                          text: "Confirmar",
                          onPress: () => setScreen("products"),
                          style: "default"
                        }
                      ]
                    )
                  }
                >
                  <Text style={text.deleteText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={theme.saveBtn}
                  onPress={() => handleSave()}
                >
                  <Text style={text.saveText}>Salvar</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
      }
    </View>
  )
}

export default FormProduct;