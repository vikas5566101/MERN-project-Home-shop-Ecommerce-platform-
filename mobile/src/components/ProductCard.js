import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress }) {
  // If no product is provided, render null or a fallback
  if (!product) return null;

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl shadow-sm p-4 m-2 flex-1 max-w-[45%]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View className="h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
        <Image 
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      
      {/* Product Info */}
      <View className="flex-col">
        {product.brand ? (
          <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1" numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}
        
        <Text className="text-sm font-semibold text-gray-800 mb-1" numberOfLines={2}>
          {product.name}
        </Text>
        
        <View className="flex-row items-center mt-1">
          <Text className="text-lg font-bold text-blue-600">
            ${product.price?.toFixed(2)}
          </Text>
          {product.discount > 0 && (
            <Text className="text-xs text-gray-400 line-through ml-2">
              ${(product.price / (1 - product.discount / 100)).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
