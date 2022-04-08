import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

import { ProductCard, SearchInput } from '../components';
import { Product } from '../models/Product';
import { api } from '../services';
import { theme } from '../styles';


const Catalog: React.FC = () => {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fillProducts = async () => {
    setLoading(true);
    const result = await api.get(`/products?page=0&linesPerPage=12&direction=ASC&orderBy=name`);
    setLoading(false);
    setProducts(result.data.content);
  }

  useEffect(() => {
    fillProducts();
  }, []);

  const data = search.length > 0
    ? products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    : products;

  return (
    <ScrollView contentContainerStyle={theme.scrollContainer}>
      <SearchInput placeholder="Nome do produto" search={search} setSearch={setSearch} />
      {loading ?
        (<ActivityIndicator size="large" />)
        :
        (data.map(product => (
          <ProductCard {...product} key={product.id} />)
        ))
      }
    </ScrollView>
  )
}

export default Catalog;