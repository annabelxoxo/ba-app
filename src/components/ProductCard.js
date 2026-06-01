import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Geen foto</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>€ {product.price.toFixed(2)}</Text>
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
    alignItems: 'center',
  },
  pressed: { opacity: 0.6 }, 
  image: { width: 80, height: 80 },
  noImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: { color: '#999', fontSize: 11 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: BRAND.black },
  price: { fontSize: 15, color: BRAND.green, marginTop: 4, fontWeight: '600' },
});