import { Button, Text, TouchableOpacity, View } from "react-native"

const Home: React.FC = ({ navigation }) => {
  return (
    <View>
      <Text>Bem vindo ao APP</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#069",
          padding: 10,
          borderRadius: 4,
        }}
        onPress = {() => navigation.navigate('Catalog')}
      >
        <Text>Catálogo</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home;