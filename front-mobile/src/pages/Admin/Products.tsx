import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { ProductCard, SearchInput } from "../../components";
import { getProducts } from "../../services";
import { admin, text } from "../../styles";

const Products = () => {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fillProducts() {
    setLoading(true);
    const res = await getProducts();
    setProducts(res.data.content);
    setLoading(false);
  }

  useEffect(() => {
    fillProducts();
  }, []);
  
  const data = search.length > 0 
    ? products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <ScrollView contentContainerStyle={admin.container}>
      <TouchableOpacity style={admin.addButton}>
        <Text style={text.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      <SearchInput search={search} setSearch={setSearch} placeholder="Nome do produto" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        data.map((product) => <ProductCard {...product} key={product.id} role="admin" />)
      )}
    </ScrollView>
  )
}

export default Products;