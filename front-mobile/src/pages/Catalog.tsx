import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { ProductCard, SearchInput } from '../components';
import { Product } from '../models/Product';
import { api } from '../services';
import { theme } from '../styles';


const Catalog: React.FC = () => {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 6;

  const fillProducts = async () => {
    if (loading) return;

    setLoading(true);
    api.get(`/products?page=${page}&linesPerPage=${perPage}&direction=DESC&orderBy=id`)
      .then((result) => {
        setProducts([...products, ...result.data.content]);
        setPage(page + 1);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
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
    <View style={theme.scrollContainer}>
      <SearchInput placeholder="Nome do produto" search={search} setSearch={setSearch} />
      {loading && <ActivityIndicator size='large' />}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard {...item} key={item.id} />}
        onEndReached={() => fillProducts()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterList load={loading} />}
      />

    </View>
  )
}

export default Catalog;

type FooterListProps = {
  load: boolean;
}

function FooterList({ load }: FooterListProps) {
  if (!load) return null;

  return (
    <View style={theme.loading}>
      <ActivityIndicator size="large" />
    </View>
  );
}