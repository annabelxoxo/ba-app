import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function CampusCard({ campus, onPress }) {
  const accent = campus.color || BRAND.green;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{campus.name}</Text>
        {campus.richting ? (
          <Text style={styles.richting} numberOfLines={1}>
            {campus.richting}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: BRAND.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  pressed: { opacity: 0.6 },
  accent: { width: 8 },
  info: { flex: 1, padding: 14 },
  name: { fontSize: 16, fontWeight: 'bold', color: BRAND.black },
  richting: { fontSize: 13, color: '#888', marginTop: 6, textTransform: 'uppercase' },
});