import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function NewsDetailsScreen({ route }) {
  const { news } = route.params;

  return (
    <ScrollView style={styles.container}>
      {news.image && <Image source={{ uri: news.image }} style={styles.image} />}
      <View style={styles.body}>
        <Text style={styles.title}>{news.title}</Text>
        {news.date ? <Text style={styles.date}>{news.date}</Text> : null}
        {news.intro ? <Text style={styles.intro}>{news.intro}</Text> : null}
        {news.content ? <Text style={styles.content}>{news.content}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  image: { width: '100%', height: 240 },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: BRAND.black },
  date: { fontSize: 13, color: BRAND.green, marginTop: 6 },
  intro: { fontSize: 16, color: '#333', marginTop: 12, fontStyle: 'italic' },
  content: { fontSize: 15, color: '#444', marginTop: 12, lineHeight: 22 },
});