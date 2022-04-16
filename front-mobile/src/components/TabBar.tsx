import { Text, TouchableOpacity, View } from "react-native";
import { tabbar } from "../styles";


const TabBar = () => {
  return (
    <View style={tabbar.container}>
      <TouchableOpacity style={[tabbar.pill, tabbar.pillActive]} activeOpacity={0.7}>
        <Text style={[tabbar.pillText, tabbar.pillTextActive]}>Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[tabbar.pill]} activeOpacity={0.7}>
        <Text style={[tabbar.pillText]}>Categorias</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[tabbar.pill]} activeOpacity={0.7}>
        <Text style={[tabbar.pillText]}>Usuários</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TabBar;