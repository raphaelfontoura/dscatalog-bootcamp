import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import { nav, text } from "../styles";
import menu from "../assets/menu.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { doLogout, isAuthenticated } from "../services/auth";

const NavBar: React.FC = () => {
  const [show, setShow] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  function navigate(path: any) {
    if (path) {
      setShow(false);
      navigation.navigate(path);
    }
    setShow(false);
  }

  async function logged() {
    const result = await isAuthenticated();
    setAuthenticated(result ? true : false);
  }

  function logout() {
    doLogout();
    setShow(false);
    navigation.navigate("Login");
  }

  useEffect(() => {
    logged();
  }, [])

  return (

    <>
      {
        authenticated ? (
          <TouchableOpacity style={nav.logoutBtn} onPress={() => logout()}>
            <Text style={text.logoutText}>Sair</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={nav.drawer} onPress={() => setShow(!show)}>
            <Image source={menu} style={{ alignSelf: "flex-end", marginRight: 10 }} />
            { show ?
              <View style={nav.options}>
                <TouchableOpacity style={nav.option} onPress={() => navigate("Home")}>
                  <Text style={[nav.textOption, route.name === "Home" ? nav.textActive : null]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={nav.option} onPress={() => navigate("Catalog")}>
                  <Text style={[nav.textOption, route.name === "Catalog" ? nav.textActive : null]}>Catálogo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={nav.option} onPress={() => navigate("Login")}>
                  <Text style={[nav.textOption, route.name === "ADM" ? nav.textActive : null]}>ADM</Text>
                </TouchableOpacity>
              </View>
              : (null)
            }
          </TouchableOpacity>
        )
      }
    </>
  )
};

export default NavBar;