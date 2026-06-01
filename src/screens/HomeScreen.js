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
import NewsCard from '../components/NewsCard';
import CampusCard from '../components/CampusCard';
import { getProducts, getNews, getCampuses } from '../services/api';
import { BRAND } from '../constants/colors';

const TABS = ['producten', 'nieuws', 'campussen'];

const SORT_OPTIONS = [
  { key: 'naam-az', label: 'Naam A-Z' },
  { key: 'naam-za', label: 'Naam Z-A' },
  { key: 'prijs-laag', label: 'Prijs laag-hoog' },
  { key: 'prijs-hoog', label: 'Prijs hoog-laag' },
];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [campuses, setCampuses] = useState([]);

  const [activeTab, setActiveTab] = useState('producten');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [sort, setSort] = useState('naam-az');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, n, c] = await Promise.all([
        getProducts(),
        getNews(),
        getCampuses(),
      ]);
      setProducts(p);
      setNews(n);
      setCampuses(c);
    } catch (e) {
      setError('Er ging iets mis bij het laden. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setActiveCategory(null);
    setSort('naam-az');
  };

  const resetFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setSort('naam-az');
  };

  const sourceData =
    activeTab === 'producten' ? products : activeTab === 'nieuws' ? news : campuses;

  
  const getName = (item) => item.name || item.title || '';

  const categories = useMemo(() => {
    const all = sourceData.map((item) => item.category).filter(Boolean);
    return [...new Set(all)];
  }, [sourceData]);

  const visibleData = useMemo(() => {
    let result = [...sourceData];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => getName(item).toLowerCase().includes(q));
    }

    if (activeCategory) {
      result = result.filter((item) => item.category === activeCategory);
    }

    result.sort((a, b) => {
      const nameA = getName(a).trim().toLowerCase();
      const nameB = getName(b).trim().toLowerCase();
      switch (sort) {
        case 'naam-za':
          return nameB.localeCompare(nameA);
        case 'prijs-laag':
          return (a.price || 0) - (b.price || 0);
        case 'prijs-hoog':
          return (b.price || 0) - (a.price || 0);
        default:
          return nameA.localeCompare(nameB);
      }
    });

    return result;
  }, [sourceData, search, activeCategory, sort]);

 const renderItem = ({ item }) => {
    if (activeTab === 'producten') {
      return (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        />
      );
    }
    if (activeTab === 'nieuws') {
      return (
        <NewsCard
          news={item}
          onPress={() => navigation.navigate('NewsDetails', { news: item })}
        />
      );
    }
    return (
      <CampusCard
        campus={item}
        onPress={() => navigation.navigate('CampusDetails', { campus: item })}
      />
    );
  };

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
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => switchTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.search}
        placeholder={`Zoek in ${activeTab}...`}
        value={search}
        onChangeText={setSearch}
      />

      {categories.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <Pressable
            onPress={() => setActiveCategory(null)}
            style={[styles.chip, !activeCategory && styles.chipActive]}
          >
            <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>Alle</Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => {
          if (
            (opt.key === 'prijs-laag' || opt.key === 'prijs-hoog') &&
            activeTab !== 'producten'
          ) {
            return null;
          }
          return (
            <Pressable
              key={opt.key}
              onPress={() => setSort(opt.key)}
              style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            >
              <Text style={[styles.sortText, sort === opt.key && styles.sortTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
        <Pressable onPress={resetFilters} style={styles.resetChip}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </ScrollView>

      <FlatList
        data={visibleData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
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

  tabRow: { flexDirection: 'row', padding: 12, gap: 8 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tabActive: { backgroundColor: BRAND.green },
  tabText: { color: '#333', textTransform: 'capitalize' },
  tabTextActive: { color: BRAND.white, fontWeight: 'bold' },

  search: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },

  filterRow: { paddingHorizontal: 12, maxHeight: 44 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: BRAND.black },
  chipText: { color: '#333' },
  chipTextActive: { color: BRAND.white },

  sortRow: { paddingHorizontal: 12, maxHeight: 44, marginTop: 4 },
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