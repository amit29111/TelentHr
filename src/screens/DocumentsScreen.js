import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const DocumentsScreen = () => {
  
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('ProfileScreen');
  };

  const [folders, setFolders] = useState([
    {
      id: '1',
      title: 'Personal documents',
      files: [
        { id: 'f1', name: 'Aadhar Card.pdf' },
        { id: 'f2', name: 'PAN Card.pdf' },
      ],
    },
    {
      id: '2',
      title: 'Legal documents',
      files: [
        { id: 'f1', name: 'Aadhar Card.pdf' },
        { id: 'f2', name: 'PAN Card.pdf' },
      ],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    if (editingFolder) {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === editingFolder.id
            ? { ...folder, title: newFolderName }
            : folder
        )
      );
    } else {
      const newFolder = {
        id: Date.now().toString(),
        title: newFolderName,
        files: [],
      };
      setFolders([...folders, newFolder]);
    }
    setNewFolderName('');
    setEditingFolder(null);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Folder', 'Are you sure you want to delete this folder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setFolders((prev) => prev.filter((f) => f.id !== id));
        },
      },
    ]);
  };

  const handleRename = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.title);
    setModalVisible(true);
  };

  const renderFolder = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FolderDetailScreen', { folder: item })}
    >
      <View style={styles.card}>
        <Image
          source={require('../../src/assets/folder.png')}
          style={styles.folderImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {item.files?.length || 0} Files | 0 Folders
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Options', item.title, [
              { text: 'Rename', onPress: () => handleRename(item) },
              {
                text: 'Delete',
                onPress: () => handleDelete(item.id),
                style: 'destructive',
              },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
           <Image
                      source={require('../assets/victorIconImage/arrowLeft.png')}
                      style={[styles.eyeImage, {opacity: secureText ? 0.6 : 1}]}
                      resizeMode="contain"
                    />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
           <Image
            source={require('../assets/victorIconImage/arrowLeft.png')}
            style={[styles.eyeImage, {opacity: secureText ? 0.6 : 1}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
      </View>


      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={renderFolder}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add New Folder */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+ New</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingFolder(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingFolder ? 'Rename Folder' : 'Create New Folder'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingFolder(null);
                  setNewFolderName('');
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddFolder}>
                <Text style={{ color: '#fff' }}>
                  {editingFolder ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2E0',
  },
   header: {
    backgroundColor: '#FFDAC6',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // center main axis par
  },
  backButton: {
    position: 'absolute', 
    left: 15,              // left corner mai fix ho jayega
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Lato-Bold', // Lato Bold font use karega
    fontWeight: 'bold',      // extra boldness ensure karega
    color: '#5C3C45',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    width: 380,
    height: 86,
    marginTop: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius:10,
  },
  folderImage: {
    width: 61,
    height: 51,
    marginRight: 14,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#402530',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontFamily: 'Acme-Regular',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    backgroundColor: '#5A2A55',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});