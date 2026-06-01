import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import { BRAND } from '../constants/colors';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const [aantal, setAantal] = useState(1);

  const verhoog = () => setAantal((n) => n + 1);
  const verlaag = () => setAantal((n) => Math.max(1, n - 1));

  const totaal = (product.price * aantal).toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Geen foto</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>€ {product.price.toFixed(2)}</Text>

        {(product.uitleg1 || product.uitleg2 || product.uitleg3) ? (
          <View style={styles.uitlegBox}>
            {product.uitleg1 ? <Text style={styles.uitleg}>• {product.uitleg1}</Text> : null}
            {product.uitleg2 ? <Text style={styles.uitleg}>• {product.uitleg2}</Text> : null}
            {product.uitleg3 ? <Text style={styles.uitleg}>• {product.uitleg3}</Text> : null}
          </View>
        ) : null}

        <View style={styles.counterRow}>
          <Pressable style={styles.counterBtn} onPress={verlaag}>
            <Text style={styles.counterBtnText}>−</Text>
          </Pressable>
          <Text style={styles.aantal}>{aantal}</Text>
          <Pressable style={styles.counterBtn} onPress={verhoog}>
            <Text style={styles.counterBtnText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.totaalBox}>
          <Text style={styles.totaalLabel}>Totaal</Text>
          <Text style={styles.totaal}>€ {totaal}</Text>
        </View>

        <View style={styles.knopWrap}>
          <Button
            title="Voeg toe aan winkelmandje"
            color={BRAND.green}
            onPress={() =>
              Alert.alert(
                'Toegevoegd!',
                `${aantal}x ${product.name} toegevoegd aan je winkelmandje.`
              )
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8ee' },
  content: { paddingBottom: 30 },
  image: { width: '100%', height: 300 },
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
  name: { fontSize: 24, fontWeight: 'bold', color: BRAND.black },
  price: { fontSize: 20, color: BRAND.green, fontWeight: '700', marginTop: 6 },

  uitlegBox: { marginTop: 16, gap: 6 },
  uitleg: { fontSize: 14, color: '#555', lineHeight: 20 },

  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 20 },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: { color: BRAND.white, fontSize: 26, fontWeight: 'bold' },
  aantal: { fontSize: 22, fontWeight: 'bold', minWidth: 40, textAlign: 'center' },

  totaalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totaalLabel: { fontSize: 16, color: '#666' },
  totaal: { fontSize: 22, fontWeight: 'bold', color: BRAND.black },

  knopWrap: { marginTop: 20 },
});