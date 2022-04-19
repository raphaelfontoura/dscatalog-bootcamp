import { useEffect, useState } from "react";
import {
  Text, View, ScrollView, TouchableOpacity, Image, Modal, TextInput, ActivityIndicator, Alert
} from "react-native"
import arrow from "../../../assets/leftArrow.png";
import { getCategories } from "../../../services";
import { theme, text } from "../../../styles";

interface FormProductProps {
  setScreen: Function;
}
interface Category {
  id: number,
  name: string,
}

interface Product {
  id?: number,
  name: string,
  description: string,
  imgUrl: string,
  price: number,
  categories: Category[]
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
    price: 0
  });

  async function loadCategories() {
    setLoading(true);
    const res = await getCategories();
    setCategories(res.data.content);
    setLoading(false);
  }

  function handleSave() {
    !edit && newProduct();
  }

  async function newProduct() {
    setLoading(true);
    const cat = findCategory();
    const data = {
      ...product,
      categories: [
        cat
      ]
    };
    console.warn(data);
    setLoading(false);
  }

  function findCategory() {
    return categories.find( (category) => category.name === product.categories);
  }

  useEffect(() => {
    loadCategories();
  },[]);

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
                              setProduct({ ...product, categories: category.name});
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
                onChangeText={(e) => setProduct({...product, name: e})}
              />
              
              <TouchableOpacity 
                onPress={() => setShowCategories(!showCategories)}
                style={theme.selectInput}
              >
                <Text style={product.categories.length === 0 ? {color: "#9E9E9E"} : {color: "#000"}}>
                  {
                    product.categories.length === 0 ? "Escolha um categoria" : product.categories
                  }
                </Text>
              </TouchableOpacity>
              
              <TextInput 
                placeholder="Preço" 
                style={theme.formInput} 
                value={(product.price).toString()}
                onChangeText={(e) => setProduct({...product, price: parseInt(e)})}
              />
              
              <TouchableOpacity activeOpacity={0.8} style={theme.uploadBtn}>
                <Text style={text.uploadText}>Carregar Imagem</Text>
              </TouchableOpacity>
              <Text style={text.fileSize}>
                As imagens devem ser JPG ou PNG e não devem ultrapassar 5mb.
              </Text>
              
              <TextInput 
                multiline 
                placeholder="Descrição" 
                style={theme.textArea} 
                value={product.description}
                onChangeText={(e) => setProduct({...product, description: e})}
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
                          text:"Confirmar", 
                          onPress:() => setScreen("products"),
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