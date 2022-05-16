import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { NavBar } from "../components";
import { Home, Catalog, ProductDetails, Login, Dashboard } from "../pages";
import { colors, nav } from "../styles";

const Stack = createStackNavigator();

const HeaderText: React.FC = () => <Text style={nav.leftText}>DS Catalog</Text>;

const Routes: React.FC = () => {
  return (
    <Stack.Navigator
      // initialRouteName="Home"
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          backgroundColor: colors.primary,
          height: 80,
        },
        headerLeft: () => <HeaderText />,
        headerRight: () => <NavBar />,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Catalog" component={Catalog} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Login" component={Login} />
      {/** Dashboard administrativo */}
      <Stack.Screen name="Dashboard" component={Dashboard} />
      
    </Stack.Navigator>
  )
}

export default Routes;