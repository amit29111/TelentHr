import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export const DownloadIcon = ({size = 20, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4v10m0 0l3.5-3.5M12 14l-3.5-3.5M5 18h14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DownloadIconButton = ({
  onPress,
  loading = false,
  disabled = false,
  size = 36,
  backgroundColor = '#2D3A8C',
  iconColor = '#fff',
  iconSize = 20,
  style,
}) => (
  <TouchableOpacity
    style={[
      styles.btn,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
      },
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}>
    {loading ? (
      <ActivityIndicator size="small" color={iconColor} />
    ) : (
      <DownloadIcon size={iconSize} color={iconColor} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DownloadIconButton;
