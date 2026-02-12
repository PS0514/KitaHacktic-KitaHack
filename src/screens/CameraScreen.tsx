import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyButton } from '../components/EmergencyButton';
import { useDwellSelection } from '../hooks/useDwellSelection';
import { Reticle } from '../components/Reticle';

type EmergencyLabel =
  | 'HELP'
  | 'EMERGENCY'
  | 'PAIN'
  | 'WATER'
  | 'FOOD';

export function CameraScreen() {

  const device = useCameraDevice('back');
  const insets = useSafeAreaInsets();

  const [hasPermission, setHasPermission] = useState(false);

  /**
   * Dwell selection system
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

  /**
   * Camera Permission Init
   */
  useEffect(() => {

    async function init() {

      const permission = await Camera.requestCameraPermission();

      setHasPermission(permission === 'granted');

    }

    init();

  }, []);

  /**
   * Emergency Button Handler
   */
  const handleEmergency = useCallback(

    (label: EmergencyLabel) => {

      if (cooldown) return;

      startDwell({
        id: label,
        type: 'emergency',
        label,
      });

    },

    [cooldown, startDwell]

  );

  const showCamera = hasPermission && device != null;

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* ========================= */}
      {/* Frosted Glass Header */}
      {/* ========================= */}

      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + 8,
          },
        ]}
      >

        <View style={styles.headerGlass}>

          <Text style={styles.title}>
            MindLens
          </Text>

          <View style={styles.statusRow}>

            <View style={styles.greenDot} />

            <Text style={styles.statusText}>
              SYSTEM ACTIVE
            </Text>

          </View>

        </View>

      </View>


      {/* ========================= */}
      {/* Camera Layer */}
      {/* ========================= */}

      <View style={styles.cameraWrapper}>

        {showCamera ? (

          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={false}
            video={false}
          />

        ) : (

          <View style={styles.permissionPlaceholder}>
            <Text style={styles.placeholderText}>
              Camera permission required
            </Text>
          </View>

        )}


        {/* ========================= */}
        {/* Vision HUD Reticle */}
        {/* ========================= */}

        <Reticle progress={active ? progress : 0} />


        {/* ========================= */}
        {/* Emergency Control Panel */}
        {/* ========================= */}

        <View style={styles.panel}>

          {/* Row 1 */}

          <View style={styles.row}>

            <EmergencyButton
              label="HELP"
              isActive={active?.id === 'HELP'}
              isConfirmed={confirmedId === 'HELP'}
              dwellProgress={active?.id === 'HELP' ? progress : 0}
              onPressFallback={() => handleEmergency('HELP')}
            />

            <EmergencyButton
              label="EMERGENCY"
              isActive={active?.id === 'EMERGENCY'}
              isConfirmed={confirmedId === 'EMERGENCY'}
              dwellProgress={active?.id === 'EMERGENCY' ? progress : 0}
              onPressFallback={() => handleEmergency('EMERGENCY')}
            />

            <EmergencyButton
              label="PAIN"
              isActive={active?.id === 'PAIN'}
              isConfirmed={confirmedId === 'PAIN'}
              dwellProgress={active?.id === 'PAIN' ? progress : 0}
              onPressFallback={() => handleEmergency('PAIN')}
            />

          </View>


          {/* Row 2 */}

          <View style={styles.rowCenter}>

            <EmergencyButton
              label="WATER"
              isActive={active?.id === 'WATER'}
              isConfirmed={confirmedId === 'WATER'}
              dwellProgress={active?.id === 'WATER' ? progress : 0}
              onPressFallback={() => handleEmergency('WATER')}
            />

            <EmergencyButton
              label="FOOD"
              isActive={active?.id === 'FOOD'}
              isConfirmed={confirmedId === 'FOOD'}
              dwellProgress={active?.id === 'FOOD' ? progress : 0}
              onPressFallback={() => handleEmergency('FOOD')}
            />

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


  /**
   * Header
   */
  headerContainer: {

    position: 'absolute',

    width: '100%',

    alignItems: 'center',

    zIndex: 50,

  },


  headerGlass: {

    backgroundColor: 'rgba(15,23,42,0.55)',

    borderRadius: 22,

    paddingHorizontal: 24,
    paddingVertical: 12,

    alignItems: 'center',

    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.18)',

  },


  title: {

    color: '#e2e8f0',

    fontSize: 22,

    fontWeight: '700',

    letterSpacing: 0.6,

  },


  statusRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 4,

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

    fontSize: 11,

    fontWeight: '700',

    letterSpacing: 1,

  },


  /**
   * Camera Layer
   */

  cameraWrapper: {

    flex: 1,

  },


  /**
   * Emergency Panel
   */

  panel: {

    position: 'absolute',

    top: 110,

    left: 16,
    right: 16,

    backgroundColor: 'rgba(15,23,42,0.82)',

    borderRadius: 26,

    padding: 18,

    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.1)',

  },


  row: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 14,

  },


  rowCenter: {

    flexDirection: 'row',

    justifyContent: 'center',

    gap: 12,

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
