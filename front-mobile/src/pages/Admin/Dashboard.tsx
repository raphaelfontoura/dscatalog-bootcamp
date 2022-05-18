import { useState } from 'react';
import { View } from 'react-native';

import { TabBar } from '../../components';
import Categories from './Categories';
import EditProduct from './Products/EditProduct';
import FormProduct from './Products/FormProduct';
import Products from './Products/ListProducts';
import Users from './Users';

const Dashboard: React.FC = () => {

  const [screen, setScreen] = useState("products");
  const [productId, setProductId] = useState(0);

  return (
    <View>
      <TabBar screen={screen} setScreen={setScreen} />
      {screen === "products" && <Products setScreen={setScreen} setProductId={setProductId}/>}
      {screen === "newProduct" && <FormProduct setScreen={setScreen} />}
      {screen === "editProduct" && <EditProduct setScreen={setScreen} productId={productId} />}
      {screen === "categories" && <Categories />}
      {screen === "users" && <Users />}
    </View>
  )
};

export default Dashboard;