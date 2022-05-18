import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity } from 'react-native';

import { ProductCard, SearchInput } from '../../../components';
import { Product } from '../../../models/Product';
import { deleteProduct, getProducts } from '../../../services';
import { admin, text } from '../../../styles';


interface ProductProps {
  setScreen: Function;
  setProductId: Function;
}

const Products: React.FC<ProductProps> = (props) => {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState(false);

  const { setScreen, setProductId } = props;

  function handleEdit(id: number) {
    setProductId(id);
    setScreen("editProduct");
  }

  async function fillProducts() {
    setLoading(true);
    const res = await getProducts();
    setProducts(res.data.content);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    const res = await deleteProduct(id);
    fillProducts();
  }

  useEffect(() => {
    fillProducts();
  }, []);
  
  const data = search.length > 0 
    ? products?.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <ScrollView contentContainerStyle={admin.container}>
      <TouchableOpacity style={admin.addButton} onPress={() => setScreen("newProduct")}>
        <Text style={text.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      <SearchInput search={search} setSearch={setSearch} placeholder="Nome do produto" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        data?.map((product) => {
          const { id } = product;
          return (<ProductCard 
            {...product} 
            key={id} 
            role="admin" 
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />)}
          )
      )}
    </ScrollView>
  )
}

export default Products;