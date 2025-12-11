import ExternalScreen from "@/components/screens/externalDisplay";
import Ipad from "@/components/screens/ipad";
import React, { useState } from "react";
import { StyleSheet } from 'react-native';
import ExternalDisplay, {
  useExternalDisplay,
} from 'react-native-external-display';


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
    }
  );

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

        <Ipad page={page} setPage={setPage}/>
      </>
    )


    //-------------------- No external screen connected --------------------//
  } else {
    return (
      <Ipad page={page} setPage={setPage} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default HomeScreen;