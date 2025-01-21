// Import necessary components
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

// Your existing container style
const styles = StyleSheet.create({
  container: {
    // Your existing styles
  },
  // Add a new style for the category scroll view
  categoryScrollView: {
    flexDirection: 'row', // Arrange items horizontally
    paddingVertical: 10, // Some vertical padding
    paddingHorizontal: 20, // Some horizontal padding
  },
  categoryItem: {
    marginRight: 15,
    alignItems: 'center', // 垂直居中
    borderRadius: 20, // 圆角
    padding: 10, // 内边距
  },
});

// Inside your component
const MovieCategories = () => {
  const categories = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror']; // Example categories

  return (
    <View style={styles.container}>
      {/* Other components and styles */}
      
      {/* Horizontal scrollable section for categories */}
      <ScrollView
        horizontal // Enables horizontal scrolling
        showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
        contentContainerStyle={styles.categoryScrollView}
      >
        {categories.map((category, index) => (
        <LinearGradient
            key={index}
            colors={['#ff7e5f', '#feb47b']} // 渐变颜色
            style={styles.categoryItem}
          >
          <Text>
            {category}
          </Text>
        </LinearGradient>
        ))}
      </ScrollView>

      {/* Other components and styles */}
    </View>
  );
};

export default MovieCategories;