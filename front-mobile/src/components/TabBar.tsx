import { Text, TouchableOpacity, View } from "react-native";


const TabBar = () => {
  return (
    <View>
      <TouchableOpacity>
        <Text>Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Categorias</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Usuários</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TabBar;