import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { BRAND } from '../constants/colors';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const [aantal, setAantal] = useState(1);

  const verhoog = () => setAantal((n) => n + 1);
  const verlaag = () => setAantal((n) => Math.max(1, n - 1)); 

  const totaal = (product.price * aantal).toFixed(2);

  return (
    <ScrollView style={styles.container}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.image} />
      )}
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>€ {product.price.toFixed(2)}</Text>

        {product.uitleg1 ? <Text style={styles.uitleg}>• {product.uitleg1}</Text> : null}
        {product.uitleg2 ? <Text style={styles.uitleg}>• {product.uitleg2}</Text> : null}
        {product.uitleg3 ? <Text style={styles.uitleg}>• {product.uitleg3}</Text> : null}

        <View style={styles.counterRow}>
          <Pressable style={styles.counterBtn} onPress={verlaag}>
            <Text style={styles.counterBtnText}>−</Text>
          </Pressable>
          <Text style={styles.aantal}>{aantal}</Text>
          <Pressable style={styles.counterBtn} onPress={verhoog}>
            <Text style={styles.counterBtnText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.totaal}>Totaal: € {totaal}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  image: { width: '100%', height: 280 },
  body: { padding: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: BRAND.black },
  price: { fontSize: 18, color: BRAND.green, fontWeight: '600', marginTop: 6 },
  uitleg: { fontSize: 14, color: '#555', marginTop: 8 },
  counterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 16 },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: { color: BRAND.white, fontSize: 24, fontWeight: 'bold' },
  aantal: { fontSize: 20, fontWeight: 'bold', minWidth: 30, textAlign: 'center' },
  totaal: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: BRAND.black },
});