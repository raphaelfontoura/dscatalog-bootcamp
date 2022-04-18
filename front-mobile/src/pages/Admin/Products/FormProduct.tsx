import { useState } from "react";
import {
  Text, View, ScrollView, TouchableOpacity, Image, Modal, TextInput, ActivityIndicator
} from "react-native"
import arrow from "../../../assets/leftArrow.png";
import { theme, text } from "../../../styles";

interface FormProductProps {
  setScreen: Function;
}

const FormProduct: React.FC<FormProductProps> = (props) => {
  const { setScreen } = props;

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 3,
      name: "Computadores"
    },
    {
      id: 2,
      name: "Eletrônicos"
    },
    {
      id: 1,
      name: "Celulares"
    },
  ]);
  const [showCategories, setShowCategories] = useState(false);
  const [product, setProduct] = useState({
    name: null,
    description: null,
    imgUrl: null,
    price: null,
    categories: null
  });

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

              <TextInput placeholder="Nome do Produto" style={theme.formInput} />
              
              <TouchableOpacity 
                onPress={() => setShowCategories(!showCategories)}
                style={theme.selectInput}
              >
                <Text style={product.categories === null ? {color: "#9E9E9E"} : {color: "#000"}}>
                  {
                    product.categories === null ? "Escolha um categoria" : product.categories
                  }
                </Text>
              </TouchableOpacity>
              
              <TextInput placeholder="Preço" style={theme.formInput} />
              
              <TouchableOpacity activeOpacity={0.8} style={theme.uploadBtn}>
                <Text style={text.uploadText}>Carregar Imagem</Text>
              </TouchableOpacity>
              <Text style={text.fileSize}>
                As imagens devem ser JPG ou PNG e não devem ultrapassar 5mb.
              </Text>
              
              <TextInput multiline placeholder="Descrição" style={theme.textArea} />
              <View style={theme.buttonContainer}>
                <TouchableOpacity style={theme.deleteBtn}>
                  <Text style={text.deleteText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={theme.saveBtn}>
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