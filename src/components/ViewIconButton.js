import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

export const ViewIcon = ({size = 20, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
  </Svg>
);

const ViewIconButton = ({
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
      <ViewIcon size={iconSize} color={iconColor} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ViewIconButton;
