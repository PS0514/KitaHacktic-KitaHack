import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyButton } from '../components/EmergencyButton';
import { useDwellSelection } from '../hooks/useDwellSelection';
import { speakObject } from '../utils/speakObject';

const SELECTION_RADIUS = 60;

export function CameraScreen() {
  const device = useCameraDevice('back');
  const insets = useSafeAreaInsets();

  const [hasPermission, setHasPermission] = useState(false);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const { active, confirmedId, progress, startDwell, cooldown } = useDwellSelection({
    onConfirm: payload => {
      speakObject(payload.label);
    },
  });

  useEffect(() => {
    let isMounted = true;
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      if (isMounted) setHasPermission(status === 'granted');
    };
    requestPermission();
    return () => { isMounted = false; };
  }, []);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  }, []);

  const selectionCenter = useMemo(() => ({
    x: layout.width / 2,
    y: layout.height / 2,
  }), [layout.width, layout.height]);

  const handleEmergency = useCallback((label: 'HELP' | 'PAIN') => {
    speakObject(label);
    if (cooldown) return;
    startDwell({ id: label, type: 'emergency', label });
  }, [cooldown, startDwell]);

  const showCamera = hasPermission && device != null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent />

      {/* HEADER: Branding only */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.branding}>
          <Text style={styles.title}>MindLens</Text>
          <View style={styles.statusRow}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      {/* CAMERA CONTAINER */}
      <View style={styles.cameraWrapper} onLayout={handleLayout}>
        {showCamera ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
          />
        ) : (
          <View style={styles.permissionPlaceholder}>
            <Text style={styles.placeholderText}>Camera permission required</Text>
          </View>
        )}

        {/* BUTTON OVERLAYS: Placed inside camera view corners */}
        <View style={styles.buttonOverlayContainer} pointerEvents="box-none">
          <EmergencyButton
            label="HELP"
            isActive={active?.id === 'HELP'}
            isConfirmed={confirmedId === 'HELP'}
            dwellProgress={active?.id === 'HELP' ? progress : 0}
            onPressFallback={() => handleEmergency('HELP')}
          />

          <EmergencyButton
            label="PAIN"
            isActive={active?.id === 'PAIN'}
            isConfirmed={confirmedId === 'PAIN'}
            dwellProgress={active?.id === 'PAIN' ? progress : 0}
            onPressFallback={() => handleEmergency('PAIN')}
          />
        </View>

        {/* Selection Circle Overlay */}
        <View style={styles.overlay} pointerEvents="none">
          <View
            style={[
              styles.selectionZone,
              {
                left: selectionCenter.x - SELECTION_RADIUS,
                top: selectionCenter.y - SELECTION_RADIUS,
                width: SELECTION_RADIUS * 2,
                height: SELECTION_RADIUS * 2,
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  headerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#0a0f1d',
  },
  branding: {
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  buttonOverlayContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  selectionZone: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  permissionPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 14,
  },
});