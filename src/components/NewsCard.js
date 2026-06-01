import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function NewsCard({ news, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {news.image ? (
        <Image source={{ uri: news.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Geen foto</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        {news.date ? <Text style={styles.date}>{news.date}</Text> : null}
        <Text style={styles.intro} numberOfLines={2}>
          {news.intro}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  pressed: { opacity: 0.6 },
  image: { width: '100%', height: 160 },
  noImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: { color: '#999', fontSize: 11 },
  info: { padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: BRAND.black },
  date: { fontSize: 12, color: BRAND.green, marginTop: 4 },
  intro: { fontSize: 13, color: '#555', marginTop: 6 },
});