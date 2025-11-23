import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import DiscoverCard from "../../components/discoverCard";
import DetailPage from "@/components/detailPage";
import DetailKeyword from "@/components/detailKeyword";

export default function HomeScreen() {
  const projects = data.projects;
  const domains = data.transitiedomeinen;
  const keywords = data.keywords;
  const clusters = data.clusters;

  const projectImages = {};

  const [page, setPage] = useState(
    {
      page: 'discover', //discover, gallery, about, detailResearch, detailKeyWord, searchResults, search, filter
      id: null,
      previousPages: []
    }
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={projects}
        renderItem={({ item: project }) =>
          <DiscoverCard project={project} page={page} setPage={setPage} />
        }
        estimatedItemSize={200}
      />

      {
        page.page === 'detailResearch' &&
        (
          <View style={styles.detail}>
            <DetailPage project={projects.find(p => p.ID === page.id)} page={page} setPage={setPage} />
          </View>
        )
      }

      {
        page.page === 'detailKeyword' &&
        (
          <View style={styles.detail}>
            <DetailKeyword keyword={keywords.find(k => k.ID === page.id)} page={page} setPage={setPage} />
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detail: {
    position: 'absolute',
    // top: '50%',
    // left: '50%',
  },
  projectCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  clusterLabel: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 13,
    color: '#3730a3',
    fontWeight: '500',
  },
  separator: {
    height: 8,
  },
});