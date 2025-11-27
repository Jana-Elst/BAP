import ExternalScreen from "@/components/screens/externalDisplay";
import Ipad from "@/components/screens/ipad";
import React, { useState } from "react";
import { Text, View } from 'react-native';
import ExternalDisplay, {
  useExternalDisplay,
} from 'react-native-external-display';


export default function HomeScreen() {
  const [page, setPage] = useState(
    {
      page: 'discover', //discover, gallery, about, detailResearch, detailKeyWord, searchResults, search, filter
      id: null,
      previousPages: []
    }
  );

  //if total screen count is 1 --> external screen is connected!
  const screens = useExternalDisplay();
  const screenIds = Object.keys(screens);
  const screenCount = screenIds.length;

  console.log(screens);

  if (screenCount > 0) {
    return (
      <>
        <ExternalDisplay
          mainScreenStyle={{ flex: 1 }}
          fallbackInMainScreen
          screen={Object.keys(screens)[0]}
        // screen={screenIds[0]}
        >
          <ExternalScreen page={page} />
        </ExternalDisplay>

        <Ipad page={page} setPage={setPage} />
      </>
    )


    //No external screen connected
  } else {
    return (
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <Ipad page={page} setPage={setPage} />

        {/* <ExternalScreen page={{
          page: 'detailResearch',
          id: 878,
          previousPages: []
        }} /> */}
      </View>
    )
  }
}