import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function CampusDetailsScreen({ route }) {
  const { campus } = route.params;
  const accent = campus.color || BRAND.green;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: accent }]}>
        <Text style={styles.name}>{campus.name}</Text>
        {campus.category ? <Text style={styles.focus}>{campus.category}</Text> : null}
      </View>
      <View style={styles.body}>
        {campus.quote ? <Text style={styles.quote}>"{campus.quote}"</Text> : null}
        {campus.text ? <Text style={styles.text}>{campus.text}</Text> : null}
        {campus.address ? <Text style={styles.info}>📍 {campus.address}</Text> : null}
        {campus.tel ? <Text style={styles.info}>📞 {campus.tel}</Text> : null}
        {campus.email ? <Text style={styles.info}>✉️ {campus.email}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  header: { padding: 24 },
  name: { fontSize: 24, fontWeight: 'bold', color: BRAND.white },
  focus: { fontSize: 14, color: BRAND.white, marginTop: 6, textTransform: 'uppercase' },
  body: { padding: 16 },
  quote: { fontSize: 17, fontStyle: 'italic', color: '#333', marginBottom: 12 },
  text: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 12 },
  info: { fontSize: 15, color: '#555', marginTop: 8 },
});