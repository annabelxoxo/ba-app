import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Switch,
} from 'react-native';

import ProductCard from '../components/ProductCard';
import NewsCard from '../components/NewsCard';
import CampusCard from '../components/CampusCard';
import { getProducts, getNews, getCampuses } from '../services/api';
import { BRAND } from '../constants/colors';

const TABS = ['producten', 'nieuws', 'campussen'];


const ACCENTS = ['#E63323', '#F7A600', '#DEDC00', '#86BC25', '#00AFCB', '#1961AC', '#A7358B', '#EA5297'];

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
  const [alleenGoedkoop, setAlleenGoedkoop] = useState(false);

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
    setAlleenGoedkoop(false);
  };

  const resetFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setSort('naam-az');
    setAlleenGoedkoop(false);
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

    if (alleenGoedkoop && activeTab === 'producten') {
      result = result.filter((item) => (item.price || 0) < 10);
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
  }, [sourceData, search, activeCategory, sort, alleenGoedkoop]);

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


  const Header = (
    <View>

      <View style={styles.hero}>
        <Image
          source={require('C:\\Users\\smeul\\OneDrive\\Documenten\\GitHub\\ba-app\\assets\\busleyden atheneum logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.heroTitel}>Welkom bij Busleyden Atheneum</Text>
        <Text style={styles.heroSub}>Ontdek onze producten, nieuws en campussen</Text>
      </View>


      <View style={styles.knopRij}>
        <Pressable
          style={[styles.bigKnop, { backgroundColor: '#F7A600' }]}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.bigKnopText}>Mini-game</Text>
        </Pressable>
        <Pressable
          style={[styles.bigKnop, { backgroundColor: '#00AFCB' }]}
          onPress={() => navigation.navigate('Studiezoeker')}
        >
          <Text style={styles.bigKnopText}>Studiezoeker</Text>
        </Pressable>
      </View>


      <View style={styles.tabRow}>
        {TABS.map((tab, i) => (
          <Pressable
            key={tab}
            onPress={() => switchTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: ACCENTS[i] },
            ]}
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

      {activeTab === 'producten' && (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Alleen onder € 10</Text>
          <Switch
            value={alleenGoedkoop}
            onValueChange={setAlleenGoedkoop}
            trackColor={{ true: BRAND.green }}
          />
        </View>
      )}

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
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={visibleData}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Text style={styles.muted}>Geen resultaten gevonden</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  muted: { color: '#666', marginTop: 8 },
  errorText: { color: '#E63323', textAlign: 'center', marginBottom: 12 },

  hero: {
    backgroundColor: '#f4f8ee',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: { width: 180, height: 70, marginBottom: 12 },
  heroTitel: { fontSize: 20, fontWeight: 'bold', color: BRAND.black, textAlign: 'center' },
  heroSub: { fontSize: 14, color: '#666', marginTop: 4, textAlign: 'center' },

  knopRij: { flexDirection: 'row', gap: 12, padding: 12 },
  bigKnop: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bigKnopEmoji: { fontSize: 28 },
  bigKnopText: { color: BRAND.white, fontWeight: 'bold', fontSize: 15, marginTop: 4 },

  tabRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginTop: 4 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tabText: { color: '#333', textTransform: 'capitalize', fontWeight: '600' },
  tabTextActive: { color: BRAND.white, fontWeight: 'bold' },

  search: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  switchLabel: { fontSize: 14, color: '#333' },

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

  sortRow: { paddingHorizontal: 12, maxHeight: 44, marginTop: 4, marginBottom: 8 },
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

  list: { paddingBottom: 24, gap: 12 },
  emptyBox: { padding: 40, alignItems: 'center' },

  retryBtn: {
    backgroundColor: BRAND.green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryText: { color: BRAND.white, fontWeight: 'bold' },
});