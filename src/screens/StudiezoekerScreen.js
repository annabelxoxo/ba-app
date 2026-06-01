import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';

import CampusCard from '../components/CampusCard';
import { getCampuses } from '../services/api';
import { BRAND } from '../constants/colors';

export default function StudiezoekerScreen({ navigation }) {
  const [campuses, setCampuses] = useState([]);
  const [gekozenRichting, setGekozenRichting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const c = await getCampuses();
      setCampuses(c);
    } catch (e) {
      setError('Er ging iets mis bij het laden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const richtingen = useMemo(() => {
    const all = campuses.map((c) => c.richting).filter(Boolean);
    return [...new Set(all)];
  }, [campuses]);


  const resultaten = useMemo(() => {
    if (!gekozenRichting) return [];
    return campuses.filter((c) => c.richting === gekozenRichting);
  }, [campuses, gekozenRichting]);

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
      <Text style={styles.titel}>Welke richting zoek je?</Text>
      <Text style={styles.subtitel}>
        Kies een richting en ontdek welke campus bij jou past.
      </Text>

    
      <View style={styles.richtingWrap}>
        {richtingen.map((r) => (
          <Pressable
            key={r}
            onPress={() => setGekozenRichting(r)}
            style={[
              styles.richtingKnop,
              gekozenRichting === r && styles.richtingKnopActief,
            ]}
          >
            <Text
              style={[
                styles.richtingText,
                gekozenRichting === r && styles.richtingTextActief,
              ]}
            >
              {r}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Resultaten */}
      {gekozenRichting && (
        <FlatList
          data={resultaten}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CampusCard
              campus={item}
              onPress={() =>
                navigation.navigate('CampusDetails', { campus: item })
              }
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.muted}>Geen campus gevonden voor deze richting.</Text>
          }
        />
      )}

      {!gekozenRichting && (
        <Text style={styles.hint}>Kies hierboven een richting</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  muted: { color: '#666', marginTop: 8, textAlign: 'center' },
  errorText: { color: '#E63323', textAlign: 'center', marginBottom: 12 },

  titel: { fontSize: 22, fontWeight: 'bold', color: BRAND.black },
  subtitel: { fontSize: 14, color: '#666', marginTop: 6, marginBottom: 16 },

  richtingWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  richtingKnop: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  richtingKnopActief: { backgroundColor: BRAND.green },
  richtingText: { color: '#333', fontSize: 13, textTransform: 'uppercase' },
  richtingTextActief: { color: BRAND.white, fontWeight: 'bold' },

  list: { paddingTop: 16, gap: 12 },
  hint: { textAlign: 'center', color: '#999', marginTop: 40 },

  retryBtn: {
    backgroundColor: BRAND.green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryText: { color: BRAND.white, fontWeight: 'bold' },
});