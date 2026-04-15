  import React, { useEffect, useState } from 'react';
  import { View, Text, Dimensions, StyleSheet } from 'react-native';
  import { BarChart } from 'react-native-gifted-charts';
  import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

  const { width } = Dimensions.get('window');

  const BarChartComponent = () => {
    const [selectedBar, setSelectedBar] = useState(null);

    // Define data first
    const data = [
      { value: 50, label: 'Jan', id: 1 },
      { value: 80, label: 'Feb', id: 2 },
      { value: 90, label: 'Mar', id: 3 },
      { value: 70, label: 'Apr', id: 4 },
      { value: 60, label: 'May', id: 5 },
    ];

    // Initialize animatedValues after data
    const animatedValues = data.map(() => useSharedValue(0));

    useEffect(() => {
      // Animate bars on mount
      animatedValues.forEach((animatedValue, index) => {
        animatedValue.value = withTiming(data[index].value, { duration: 1000 });
      });
    }, [animatedValues]);

    const handleBarPress = (item) => {
      setSelectedBar(item);
    };

    return (
      <View style={styles.container}>
        <BarChart
          data={data.map((item, index) => ({
            ...item,
            // Apply animation to bar height
            value: animatedValues[index].value,
          }))}
          width={width - 32}
          height={220}
          barWidth={40}
          spacing={10}
          noOfSections={5}
          barBorderRadius={4}
          frontColor={'#FF6B6B'}
          yAxisThickness={0}
          xAxisThickness={0}
          showFractionalValues={false}
          showYAxisIndices={false}
          showXAxisIndices={false}
          onPress={handleBarPress}
        />
        {selectedBar && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Selected: {selectedBar.label} - Value: {selectedBar.value}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'red',
    },
    infoContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 8,
    },
    infoText: {
      fontSize: 16,
      color: '#333',
    },
  });

  export default BarChartComponent;