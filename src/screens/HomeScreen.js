import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { BRAND } from '../constants/colors';

const SORT_OPTIONS = [
  { key: 'naam-az', label: 'Naam A-Z' },
  { key: 'naam-za', label: 'Naam Z-A' },
  { key: 'prijs-laag', label: 'Prijs laag-hoog' },
  { key: 'prijs-hoog', label: 'Prijs hoog-laag' },
];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('naam-az');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const p = await getProducts();
      setProducts(p);
    } catch (e) {
      setError('Er ging iets mis bij het laden. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetFilters = () => {
    setSearch('');
    setSort('naam-az');
  };

  const visibleData = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        (item.name || '').toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const nameA = (a.name || '').trim().toLowerCase();
      const nameB = (b.name || '').trim().toLowerCase();
      switch (sort) {
        case 'naam-za':
          return nameB.localeCompare(nameA);
        case 'prijs-laag':
          return a.price - b.price;
        case 'prijs-hoog':
          return b.price - a.price;
        default:
          return nameA.localeCompare(nameB);
      }
    });

    return result;
  }, [products, search, sort]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BRAND.green} />
        <Text style={styles.muted}>Laden...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={loadData}>
          <Text style={styles.retryText}>Opnieuw proberen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Zoek een product..."
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortRow}
      >
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => setSort(opt.key)}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
          >
            <Text
              style={[styles.sortText, sort === opt.key && styles.sortTextActive]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
        <Pressable onPress={resetFilters} style={styles.resetChip}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </ScrollView>

      <FlatList
        data={visibleData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {
            }}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.muted}>Geen resultaten gevonden</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  muted: { color: '#666', marginTop: 8 },
  errorText: { color: '#E63323', textAlign: 'center', marginBottom: 12 },

  search: {
    margin: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },

  sortRow: { paddingHorizontal: 12, maxHeight: 44 },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  sortChipActive: { borderColor: BRAND.green, backgroundColor: '#f1f8e8' },
  sortText: { color: '#666', fontSize: 13 },
  sortTextActive: { color: BRAND.green, fontWeight: 'bold' },

  resetChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  resetText: { color: '#E63323', fontSize: 13 },

  list: { padding: 12, gap: 12 },

  retryBtn: {
    backgroundColor: BRAND.green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryText: { color: BRAND.white, fontWeight: 'bold' },
});