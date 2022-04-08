import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import menu from "../assets/menu.png";
import { nav } from "../styles";

const NavBar: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  function navigate(path: any) {
    if (path) {
      setShow(false);
      navigation.navigate(path);
    }
    setShow(false);
  }

  return (
    <TouchableOpacity activeOpacity={0.8} style={nav.drawer} onPress={() => setShow(!show)}>
      <Image source={menu} style={{ alignSelf: "flex-end", marginRight: 10 }} />
      {
        show ? (
          <View style={nav.options}>
            <TouchableOpacity style={nav.option}>
              <Text style={[nav.textOption]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={nav.option}>
              <Text>Catalogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={nav.option}>
              <Text>ADM</Text>
            </TouchableOpacity>
          </View>
        ) : (null)
      }
    </TouchableOpacity>
  )
};

export default NavBar;