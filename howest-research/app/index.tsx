import ExternalScreen from "@/components/screens/externalDisplay";
import Ipad from "@/components/screens/ipad";
import React, { useRef, useState } from "react";
import { StyleSheet } from 'react-native';
import ExternalDisplay, {
  useExternalDisplay,
} from 'react-native-external-display';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const HomeScreen = () => {
  const [page, setPage] = useState(
    {
      page: 'discover', //idle, discover, gallery, about, detailResearch, detailKeyWord, searchResults, search, filter
      id: null,
      previousPages: [],
      isLoading: {
        ipad: false,
        externalDisplay: false
      },
      isTouched: false
    }
  );

  const timerRef = useRef<any>(null);

  const handleTouchStart = () => {
    console.log('pressed');
    if (timerRef.current) {
      console.log('Timer already exists, clearing it');
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPage(prev => ({ ...prev, isTouched: true }));
  };

  const handleTouchEnd = () => {
    console.log('ended');
    timerRef.current = setTimeout(() => {
      console.log('Timer ended, setting isTouched false');
      setPage(prev => ({ ...prev, isTouched: false }));
    }, 180000);
  };

  const screens = useExternalDisplay();
  const screenIds = Object.keys(screens);
  const screenCount = screenIds.length;  //if total screen count is 1 --> external screen is connected!
  console.log('screens', screens);

  //-------------------- External screen connected --------------------//
  if (screenCount > 0) {
    return (
      <>
        <ExternalDisplay
          mainScreenStyle={styles.container}
          fallbackInMainScreen
          screen={Object.keys(screens)[0]}
          style={{ flex: 1 }}
        >
          <ExternalScreen screen={screens} page={page} setPage={setPage} />
        </ExternalDisplay>

        <GestureHandlerRootView
          style={{ flex: 1 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <Ipad page={page} setPage={setPage} />
        </GestureHandlerRootView>
      </>
    )


    //-------------------- No external screen connected --------------------//
  } else {
    return (
      <GestureHandlerRootView
        style={{ flex: 1 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <Ipad page={page} setPage={setPage} />
      </GestureHandlerRootView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default HomeScreen;