import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function NewsDetailsScreen({ route }) {
  const { news } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {news.image ? (
        <Image source={{ uri: news.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Geen foto</Text>
        </View>
      )}

      <View style={styles.card}>
        {news.date ? (
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{news.date}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>{news.title}</Text>
        {news.intro ? <Text style={styles.intro}>{news.intro}</Text> : null}
        {news.content ? <Text style={styles.content}>{news.content}</Text> : null}
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
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: BRAND.green,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  dateText: { color: BRAND.white, fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: BRAND.black },
  intro: { fontSize: 16, color: '#333', marginTop: 12, fontStyle: 'italic', lineHeight: 23 },
  content: { fontSize: 15, color: '#444', marginTop: 16, lineHeight: 24 },
});