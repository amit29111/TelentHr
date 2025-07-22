import React, {useState} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

const DocumentsScreen = ({navigation}) => {
  const [folders, setFolders] = useState([
    {
      id: '1',
      title: 'Personal documents',
      files: [
        {id: 'f1', name: 'Aadhar Card.pdf'},
        {id: 'f2', name: 'PAN Card.pdf'},
      ],
    },
    {
      id: '2',
      title: 'Legal documents',
      files: [
        {id: 'f1', name: 'Aadhar Card.pdf'},
        {id: 'f2', name: 'PAN Card.pdf'},
      ],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    if (editingFolder) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === editingFolder.id
            ? {...folder, title: newFolderName}
            : folder,
        ),
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

  const handleDelete = id => {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFolders(prev => prev.filter(f => f.id !== id));
          },
        },
      ],
    );
  };

  const handleRename = folder => {
    setEditingFolder(folder);
    setNewFolderName(folder.title);
    setModalVisible(true);
  };

  const renderFolder = ({item}) => (
    <TouchableOpacity
     
      onPress={() => navigation.navigate('FolderDetailScreen', {folder: item})}>
      <View style={styles.card}>
        <Image
          source={require('../../src/assets/folder.png')}
          style={styles.folderImage}
        />
        <View style={{flex: 1}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {item.files?.length || 0} Files | 0 Folders
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Options', item.title, [
              {text: 'Rename', onPress: () => handleRename(item)},
              {
                text: 'Delete',
                onPress: () => handleDelete(item.id),
                style: 'destructive',
              },
              {text: 'Cancel', style: 'cancel'},
            ]);
          }}>
          <Ionicons name="ellipsis-vertical" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
      </View>

      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={renderFolder}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add New Folder */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
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
        }}>
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
                style={[styles.modalBtn, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingFolder(null);
                  setNewFolderName('');
                }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleAddFolder}>
                <Text style={{color: '#fff'}}>
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
    backgroundColor: '#FFDCC8',
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A2A55',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    width:346,
    height:86,
    marginTop:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    
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
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: '#5A2A55',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    elevation: 5,
    backgroundColor:'#402530',
    borderRadius:15,
  },
  fabText: {
    width:96,
    height:51,
    color: '#FFFFFF',
    fontFamily:'Acme-Regular',
    fontWeight:'bold',
    fontSize: 20,
    textAlign:'center',
    justifyContent:'center'
    
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
