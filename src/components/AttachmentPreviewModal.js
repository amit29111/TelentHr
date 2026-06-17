import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const AttachmentPreviewModal = ({visible, source, onClose}) => {
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setLoading(true);
      setFailed(false);
    }
  }, [visible, source?.uri]);

  if (!source?.uri) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {source.title || 'Attachment Preview'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color="#111" />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" color="#2952E3" style={styles.loader} />
          ) : null}
          {failed ? (
            <Text style={styles.errorText}>Could not load image preview.</Text>
          ) : (
            <Image
              source={{
                uri: source.uri,
                headers: source.headers,
              }}
              style={styles.image}
              resizeMode="contain"
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AttachmentPreviewModal;

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#111'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  title: {flex: 1, fontSize: 15, fontWeight: '700', color: '#111', marginRight: 12},
  closeBtn: {padding: 4},
  body: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111'},
  image: {width: '100%', height: '100%'},
  loader: {position: 'absolute'},
  errorText: {color: '#fff', fontSize: 14},
});
