import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { BRAND } from '../constants/colors';

const { width } = Dimensions.get('window');
const SPEELVELD_HOOGTE = 480;
const RUGZAK_BREEDTE = 70;
const ITEM_GROOTTE = 40;
const STAP = 30; 
const ITEM_TYPES = ['📚', '✏️', '🍎', '🎒', '💣'];

export default function GameScreen() {
  const [rugzakX, setRugzakX] = useState(width / 2 - RUGZAK_BREEDTE / 2);
  const [item, setItem] = useState(null); 
  const [score, setScore] = useState(0);
  const [tijd, setTijd] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gestart, setGestart] = useState(false);


  const rugzakXRef = useRef(rugzakX);
  rugzakXRef.current = rugzakX;

  const nieuwItem = () => {
    const emoji = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    setItem({
      emoji,
      x: Math.random() * (width - ITEM_GROOTTE),
      y: 0,
      isBom: emoji === '💣',
    });
  };


  const startGame = () => {
    setScore(0);
    setTijd(30);
    setGameOver(false);
    setGestart(true);
    setRugzakX(width / 2 - RUGZAK_BREEDTE / 2);
    nieuwItem();
  };

  const beweegLinks = () => setRugzakX((x) => Math.max(0, x - STAP));
  const beweegRechts = () =>
    setRugzakX((x) => Math.min(width - RUGZAK_BREEDTE, x + STAP));

  useEffect(() => {
    if (!gestart || gameOver) return;
    if (tijd <= 0) {
      setGameOver(true);
      return;
    }
    const t = setTimeout(() => setTijd((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [tijd, gestart, gameOver]);

  useEffect(() => {
    if (!gestart || gameOver || !item) return;

    const interval = setInterval(() => {
      setItem((huidig) => {
        if (!huidig) return huidig;
        const nieuweY = huidig.y + 8;

        if (nieuweY >= SPEELVELD_HOOGTE - ITEM_GROOTTE) {
          const rugzak = rugzakXRef.current;
          const gevangen =
            huidig.x + ITEM_GROOTTE > rugzak &&
            huidig.x < rugzak + RUGZAK_BREEDTE;

          if (gevangen) {
            if (huidig.isBom) {
              setGameOver(true);
            } else {
              setScore((s) => s + 1); 
            }
          }

          const emoji = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
          return {
            emoji,
            x: Math.random() * (width - ITEM_GROOTTE),
            y: 0,
            isBom: emoji === '💣',
          };
        }

        return { ...huidig, y: nieuweY };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [gestart, gameOver, item !== null]);

  if (!gestart) {
    return (
      <View style={styles.center}>
        <Text style={styles.titel}>🎒 Vang de schoolspullen!</Text>
        <Text style={styles.uitleg}>
          Vang boeken, pennen en appels met je rugzak.{'\n'}
          Pas op voor bommen 💣 — die zijn game over!
        </Text>
        <Pressable style={styles.knop} onPress={startGame}>
          <Text style={styles.knopText}>Start</Text>
        </Pressable>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.center}>
        <Text style={styles.titel}>Game over!</Text>
        <Text style={styles.score}>Je score: {score}</Text>
        <Pressable style={styles.knop} onPress={startGame}>
          <Text style={styles.knopText}>Opnieuw spelen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hud}>Score: {score}</Text>
        <Text style={styles.hud}>Tijd: {tijd}s</Text>
      </View>

      <View style={styles.speelveld}>
        {item && (
          <Text style={[styles.item, { left: item.x, top: item.y }]}>
            {item.emoji}
          </Text>
        )}
        <Text style={[styles.rugzak, { left: rugzakX }]}>🎒</Text>
      </View>

      <View style={styles.knoppen}>
        <Pressable style={styles.beweegKnop} onPress={beweegLinks}>
          <Text style={styles.beweegText}>◀</Text>
        </Pressable>
        <Pressable style={styles.beweegKnop} onPress={beweegRechts}>
          <Text style={styles.beweegText}>▶</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.white },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: BRAND.white,
  },
  titel: { fontSize: 24, fontWeight: 'bold', color: BRAND.black, marginBottom: 16, textAlign: 'center' },
  uitleg: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  score: { fontSize: 20, color: BRAND.green, fontWeight: 'bold', marginBottom: 24 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: BRAND.green,
  },
  hud: { color: BRAND.white, fontSize: 18, fontWeight: 'bold' },

  speelveld: {
    height: SPEELVELD_HOOGTE,
    position: 'relative',
    backgroundColor: '#f4f8ee',
  },
  item: { position: 'absolute', fontSize: ITEM_GROOTTE },
  rugzak: { position: 'absolute', bottom: 0, fontSize: RUGZAK_BREEDTE },

  knoppen: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  beweegKnop: {
    backgroundColor: BRAND.green,
    width: 120,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beweegText: { color: BRAND.white, fontSize: 28, fontWeight: 'bold' },

  knop: {
    backgroundColor: BRAND.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  knopText: { color: BRAND.white, fontSize: 18, fontWeight: 'bold' },
});