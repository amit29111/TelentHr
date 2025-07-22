import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

const FolderDetailScreen = ({ route, navigation }) => {
  const { folder } = route.params;
  const [files, setFiles] = useState(folder.files || []);

  const handleDeleteFile = (id) => {
    Alert.alert('Delete File', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => setFiles((prev) => prev.filter((f) => f.id !== id)),
      },
    ]);
  };

  const renderFile = ({ item }) => (
    <View style={styles.fileItem}>
      <Text style={styles.fileName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDeleteFile(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder.title}</Text>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={renderFile}
        ListEmptyComponent={<Text style={styles.empty}>No files uploaded</Text>}
      />
    </View>
  );
};

export default FolderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF2E9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A2A55',
    marginBottom: 12,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileName: {
    fontSize: 16,
  },
  deleteText: {
    color: 'red',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});