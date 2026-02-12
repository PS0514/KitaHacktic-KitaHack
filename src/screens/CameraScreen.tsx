import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { EmergencyButton } from '../components/EmergencyButton';
import { useDwellSelection } from '../hooks/useDwellSelection';
import { Reticle } from '../components/Reticle';
import { Header } from '../components/Header';

/**
 * Match Header height
 */
const HEADER_HEIGHT = 74;

/**
 * Keyword type system
 */
type Keyword = {
  id: string;
  label: 'HELP' | 'EMERGENCY' | 'PAIN' | 'WATER' | 'FOOD';
  type: 'static' | 'dynamic';
};

export function CameraScreen() {

  const device = useCameraDevice('back');

  const [hasPermission, setHasPermission] = useState(false);

  /**
   * STATIC KEYWORDS (always present)
   */
  const staticKeywords: Keyword[] = [
    { id: 'HELP', label: 'HELP', type: 'static' },
    { id: 'EMERGENCY', label: 'EMERGENCY', type: 'static' },
    { id: 'PAIN', label: 'PAIN', type: 'static' },
    { id: 'WATER', label: 'WATER', type: 'static' },
    { id: 'FOOD', label: 'FOOD', type: 'static' },
  ];

  /**
   * DYNAMIC KEYWORDS (future AI / teammate control)
   */
  const [dynamicKeywords, setDynamicKeywords] = useState<Keyword[]>([]);

  /**
   * Example future usage (teammate can modify)
   */
  /*
  useEffect(() => {
    setDynamicKeywords([
      { id: 'MEDICINE', label: 'HELP', type: 'dynamic' },
    ]);
  }, []);
  */

  const {
    active,
    confirmedId,
    progress,
    startDwell,
    cooldown,
  } = useDwellSelection({
    onConfirm: payload => {
      console.log('Confirmed:', payload.label);
    },
  });

  useEffect(() => {
    async function init() {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    }
    init();
  }, []);

  const handleEmergency = useCallback(
    (label: Keyword['label']) => {

      if (cooldown) return;

      startDwell({
        id: label,
        type: 'emergency',
        label,
      });

    },
    [cooldown, startDwell],
  );

  const showCamera = hasPermission && device != null;

  /**
   * Render keyword button
   */
  const renderKeyword = (keyword: Keyword) => (
    <EmergencyButton
      key={keyword.id}
      label={keyword.label}
      isActive={active?.id === keyword.id}
      isConfirmed={confirmedId === keyword.id}
      onPressFallback={() => handleEmergency(keyword.label)}
    />
  );

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Header />

      <View
        style={[
          styles.content,
          {
            paddingTop: HEADER_HEIGHT + 8,
          },
        ]}
      >

        {/* KEYWORD PANEL */}
        <View style={styles.panel}>

          {/* STATIC KEYWORDS */}
          <View style={styles.buttonRow}>
            {staticKeywords.slice(0, 3).map(renderKeyword)}
          </View>

          <View style={[styles.buttonRow, styles.buttonRowBottom]}>
            {staticKeywords.slice(3, 5).map(renderKeyword)}
          </View>

          {/* DYNAMIC KEYWORDS */}
          {dynamicKeywords.length > 0 && (
            <>
              <Text style={styles.dynamicTitle}>
                Suggested
              </Text>

              <View style={styles.buttonRow}>
                {dynamicKeywords.map(renderKeyword)}
              </View>
            </>
          )}

        </View>


        {/* CAMERA CARD — UNCHANGED SIZE */}
        <View style={styles.cameraCard}>

          <View style={styles.cameraInner}>

            {showCamera ? (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive
              />
            ) : (
              <View style={styles.permissionPlaceholder}>
                <Text style={styles.placeholderText}>
                  Camera permission required
                </Text>
              </View>
            )}

            <Reticle progress={active ? progress : 0} />

            <View style={styles.readyBadge}>
              <Text style={styles.badgeText}>
                Ready
              </Text>
            </View>

            <View style={styles.detectedBadge}>
              <Text style={styles.badgeText}>
                0 objects detected
              </Text>
            </View>

            <View style={styles.startButtonContainer}>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>
                  Start Scanning
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },

  panel: {
    backgroundColor: '#020617',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.4)',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonRowBottom: {
    marginTop: 12,
    paddingHorizontal: 28,
  },

  dynamicTitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 6,
  },

  cameraCard: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },

  cameraInner: {
    flex: 1,
  },

  readyBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },

  detectedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },

  badgeText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },

  startButtonContainer: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
  },

  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },

  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  permissionPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#cbd5e1',
  },

});
