import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function CampusDetailsScreen({ route }) {
  const { campus } = route.params;
  const accent = campus.color || BRAND.green;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {campus.image ? (
        <Image source={{ uri: campus.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Geen foto</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
        <Text style={styles.name}>{campus.name}</Text>
        {campus.richting ? (
          <View style={[styles.richtingBadge, { backgroundColor: accent }]}>
            <Text style={styles.richtingText}>{campus.richting}</Text>
          </View>
        ) : null}

        {campus.text ? <Text style={styles.text}>{campus.text}</Text> : null}

        <View style={styles.infoBox}>
          {campus.address ? <Text style={styles.info}>📍 {campus.address}</Text> : null}
          {campus.tel ? <Text style={styles.info}>📞 {campus.tel}</Text> : null}
          {campus.email ? <Text style={styles.info}>✉️ {campus.email}</Text> : null}
          {campus.openingsuren ? <Text style={styles.info}>🕒 {campus.openingsuren}</Text> : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8ee' },
  content: { paddingBottom: 30 },
  image: { width: '100%', height: 240 },
  noImage: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#999' },

  card: {
    backgroundColor: BRAND.white,
    margin: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  accentBar: { width: 50, height: 5, borderRadius: 3, marginBottom: 14 },
  name: { fontSize: 24, fontWeight: 'bold', color: BRAND.black },
  richtingBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  richtingText: { color: BRAND.white, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  text: { fontSize: 15, color: '#444', lineHeight: 24, marginTop: 16 },

  infoBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  info: { fontSize: 15, color: '#555' },
});